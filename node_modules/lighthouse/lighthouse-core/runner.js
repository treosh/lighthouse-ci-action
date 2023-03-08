/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const isDeepEqual = require('lodash/isEqual.js');
const Driver = require('./gather/driver.js');
const GatherRunner = require('./gather/gather-runner.js');
const ReportScoring = require('./scoring.js');
const Audit = require('./audits/audit.js');
const log = require('lighthouse-logger');
const format = require('../shared/localization/format.js');
const stackPacks = require('./lib/stack-packs.js');
const assetSaver = require('./lib/asset-saver.js');
const fs = require('fs');
const path = require('path');
const Sentry = require('./lib/sentry.js');
const generateReport = require('../report/generator/report-generator.js').generateReport;
const LHError = require('./lib/lh-error.js');
const {version: lighthouseVersion} = require('../package.json');

/** @typedef {import('./gather/connections/connection.js')} Connection */
/** @typedef {import('./lib/arbitrary-equality-map.js')} ArbitraryEqualityMap */
/** @typedef {LH.Config.Config} Config */

class Runner {
  /**
   * @template {LH.Config.Config | LH.Config.FRConfig} TConfig
   * @param {LH.Artifacts} artifacts
   * @param {{config: TConfig, driverMock?: Driver, computedCache: Map<string, ArbitraryEqualityMap>}} options
   * @return {Promise<LH.RunnerResult|undefined>}
   */
  static async audit(artifacts, options) {
    const {config, computedCache} = options;
    const settings = config.settings;

    try {
      const runnerStatus = {msg: 'Audit phase', id: 'lh:runner:audit'};
      log.time(runnerStatus, 'verbose');

      /**
       * List of top-level warnings for this Lighthouse run.
       * @type {Array<string | LH.IcuMessage>}
       */
      const lighthouseRunWarnings = [];

      // Potentially quit early
      if (settings.gatherMode && !settings.auditMode) return;

      if (!config.audits) {
        throw new Error('No audits to evaluate.');
      }
      const auditResultsById = await Runner._runAudits(settings, config.audits, artifacts,
          lighthouseRunWarnings, computedCache);

      // LHR construction phase
      const resultsStatus = {msg: 'Generating results...', id: 'lh:runner:generate'};
      log.time(resultsStatus);

      if (artifacts.LighthouseRunWarnings) {
        lighthouseRunWarnings.push(...artifacts.LighthouseRunWarnings);
      }

      // Entering: conclusion of the lighthouse result object

      // Use version from gathering stage.
      // If accessibility gatherer didn't run or errored, it won't be in credits.
      const axeVersion = artifacts.Accessibility?.version;
      const credits = {
        'axe-core': axeVersion,
      };

      /** @type {Record<string, LH.RawIcu<LH.Result.Category>>} */
      let categories = {};
      if (config.categories) {
        categories = ReportScoring.scoreAllCategories(config.categories, auditResultsById);
      }

      log.timeEnd(resultsStatus);
      log.timeEnd(runnerStatus);

      /** @type {LH.RawIcu<LH.Result>} */
      const i18nLhr = {
        lighthouseVersion,
        requestedUrl: artifacts.URL.requestedUrl,
        finalUrl: artifacts.URL.finalUrl,
        fetchTime: artifacts.fetchTime,
        gatherMode: artifacts.GatherContext.gatherMode,
        runtimeError: Runner.getArtifactRuntimeError(artifacts),
        runWarnings: lighthouseRunWarnings,
        userAgent: artifacts.HostUserAgent,
        environment: {
          networkUserAgent: artifacts.NetworkUserAgent,
          hostUserAgent: artifacts.HostUserAgent,
          benchmarkIndex: artifacts.BenchmarkIndex,
          credits,
        },
        audits: auditResultsById,
        configSettings: settings,
        categories,
        categoryGroups: config.groups || undefined,
        stackPacks: stackPacks.getStackPacks(artifacts.Stacks),
        timing: this._getTiming(artifacts),
        i18n: {
          rendererFormattedStrings: format.getRendererFormattedStrings(settings.locale),
          icuMessagePaths: {},
        },
      };

      // Replace ICU message references with localized strings; save replaced paths in lhr.
      i18nLhr.i18n.icuMessagePaths = format.replaceIcuMessages(i18nLhr, settings.locale);

      // LHR has now been localized.
      const lhr = /** @type {LH.Result} */ (i18nLhr);

      // Save lhr to ./latest-run, but only if -GA is used.
      if (settings.gatherMode && settings.auditMode) {
        const path = Runner._getDataSavePath(settings);
        assetSaver.saveLhr(lhr, path);
      }

      // Create the HTML, JSON, and/or CSV string
      const report = generateReport(lhr, settings.output);

      return {lhr, artifacts, report};
    } catch (err) {
      throw Runner.createRunnerError(err, settings);
    }
  }

  /**
   * User can run -G solo, -A solo, or -GA together
   * -G and -A will run partial lighthouse pipelines,
   * and -GA will run everything plus save artifacts and lhr to disk.
   *
   * @template {LH.Config.Config | LH.Config.FRConfig} TConfig
   * @param {(runnerData: {config: TConfig, driverMock?: Driver}) => Promise<LH.Artifacts>} gatherFn
   * @param {{config: TConfig, driverMock?: Driver, computedCache: Map<string, ArbitraryEqualityMap>}} options
   * @return {Promise<LH.Artifacts>}
   */
  static async gather(gatherFn, options) {
    const settings = options.config.settings;

    // Either load saved artifacts from disk or from the browser.
    try {
      const sentryContext = Sentry.getContext();
      Sentry.captureBreadcrumb({
        message: 'Run started',
        category: 'lifecycle',
        data: sentryContext,
      });

      /** @type {LH.Artifacts} */
      let artifacts;
      if (settings.auditMode && !settings.gatherMode) {
        // No browser required, just load the artifacts from disk.
        const path = this._getDataSavePath(settings);
        artifacts = assetSaver.loadArtifacts(path);
        const requestedUrl = artifacts.URL.requestedUrl;

        if (!requestedUrl) {
          throw new Error('Cannot run audit mode on empty URL');
        }
      } else {
        const runnerStatus = {msg: 'Gather phase', id: 'lh:runner:gather'};
        log.time(runnerStatus, 'verbose');

        artifacts = await gatherFn({
          config: options.config,
          driverMock: options.driverMock,
        });

        log.timeEnd(runnerStatus);

        // If `gather` is run multiple times before `audit`, the timing entries for each `gather` can pollute one another.
        // We need to clear the timing entries at the end of gathering.
        // Set artifacts.Timing again to ensure lh:runner:gather is included.
        artifacts.Timing = log.takeTimeEntries();

        // -G means save these to disk (e.g. ./latest-run).
        if (settings.gatherMode) {
          const path = this._getDataSavePath(settings);
          await assetSaver.saveArtifacts(artifacts, path);
        }
      }

      return artifacts;
    } catch (err) {
      throw Runner.createRunnerError(err, settings);
    }
  }

  /**
   * @param {any} err
   * @param {LH.Config.Settings} settings
   */
  static createRunnerError(err, settings) {
    // i18n LighthouseError strings.
    if (err.friendlyMessage) {
      err.friendlyMessage = format.getFormatted(err.friendlyMessage, settings.locale);
    }
    Sentry.captureException(err, {level: 'fatal'});
    return err;
  }

  /**
   * This handles both the auditMode case where gatherer entries need to be merged in and
   * the gather/audit case where timingEntriesFromRunner contains all entries from this run,
   * including those also in timingEntriesFromArtifacts.
   * @param {LH.Artifacts} artifacts
   * @return {LH.Result.Timing}
   */
  static _getTiming(artifacts) {
    const timingEntriesFromArtifacts = artifacts.Timing || [];
    const timingEntriesFromRunner = log.takeTimeEntries();
    const timingEntriesKeyValues = [
      ...timingEntriesFromArtifacts,
      ...timingEntriesFromRunner,
    ].map(entry => /** @type {[string, PerformanceEntry]} */ ([
      // As entries can share a name and start time, dedupe based on the name, startTime and duration
      `${entry.startTime}-${entry.name}-${entry.duration}`,
      entry,
    ]));
    const timingEntries = Array.from(new Map(timingEntriesKeyValues).values())
    // Truncate timestamps to hundredths of a millisecond saves ~4KB. No need for microsecond
    // resolution.
    .map(entry => {
      return {
        // Don't spread entry because browser PerformanceEntries can't be spread.
        // https://github.com/GoogleChrome/lighthouse/issues/8638
        startTime: parseFloat(entry.startTime.toFixed(2)),
        name: entry.name,
        duration: parseFloat(entry.duration.toFixed(2)),
        entryType: entry.entryType,
      };
    }).sort((a, b) => a.startTime - b.startTime);
    const gatherEntry = timingEntries.find(e => e.name === 'lh:runner:gather');
    const auditEntry = timingEntries.find(e => e.name === 'lh:runner:audit');
    const gatherTiming = gatherEntry?.duration || 0;
    const auditTiming = auditEntry?.duration || 0;
    return {entries: timingEntries, total: gatherTiming + auditTiming};
  }

  /**
   * Establish connection, load page and collect all required artifacts
   * @param {string} requestedUrl
   * @param {{config: Config, computedCache: Map<string, ArbitraryEqualityMap>, driverMock?: Driver}} runnerOpts
   * @param {Connection} connection
   * @return {Promise<LH.Artifacts>}
   */
  static async _gatherArtifactsFromBrowser(requestedUrl, runnerOpts, connection) {
    if (!runnerOpts.config.passes) {
      throw new Error('No browser artifacts are either provided or requested.');
    }
    const driver = runnerOpts.driverMock || new Driver(connection);
    const gatherOpts = {
      driver,
      requestedUrl,
      settings: runnerOpts.config.settings,
      computedCache: runnerOpts.computedCache,
    };
    const artifacts = await GatherRunner.run(runnerOpts.config.passes, gatherOpts);
    return artifacts;
  }

  /**
   * Run all audits with specified settings and artifacts.
   * @param {LH.Config.Settings} settings
   * @param {Array<LH.Config.AuditDefn>} audits
   * @param {LH.Artifacts} artifacts
   * @param {Array<string | LH.IcuMessage>} runWarnings
   * @param {Map<string, ArbitraryEqualityMap>} computedCache
   * @return {Promise<Record<string, LH.RawIcu<LH.Audit.Result>>>}
   */
  static async _runAudits(settings, audits, artifacts, runWarnings, computedCache) {
    const status = {msg: 'Analyzing and running audits...', id: 'lh:runner:auditing'};
    log.time(status);

    if (artifacts.settings) {
      const overrides = {
        locale: undefined,
        gatherMode: undefined,
        auditMode: undefined,
        output: undefined,
        channel: undefined,
        budgets: undefined,
      };
      const normalizedGatherSettings = Object.assign({}, artifacts.settings, overrides);
      const normalizedAuditSettings = Object.assign({}, settings, overrides);

      // First, try each key individually so we can print which key differed.
      const keys = new Set([
        ...Object.keys(normalizedGatherSettings),
        ...Object.keys(normalizedAuditSettings),
      ]);
      for (const k of keys) {
        if (!isDeepEqual(normalizedGatherSettings[k], normalizedAuditSettings[k])) {
          throw new Error(
            `Cannot change settings between gathering and auditing. Difference found at: ${k}`);
        }
      }

      // Call `isDeepEqual` on the entire thing, just in case something was missed.
      if (!isDeepEqual(normalizedGatherSettings, normalizedAuditSettings)) {
        throw new Error('Cannot change settings between gathering and auditing');
      }
    }

    // Members of LH.Audit.Context that are shared across all audits.
    const sharedAuditContext = {
      settings,
      computedCache,
    };

    // Run each audit sequentially
    /** @type {Record<string, LH.RawIcu<LH.Audit.Result>>} */
    const auditResultsById = {};
    for (const auditDefn of audits) {
      const auditId = auditDefn.implementation.meta.id;
      const auditResult = await Runner._runAudit(auditDefn, artifacts, sharedAuditContext,
          runWarnings);
      auditResultsById[auditId] = auditResult;
    }

    log.timeEnd(status);
    return auditResultsById;
  }

  /**
   * Checks that the audit's required artifacts exist and runs the audit if so.
   * Otherwise returns error audit result.
   * @param {LH.Config.AuditDefn} auditDefn
   * @param {LH.Artifacts} artifacts
   * @param {Pick<LH.Audit.Context, 'settings'|'computedCache'>} sharedAuditContext
   * @param {Array<string | LH.IcuMessage>} runWarnings
   * @return {Promise<LH.RawIcu<LH.Audit.Result>>}
   * @private
   */
  static async _runAudit(auditDefn, artifacts, sharedAuditContext, runWarnings) {
    const audit = auditDefn.implementation;
    const status = {
      msg: `Auditing: ${format.getFormatted(audit.meta.title, 'en-US')}`,
      id: `lh:audit:${audit.meta.id}`,
    };
    log.time(status);

    let auditResult;
    try {
      // Return an early error if an artifact required for the audit is missing or an error.
      for (const artifactName of audit.meta.requiredArtifacts) {
        const noArtifact = artifacts[artifactName] === undefined;

        // If trace/devtoolsLog required, check that DEFAULT_PASS trace/devtoolsLog exists.
        // NOTE: for now, not a pass-specific check of traces or devtoolsLogs.
        const noRequiredTrace = artifactName === 'traces' && !artifacts.traces[Audit.DEFAULT_PASS];
        const noRequiredDevtoolsLog = artifactName === 'devtoolsLogs' &&
            !artifacts.devtoolsLogs[Audit.DEFAULT_PASS];

        if (noArtifact || noRequiredTrace || noRequiredDevtoolsLog) {
          log.warn('Runner',
              `${artifactName} gatherer, required by audit ${audit.meta.id}, did not run.`);
          throw new LHError(LHError.errors.MISSING_REQUIRED_ARTIFACT, {artifactName});
        }

        // If artifact was an error, output error result on behalf of audit.
        if (artifacts[artifactName] instanceof Error) {
          /** @type {Error} */
          // @ts-expect-error An artifact *could* be an Error, but caught here, so ignore elsewhere.
          const artifactError = artifacts[artifactName];

          Sentry.captureException(artifactError, {
            tags: {gatherer: artifactName},
            level: 'error',
          });

          log.warn('Runner', `${artifactName} gatherer, required by audit ${audit.meta.id},` +
            ` encountered an error: ${artifactError.message}`);

          // Create a friendlier display error and mark it as expected to avoid duplicates in Sentry
          const error = new LHError(LHError.errors.ERRORED_REQUIRED_ARTIFACT,
              {artifactName, errorMessage: artifactError.message});
          // @ts-expect-error Non-standard property added to Error
          error.expected = true;
          throw error;
        }
      }

      // all required artifacts are in good shape, so we proceed
      const auditOptions = Object.assign({}, audit.defaultOptions, auditDefn.options);
      const auditContext = {
        options: auditOptions,
        ...sharedAuditContext,
      };

      // Only pass the declared required and optional artifacts to the audit
      // The type is masquerading as `LH.Artifacts` but will only contain a subset of the keys
      // to prevent consumers from unnecessary type assertions.
      const requestedArtifacts = audit.meta.requiredArtifacts
        .concat(audit.meta.__internalOptionalArtifacts || []);
      const narrowedArtifacts = requestedArtifacts
        .reduce((narrowedArtifacts, artifactName) => {
          const requestedArtifact = artifacts[artifactName];
          // @ts-expect-error tsc can't yet express that artifactName is only a single type in each iteration, not a union of types.
          narrowedArtifacts[artifactName] = requestedArtifact;
          return narrowedArtifacts;
        }, /** @type {LH.Artifacts} */ ({}));
      const product = await audit.audit(narrowedArtifacts, auditContext);
      runWarnings.push(...(product.runWarnings || []));

      auditResult = Audit.generateAuditResult(audit, product);
    } catch (err) {
      // Log error if it hasn't already been logged above.
      if (err.code !== 'MISSING_REQUIRED_ARTIFACT' && err.code !== 'ERRORED_REQUIRED_ARTIFACT') {
        log.warn(audit.meta.id, `Caught exception: ${err.message}`);
      }

      Sentry.captureException(err, {tags: {audit: audit.meta.id}, level: 'error'});
      // Errors become error audit result.
      const errorMessage = err.friendlyMessage ? err.friendlyMessage : err.message;
      auditResult = Audit.generateErrorAuditResult(audit, errorMessage);
    }

    log.timeEnd(status);
    return auditResult;
  }

  /**
   * Searches a pass's artifacts for any `lhrRuntimeError` error artifacts.
   * Returns the first one found or `null` if none found.
   * @param {LH.Artifacts} artifacts
   * @return {LH.RawIcu<LH.Result['runtimeError']>|undefined}
   */
  static getArtifactRuntimeError(artifacts) {
    const possibleErrorArtifacts = [
      artifacts.PageLoadError, // Preferentially use `PageLoadError`, if it exists.
      ...Object.values(artifacts), // Otherwise check amongst all artifacts.
    ];

    for (const possibleErrorArtifact of possibleErrorArtifacts) {
      if (possibleErrorArtifact instanceof LHError && possibleErrorArtifact.lhrRuntimeError) {
        const errorMessage = possibleErrorArtifact.friendlyMessage || possibleErrorArtifact.message;

        return {
          code: possibleErrorArtifact.code,
          message: errorMessage,
        };
      }
    }

    return undefined;
  }

  /**
   * Returns list of audit names for external querying.
   * @return {Array<string>}
   */
  static getAuditList() {
    const ignoredFiles = [
      'audit.js',
      'violation-audit.js',
      'accessibility/axe-audit.js',
      'multi-check-audit.js',
      'byte-efficiency/byte-efficiency-audit.js',
      'manual/manual-audit.js',
    ];

    const fileList = [
      ...fs.readdirSync(path.join(__dirname, './audits')),
      ...fs.readdirSync(path.join(__dirname, './audits/dobetterweb')).map(f => `dobetterweb/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/metrics')).map(f => `metrics/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/seo')).map(f => `seo/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/seo/manual')).map(f => `seo/manual/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/accessibility'))
          .map(f => `accessibility/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/accessibility/manual'))
          .map(f => `accessibility/manual/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/byte-efficiency'))
          .map(f => `byte-efficiency/${f}`),
      ...fs.readdirSync(path.join(__dirname, './audits/manual')).map(f => `manual/${f}`),
    ];
    return fileList.filter(f => {
      return /\.js$/.test(f) && !ignoredFiles.includes(f);
    }).sort();
  }

  /**
   * Returns list of gatherer names for external querying.
   * @return {Array<string>}
   */
  static getGathererList() {
    const fileList = [
      ...fs.readdirSync(path.join(__dirname, './gather/gatherers')),
      ...fs.readdirSync(path.join(__dirname, './gather/gatherers/seo')).map(f => `seo/${f}`),
      ...fs.readdirSync(path.join(__dirname, './gather/gatherers/dobetterweb'))
          .map(f => `dobetterweb/${f}`),
    ];
    return fileList.filter(f => /\.js$/.test(f) && f !== 'gatherer.js').sort();
  }

  /**
   * Get path to use for -G and -A modes. Defaults to $CWD/latest-run
   * @param {LH.Config.Settings} settings
   * @return {string}
   */
  static _getDataSavePath(settings) {
    const {auditMode, gatherMode} = settings;

    // This enables usage like: -GA=./custom-folder
    if (typeof auditMode === 'string') return path.resolve(process.cwd(), auditMode);
    if (typeof gatherMode === 'string') return path.resolve(process.cwd(), gatherMode);

    return path.join(process.cwd(), 'latest-run');
  }
}

module.exports = Runner;
