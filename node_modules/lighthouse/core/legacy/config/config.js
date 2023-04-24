/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import path from 'path';

import log from 'lighthouse-logger';

import legacyDefaultConfig from './legacy-default-config.js';
import * as constants from '../../config/constants.js';
import * as format from '../../../shared/localization/format.js';
import * as validation from '../../config/validation.js';
import {Runner} from '../../runner.js';
import {
  mergePlugins,
  mergeConfigFragment,
  resolveSettings,
  resolveAuditsToDefns,
  resolveGathererToDefn,
  deepClone,
  deepCloneConfigJson,
} from '../../config/config-helpers.js';
import {getModuleDirectory} from '../../../esm-utils.js';

const defaultConfigPath = './legacy-default-config.js';

/** @typedef {typeof import('../../gather/gatherers/gatherer.js').Gatherer} GathererConstructor */
/** @typedef {InstanceType<GathererConstructor>} Gatherer */

/**
 * Define with object literal so that tsc will require it to stay updated.
 * @type {Record<keyof LH.BaseArtifacts, ''>}
 */
const BASE_ARTIFACT_BLANKS = {
  fetchTime: '',
  LighthouseRunWarnings: '',
  HostFormFactor: '',
  HostUserAgent: '',
  NetworkUserAgent: '',
  BenchmarkIndex: '',
  BenchmarkIndexes: '',
  GatherContext: '',
  traces: '',
  devtoolsLogs: '',
  settings: '',
  URL: '',
  Timing: '',
  PageLoadError: '',
};
const BASE_ARTIFACT_NAMES = Object.keys(BASE_ARTIFACT_BLANKS);

// These were legacy base artifacts, but we need certain gatherers (e.g. bfcache) to run after them.
// The order is controlled by the config, but still need to force them to run every time.
const alwaysRunArtifactIds = [
  'WebAppManifest',
  'InstallabilityErrors',
  'Stacks',
  'FullPageScreenshot',
];

/**
 * Certain gatherers are destructive to the page state.
 * We should ensure that these gatherers run after any custom gatherers.
 * The default priority should be 0.
 * TODO: Make this an official part of the config or design a different solution.
 * @type {Record<string, number|undefined>}
 */
const internalGathererPriorities = {
  FullPageScreenshot: 1,
  BFCacheFailures: 1,
};

/**
 * @param {LegacyResolvedConfig['passes']} passes
 * @param {LegacyResolvedConfig['audits']} audits
 */
function assertValidPasses(passes, audits) {
  if (!Array.isArray(passes)) {
    return;
  }

  const requestedGatherers = LegacyResolvedConfig.getGatherersRequestedByAudits(audits);
  // Base artifacts are provided by GatherRunner, so start foundGatherers with them.
  const foundGatherers = new Set(BASE_ARTIFACT_NAMES);

  // Log if we are running gathers that are not needed by the audits listed in the config
  passes.forEach((pass, passIndex) => {
    if (passIndex === 0 && pass.loadFailureMode !== 'fatal') {
      log.warn(`"${pass.passName}" is the first pass but was marked as non-fatal. ` +
        `The first pass will always be treated as loadFailureMode=fatal.`);
      pass.loadFailureMode = 'fatal';
    }

    pass.gatherers.forEach(gathererDefn => {
      const gatherer = gathererDefn.instance;
      foundGatherers.add(gatherer.name);
      const isGatherRequiredByAudits = requestedGatherers.has(gatherer.name);
      const isAlwaysRunArtifact = alwaysRunArtifactIds.includes(gatherer.name);
      if (!isGatherRequiredByAudits && !isAlwaysRunArtifact) {
        const msg = `${gatherer.name} gatherer requested, however no audit requires it.`;
        log.warn('config', msg);
      }
    });
  });

  // All required gatherers must be found in the config. Throw otherwise.
  for (const auditDefn of audits || []) {
    const auditMeta = auditDefn.implementation.meta;
    for (const requiredArtifact of auditMeta.requiredArtifacts) {
      if (!foundGatherers.has(requiredArtifact)) {
        throw new Error(`${requiredArtifact} gatherer, required by audit ${auditMeta.id}, ` +
            'was not found in config.');
      }
    }
  }

  // Passes must have unique `passName`s. Throw otherwise.
  const usedNames = new Set();
  passes.forEach(pass => {
    const passName = pass.passName;
    if (usedNames.has(passName)) {
      throw new Error(`Passes must have unique names (repeated passName: ${passName}.`);
    }
    usedNames.add(passName);
  });
}

/**
 * @param {Gatherer} gathererInstance
 * @param {string=} gathererName
 */
function assertValidGatherer(gathererInstance, gathererName) {
  gathererName = gathererName || gathererInstance.name || 'gatherer';

  if (typeof gathererInstance.beforePass !== 'function') {
    throw new Error(`${gathererName} has no beforePass() method.`);
  }

  if (typeof gathererInstance.pass !== 'function') {
    throw new Error(`${gathererName} has no pass() method.`);
  }

  if (typeof gathererInstance.afterPass !== 'function') {
    throw new Error(`${gathererName} has no afterPass() method.`);
  }
}

/**
 * @implements {LH.Config.LegacyResolvedConfig}
 */
class LegacyResolvedConfig {
  /**
   * Resolves the provided config (inherits from extended config, if set), resolves
   * all referenced modules, and validates.
   * @param {LH.Config=} config If not provided, uses the default config.
   * @param {LH.Flags=} flags
   * @return {Promise<LegacyResolvedConfig>}
   */
  static async fromJson(config, flags) {
    const status = {msg: 'Create config', id: 'lh:init:config'};
    log.time(status, 'verbose');
    let configPath = flags?.configPath;

    if (!config) {
      config = legacyDefaultConfig;
      configPath = path.resolve(getModuleDirectory(import.meta), defaultConfigPath);
    }

    if (configPath && !path.isAbsolute(configPath)) {
      throw new Error('configPath must be an absolute path.');
    }

    // We don't want to mutate the original config object
    config = deepCloneConfigJson(config);

    // Extend the default config if specified
    if (config.extends) {
      if (config.extends !== 'lighthouse:default') {
        throw new Error('`lighthouse:default` is the only valid extension method.');
      }
      config = LegacyResolvedConfig.extendConfigJSON(
        deepCloneConfigJson(legacyDefaultConfig), config);
    }

    // The directory of the config path, if one was provided.
    const configDir = configPath ? path.dirname(configPath) : undefined;

    // Validate and merge in plugins (if any).
    config = await mergePlugins(config, configDir, flags);

    const settings = resolveSettings(config.settings || {}, flags);

    // Augment passes with necessary defaults and require gatherers.
    const passesWithDefaults = LegacyResolvedConfig.augmentPassesWithDefaults(config.passes);
    LegacyResolvedConfig.adjustDefaultPassForThrottling(settings, passesWithDefaults);
    const passes = await LegacyResolvedConfig.requireGatherers(passesWithDefaults, configDir);

    const audits = await LegacyResolvedConfig.requireAudits(config.audits, configDir);

    const resolvedConfig = new LegacyResolvedConfig(config, {settings, passes, audits});
    log.timeEnd(status);
    return resolvedConfig;
  }

  /**
   * @deprecated `Config.fromJson` should be used instead.
   * @constructor
   * @param {LH.Config} config
   * @param {{settings: LH.Config.Settings, passes: ?LH.Config.Pass[], audits: ?LH.Config.AuditDefn[]}} opts
   */
  constructor(config, opts) {
    /** @type {LH.Config.Settings} */
    this.settings = opts.settings;
    /** @type {?Array<LH.Config.Pass>} */
    this.passes = opts.passes;
    /** @type {?Array<LH.Config.AuditDefn>} */
    this.audits = opts.audits;
    /** @type {?Record<string, LH.Config.Category>} */
    this.categories = config.categories || null;
    /** @type {?Record<string, LH.Config.Group>} */
    this.groups = config.groups || null;

    LegacyResolvedConfig.filterConfigIfNeeded(this);

    assertValidPasses(this.passes, this.audits);
    validation.assertValidCategories(this.categories, this.audits, this.groups);
  }

  /**
   * Provides a cleaned-up, stringified version of this config. Gatherer and
   * Audit `implementation` and `instance` do not survive this process.
   * @return {string}
   */
  getPrintString() {
    const jsonConfig = deepClone(this);

    if (jsonConfig.passes) {
      for (const pass of jsonConfig.passes) {
        for (const gathererDefn of pass.gatherers) {
          gathererDefn.implementation = undefined;
          // @ts-expect-error Breaking the Config.GathererDefn type.
          gathererDefn.instance = undefined;
        }
      }
    }

    if (jsonConfig.audits) {
      for (const auditDefn of jsonConfig.audits) {
        // @ts-expect-error Breaking the Config.AuditDefn type.
        auditDefn.implementation = undefined;
        if (Object.keys(auditDefn.options).length === 0) {
          // @ts-expect-error Breaking the Config.AuditDefn type.
          auditDefn.options = undefined;
        }
      }
    }

    // Printed config is more useful with localized strings.
    format.replaceIcuMessages(jsonConfig, jsonConfig.settings.locale);

    return JSON.stringify(jsonConfig, null, 2);
  }

  /**
   * @param {LH.Config} baseJSON The JSON of the configuration to extend
   * @param {LH.Config} extendJSON The JSON of the extensions
   * @return {LH.Config}
   */
  static extendConfigJSON(baseJSON, extendJSON) {
    if (extendJSON.passes && baseJSON.passes) {
      for (const pass of extendJSON.passes) {
        // use the default pass name if one is not specified
        const passName = pass.passName || constants.defaultPassConfig.passName;
        const basePass = baseJSON.passes.find(candidate => candidate.passName === passName);

        if (!basePass) {
          baseJSON.passes.push(pass);
        } else {
          mergeConfigFragment(basePass, pass);
        }
      }

      delete extendJSON.passes;
    }

    return mergeConfigFragment(baseJSON, extendJSON);
  }

  /**
   * @param {LH.Config['passes']} passes
   * @return {?Array<Required<LH.Config.PassJson>>}
   */
  static augmentPassesWithDefaults(passes) {
    if (!passes) {
      return null;
    }

    const {defaultPassConfig} = constants;
    return passes.map(pass => mergeConfigFragment(deepClone(defaultPassConfig), pass));
  }

  /**
   * Observed throttling methods (devtools/provided) require at least 5s of quiet for the metrics to
   * be computed. This method adjusts the quiet thresholds to the required minimums if necessary.
   * @param {LH.Config.Settings} settings
   * @param {?Array<Required<LH.Config.PassJson>>} passes
   */
  static adjustDefaultPassForThrottling(settings, passes) {
    if (!passes ||
        (settings.throttlingMethod !== 'devtools' && settings.throttlingMethod !== 'provided')) {
      return;
    }

    const defaultPass = passes.find(pass => pass.passName === 'defaultPass');
    if (!defaultPass) return;
    const overrides = constants.nonSimulatedPassConfigOverrides;
    defaultPass.pauseAfterFcpMs =
      Math.max(overrides.pauseAfterFcpMs, defaultPass.pauseAfterFcpMs);
    defaultPass.pauseAfterLoadMs =
      Math.max(overrides.pauseAfterLoadMs, defaultPass.pauseAfterLoadMs);
    defaultPass.cpuQuietThresholdMs =
      Math.max(overrides.cpuQuietThresholdMs, defaultPass.cpuQuietThresholdMs);
    defaultPass.networkQuietThresholdMs =
      Math.max(overrides.networkQuietThresholdMs, defaultPass.networkQuietThresholdMs);
  }

  /**
   * Filter out any unrequested items from the config, based on requested categories or audits.
   * @param {LegacyResolvedConfig} config
   */
  static filterConfigIfNeeded(config) {
    const settings = config.settings;
    // eslint-disable-next-line max-len
    if (!settings.onlyCategories && !settings.onlyAudits && !settings.skipAudits && !settings.disableFullPageScreenshot) {
      return;
    }

    // 1. Filter to just the chosen categories/audits
    const {categories, requestedAuditNames} =
      LegacyResolvedConfig.filterCategoriesAndAudits(config.categories, settings);

    // 2. Resolve which audits will need to run
    const audits = config.audits && config.audits.filter(auditDefn =>
        requestedAuditNames.has(auditDefn.implementation.meta.id));

    // 3. Resolve which gatherers will need to run
    const requestedGathererIds = LegacyResolvedConfig.getGatherersRequestedByAudits(audits);
    for (const gathererId of alwaysRunArtifactIds) {
      requestedGathererIds.add(gathererId);
    }

    // Remove FullPageScreenshot if we explicitly exclude it.
    if (settings.disableFullPageScreenshot) {
      requestedGathererIds.delete('FullPageScreenshot');
    }

    // 4. Filter to only the neccessary passes
    const passes =
      LegacyResolvedConfig.generatePassesNeededByGatherers(config.passes, requestedGathererIds);

    config.categories = categories;
    config.audits = audits;
    config.passes = passes;
  }

  /**
   * Filter out any unrequested categories or audits from the categories object.
   * @param {LegacyResolvedConfig['categories']} oldCategories
   * @param {LH.Config.Settings} settings
   * @return {{categories: LegacyResolvedConfig['categories'], requestedAuditNames: Set<string>}}
   */
  static filterCategoriesAndAudits(oldCategories, settings) {
    if (!oldCategories) {
      return {categories: null, requestedAuditNames: new Set()};
    }

    if (settings.onlyAudits && settings.skipAudits) {
      throw new Error('Cannot set both skipAudits and onlyAudits');
    }

    /** @type {NonNullable<LegacyResolvedConfig['categories']>} */
    const categories = {};
    const filterByIncludedCategory = !!settings.onlyCategories;
    const filterByIncludedAudit = !!settings.onlyAudits;
    const categoryIds = settings.onlyCategories || [];
    const auditIds = settings.onlyAudits || [];
    const skipAuditIds = settings.skipAudits || [];

    // warn if the category is not found
    categoryIds.forEach(categoryId => {
      if (!oldCategories[categoryId]) {
        log.warn('config', `unrecognized category in 'onlyCategories': ${categoryId}`);
      }
    });

    // warn if the audit is not found in a category or there are overlaps
    const auditsToValidate = new Set(auditIds.concat(skipAuditIds));
    for (const auditId of auditsToValidate) {
      const foundCategory = Object.keys(oldCategories).find(categoryId => {
        const auditRefs = oldCategories[categoryId].auditRefs;
        return !!auditRefs.find(candidate => candidate.id === auditId);
      });

      if (!foundCategory) {
        const parentKeyName = skipAuditIds.includes(auditId) ? 'skipAudits' : 'onlyAudits';
        log.warn('config', `unrecognized audit in '${parentKeyName}': ${auditId}`);
      } else if (auditIds.includes(auditId) && categoryIds.includes(foundCategory)) {
        log.warn('config', `${auditId} in 'onlyAudits' is already included by ` +
            `${foundCategory} in 'onlyCategories'`);
      }
    }

    const includedAudits = new Set(auditIds);
    skipAuditIds.forEach(id => includedAudits.delete(id));

    Object.keys(oldCategories).forEach(categoryId => {
      const category = deepClone(oldCategories[categoryId]);

      if (filterByIncludedCategory && filterByIncludedAudit) {
        // If we're filtering by category and audit, include the union of the two
        if (!categoryIds.includes(categoryId)) {
          category.auditRefs = category.auditRefs.filter(audit => auditIds.includes(audit.id));
        }
      } else if (filterByIncludedCategory) {
        // If we're filtering by just category, and the category is not included, skip it
        if (!categoryIds.includes(categoryId)) {
          return;
        }
      } else if (filterByIncludedAudit) {
        category.auditRefs = category.auditRefs.filter(audit => auditIds.includes(audit.id));
      }

      // always filter based on skipAuditIds
      category.auditRefs = category.auditRefs.filter(audit => !skipAuditIds.includes(audit.id));

      if (category.auditRefs.length) {
        categories[categoryId] = category;
        category.auditRefs.forEach(audit => includedAudits.add(audit.id));
      }
    });

    return {categories, requestedAuditNames: includedAudits};
  }

  /**
   * From some requested audits, return names of all required and optional artifacts
   * @param {LegacyResolvedConfig['audits']} audits
   * @return {Set<string>}
   */
  static getGatherersRequestedByAudits(audits) {
    // It's possible we weren't given any audits (but existing audit results), in which case
    // there is no need to do any work here.
    if (!audits) {
      return new Set();
    }

    const gatherers = new Set();
    for (const auditDefn of audits) {
      const {requiredArtifacts, __internalOptionalArtifacts} = auditDefn.implementation.meta;
      requiredArtifacts.forEach(artifact => gatherers.add(artifact));
      if (__internalOptionalArtifacts) {
        __internalOptionalArtifacts.forEach(artifact => gatherers.add(artifact));
      }
    }
    return gatherers;
  }

  /**
   * Filters to only requested passes and gatherers, returning a new passes array.
   * @param {LegacyResolvedConfig['passes']} passes
   * @param {Set<string>} requestedGatherers
   * @return {LegacyResolvedConfig['passes']}
   */
  static generatePassesNeededByGatherers(passes, requestedGatherers) {
    if (!passes) {
      return null;
    }

    const auditsNeedTrace = requestedGatherers.has('traces');
    const filteredPasses = passes.map(pass => {
      // remove any unncessary gatherers from within the passes
      pass.gatherers = pass.gatherers.filter(gathererDefn => {
        const gatherer = gathererDefn.instance;
        return requestedGatherers.has(gatherer.name);
      });

      // disable the trace if no audit requires a trace
      if (pass.recordTrace && !auditsNeedTrace) {
        const passName = pass.passName || 'unknown pass';
        log.warn('config', `Trace not requested by an audit, dropping trace in ${passName}`);
        pass.recordTrace = false;
      }

      return pass;
    }).filter(pass => {
      // remove any passes lacking concrete gatherers, unless they are dependent on the trace
      if (pass.recordTrace) return true;
      // Always keep defaultPass
      if (pass.passName === 'defaultPass') return true;
      return pass.gatherers.length > 0;
    });
    return filteredPasses;
  }

  /**
   * Take an array of audits and audit paths and require any paths (possibly
   * relative to the optional `configDir`) using `resolveModulePath`,
   * leaving only an array of AuditDefns.
   * @param {LH.Config['audits']} audits
   * @param {string=} configDir
   * @return {Promise<LegacyResolvedConfig['audits']>}
   */
  static async requireAudits(audits, configDir) {
    const status = {msg: 'Requiring audits', id: 'lh:config:requireAudits'};
    log.time(status, 'verbose');
    const auditDefns = await resolveAuditsToDefns(audits, configDir);
    log.timeEnd(status);
    return auditDefns;
  }

  /**
   * Takes an array of passes with every property now initialized except the
   * gatherers and requires them, (relative to the optional `configDir` if
   * provided) using `resolveModulePath`, returning an array of full Passes.
   * @param {?Array<Required<LH.Config.PassJson>>} passes
   * @param {string=} configDir
   * @return {Promise<LegacyResolvedConfig['passes']>}
   */
  static async requireGatherers(passes, configDir) {
    if (!passes) {
      return null;
    }
    const status = {msg: 'Requiring gatherers', id: 'lh:config:requireGatherers'};
    log.time(status, 'verbose');

    const coreList = Runner.getGathererList();
    const fullPassesPromises = passes.map(async (pass) => {
      const gathererDefns = await Promise.all(
        pass.gatherers
          .map(gatherer => resolveGathererToDefn(gatherer, coreList, configDir))
      );

      // De-dupe gatherers by artifact name because artifact IDs must be unique at runtime.
      const uniqueDefns = Array.from(
        new Map(gathererDefns.map(defn => [defn.instance.name, defn])).values()
      );
      uniqueDefns.forEach(gatherer => assertValidGatherer(gatherer.instance, gatherer.path));

      uniqueDefns.sort((a, b) => {
        const aPriority = internalGathererPriorities[a.instance.name] || 0;
        const bPriority = internalGathererPriorities[b.instance.name] || 0;
        return aPriority - bPriority;
      });

      return Object.assign(pass, {gatherers: uniqueDefns});
    });
    const fullPasses = await Promise.all(fullPassesPromises);

    log.timeEnd(status);
    return fullPasses;
  }
}

export {LegacyResolvedConfig};
