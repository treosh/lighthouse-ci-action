/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const Driver = require('./driver.js');
const Runner = require('../../runner.js');
const {
  getEmptyArtifactState,
  collectPhaseArtifacts,
  awaitArtifacts,
} = require('./runner-helpers.js');
const prepare = require('../../gather/driver/prepare.js');
const {gotoURL} = require('../../gather/driver/navigation.js');
const storage = require('../../gather/driver/storage.js');
const emulation = require('../../lib/emulation.js');
const {defaultNavigationConfig} = require('../../config/constants.js');
const {initializeConfig} = require('../config/config.js');
const {getBaseArtifacts, finalizeArtifacts} = require('./base-artifacts.js');
const format = require('../../../shared/localization/format.js');
const LighthouseError = require('../../lib/lh-error.js');
const URL = require('../../lib/url-shim.js');
const {getPageLoadError} = require('../../lib/navigation-error.js');
const Trace = require('../../gather/gatherers/trace.js');
const DevtoolsLog = require('../../gather/gatherers/devtools-log.js');
const NetworkRecords = require('../../computed/network-records.js');

/** @typedef {{skipAboutBlank?: boolean}} InternalOptions */

/**
 * @typedef NavigationContext
 * @property {Driver} driver
 * @property {LH.Config.FRConfig} config
 * @property {LH.Config.NavigationDefn} navigation
 * @property {LH.NavigationRequestor} requestor
 * @property {LH.FRBaseArtifacts} baseArtifacts
 * @property {Map<string, LH.ArbitraryEqualityMap>} computedCache
 * @property {InternalOptions} [options]
 */

/** @typedef {Omit<Parameters<typeof collectPhaseArtifacts>[0], 'phase'>} PhaseState */

/**
 * @param {{driver: Driver, config: LH.Config.FRConfig, requestor: LH.NavigationRequestor, options?: InternalOptions}} args
 * @return {Promise<{baseArtifacts: LH.FRBaseArtifacts}>}
 */
async function _setup({driver, config, requestor, options}) {
  await driver.connect();
  if (!options?.skipAboutBlank) {
    await gotoURL(driver, defaultNavigationConfig.blankPage, {waitUntil: ['navigated']});
  }

  const baseArtifacts = await getBaseArtifacts(config, driver, {gatherMode: 'navigation'});
  if (typeof requestor === 'string') baseArtifacts.URL.requestedUrl = requestor;

  await prepare.prepareTargetForNavigationMode(driver, config.settings);

  return {baseArtifacts};
}

/**
 * @param {NavigationContext} navigationContext
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
async function _setupNavigation({requestor, driver, navigation, config, options}) {
  if (!options?.skipAboutBlank) {
    await gotoURL(driver, navigation.blankPage, {...navigation, waitUntil: ['navigated']});
  }
  const {warnings} = await prepare.prepareTargetForIndividualNavigation(
    driver.defaultSession,
    config.settings,
    {
      ...navigation,
      requestor,
    }
  );

  return {warnings};
}

/**
 * @param {NavigationContext} navigationContext
 */
async function _cleanupNavigation({driver}) {
  await emulation.clearThrottling(driver.defaultSession);
}

/**
 * @param {NavigationContext} navigationContext
 * @return {Promise<{requestedUrl: string, finalUrl: string, navigationError: LH.LighthouseError | undefined, warnings: Array<LH.IcuMessage>}>}
 */
async function _navigate(navigationContext) {
  const {driver, config, requestor} = navigationContext;

  try {
    const {requestedUrl, finalUrl, warnings} = await gotoURL(driver, requestor, {
      ...navigationContext.navigation,
      debugNavigation: config.settings.debugNavigation,
      maxWaitForFcp: config.settings.maxWaitForFcp,
      maxWaitForLoad: config.settings.maxWaitForLoad,
      waitUntil: navigationContext.navigation.pauseAfterFcpMs ? ['fcp', 'load'] : ['load'],
    });
    return {requestedUrl, finalUrl, navigationError: undefined, warnings};
  } catch (err) {
    if (!(err instanceof LighthouseError)) throw err;
    if (err.code !== 'NO_FCP' && err.code !== 'PAGE_HUNG') throw err;
    if (typeof requestor !== 'string') throw err;
    return {requestedUrl: requestor, finalUrl: requestor, navigationError: err, warnings: []};
  }
}

/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @return {Promise<{devtoolsLog?: LH.DevtoolsLog, records?: Array<LH.Artifacts.NetworkRequest>, trace?: LH.Trace}>}
 */
async function _collectDebugData(navigationContext, phaseState) {
  const devtoolsLogArtifactDefn = phaseState.artifactDefinitions.find(
    definition => definition.gatherer.instance.meta.symbol === DevtoolsLog.symbol
  );
  const traceArtifactDefn = phaseState.artifactDefinitions.find(
    definition => definition.gatherer.instance.meta.symbol === Trace.symbol
  );

  const artifactDefinitions = [devtoolsLogArtifactDefn, traceArtifactDefn].filter(
    /**
     * @param {LH.Config.AnyArtifactDefn | undefined} defn
     * @return {defn is LH.Config.AnyArtifactDefn}
     */
    defn => Boolean(defn)
  );
  if (!artifactDefinitions.length) return {};

  await collectPhaseArtifacts({...phaseState, phase: 'getArtifact', artifactDefinitions});
  const getArtifactState = phaseState.artifactState.getArtifact;

  const devtoolsLogArtifactId = devtoolsLogArtifactDefn?.id;
  const devtoolsLog = devtoolsLogArtifactId && await getArtifactState[devtoolsLogArtifactId];
  const records = devtoolsLog && await NetworkRecords.request(devtoolsLog, navigationContext);

  const traceArtifactId = traceArtifactDefn?.id;
  const trace = traceArtifactId && await getArtifactState[traceArtifactId];

  return {devtoolsLog, records, trace};
}

/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @param {Awaited<ReturnType<typeof _setupNavigation>>} setupResult
 * @param {Awaited<ReturnType<typeof _navigate>>} navigateResult
 * @return {Promise<{requestedUrl: string, finalUrl: string, artifacts: Partial<LH.GathererArtifacts>, warnings: Array<LH.IcuMessage>, pageLoadError: LH.LighthouseError | undefined}>}
 */
async function _computeNavigationResult(
  navigationContext,
  phaseState,
  setupResult,
  navigateResult
) {
  const {navigationError, finalUrl} = navigateResult;
  const warnings = [...setupResult.warnings, ...navigateResult.warnings];
  const debugData = await _collectDebugData(navigationContext, phaseState);
  const pageLoadError = debugData.records
    ? getPageLoadError(navigationError, {
      url: finalUrl,
      loadFailureMode: navigationContext.navigation.loadFailureMode,
      networkRecords: debugData.records,
    })
    : navigationError;

  if (pageLoadError) {
    const locale = navigationContext.config.settings.locale;
    const localizedMessage = format.getFormatted(pageLoadError.friendlyMessage, locale);
    log.error('NavigationRunner', localizedMessage, navigateResult.requestedUrl);

    /** @type {Partial<LH.GathererArtifacts>} */
    const artifacts = {};
    const pageLoadErrorId = `pageLoadError-${navigationContext.navigation.id}`;
    if (debugData.devtoolsLog) artifacts.devtoolsLogs = {[pageLoadErrorId]: debugData.devtoolsLog};
    if (debugData.trace) artifacts.traces = {[pageLoadErrorId]: debugData.trace};

    return {
      requestedUrl: navigateResult.requestedUrl,
      finalUrl,
      pageLoadError,
      artifacts,
      warnings: [...warnings, pageLoadError.friendlyMessage],
    };
  } else {
    await collectPhaseArtifacts({phase: 'getArtifact', ...phaseState});

    const artifacts = await awaitArtifacts(phaseState.artifactState);
    return {
      requestedUrl: navigateResult.requestedUrl,
      finalUrl,
      artifacts,
      warnings,
      pageLoadError: undefined,
    };
  }
}

/**
 * @param {NavigationContext} navigationContext
 * @return {ReturnType<typeof _computeNavigationResult>}
 */
async function _navigation(navigationContext) {
  const artifactState = getEmptyArtifactState();
  const phaseState = {
    url: await navigationContext.driver.url(),
    gatherMode: /** @type {const} */ ('navigation'),
    driver: navigationContext.driver,
    computedCache: navigationContext.computedCache,
    artifactDefinitions: navigationContext.navigation.artifacts,
    artifactState,
    baseArtifacts: navigationContext.baseArtifacts,
    settings: navigationContext.config.settings,
  };

  const setupResult = await _setupNavigation(navigationContext);
  await collectPhaseArtifacts({phase: 'startInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'startSensitiveInstrumentation', ...phaseState});
  const navigateResult = await _navigate(navigationContext);
  phaseState.url = navigateResult.finalUrl;
  await collectPhaseArtifacts({phase: 'stopSensitiveInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'stopInstrumentation', ...phaseState});
  await _cleanupNavigation(navigationContext);

  return _computeNavigationResult(navigationContext, phaseState, setupResult, navigateResult);
}

/**
 * @param {{driver: Driver, config: LH.Config.FRConfig, requestor: LH.NavigationRequestor; baseArtifacts: LH.FRBaseArtifacts, computedCache: NavigationContext['computedCache'], options?: InternalOptions}} args
 * @return {Promise<{artifacts: Partial<LH.FRArtifacts & LH.FRBaseArtifacts>}>}
 */
async function _navigations({driver, config, requestor, baseArtifacts, computedCache, options}) {
  if (!config.navigations) throw new Error('No navigations configured');

  /** @type {Partial<LH.FRArtifacts & LH.FRBaseArtifacts>} */
  const artifacts = {};
  /** @type {Array<LH.IcuMessage>} */
  const LighthouseRunWarnings = [];

  for (const navigation of config.navigations) {
    const navigationContext = {
      driver,
      navigation,
      requestor,
      config,
      baseArtifacts,
      computedCache,
      options,
    };

    let shouldHaltNavigations = false;
    const navigationResult = await _navigation(navigationContext);
    if (navigation.loadFailureMode === 'fatal') {
      if (navigationResult.pageLoadError) {
        artifacts.PageLoadError = navigationResult.pageLoadError;
        shouldHaltNavigations = true;
      }

      artifacts.URL = {
        requestedUrl: navigationResult.requestedUrl,
        finalUrl: navigationResult.finalUrl,
      };
    }

    LighthouseRunWarnings.push(...navigationResult.warnings);
    Object.assign(artifacts, navigationResult.artifacts);
    if (shouldHaltNavigations) break;
  }

  return {artifacts: {...artifacts, LighthouseRunWarnings}};
}

/**
 * @param {{requestedUrl?: string, driver: Driver, config: LH.Config.FRConfig}} args
 */
async function _cleanup({requestedUrl, driver, config}) {
  const didResetStorage = !config.settings.disableStorageReset && requestedUrl;
  if (didResetStorage) await storage.clearDataForOrigin(driver.defaultSession, requestedUrl);

  await driver.disconnect();
}

/**
 * @param {LH.NavigationRequestor} requestor
 * @param {{page: import('puppeteer').Page, config?: LH.Config.Json, configContext?: LH.Config.FRContext}} options
 * @return {Promise<LH.Gatherer.FRGatherResult>}
 */
async function navigationGather(requestor, options) {
  const {page, configContext = {}} = options;
  log.setLevel(configContext.logLevel || 'error');

  const {config} = initializeConfig(options.config, {...configContext, gatherMode: 'navigation'});
  const computedCache = new Map();
  const internalOptions = {
    skipAboutBlank: configContext.skipAboutBlank,
  };

  // We can't trigger the navigation through user interaction if we reset the page before starting.
  if (typeof requestor !== 'string') {
    internalOptions.skipAboutBlank = true;
  }

  const runnerOptions = {config, computedCache};
  const artifacts = await Runner.gather(
    async () => {
      const driver = new Driver(page);
      const context = {
        driver,
        config,
        requestor: typeof requestor === 'string' ? URL.normalizeUrl(requestor) : requestor,
        options: internalOptions,
      };
      const {baseArtifacts} = await _setup(context);
      const {artifacts} = await _navigations({...context, baseArtifacts, computedCache});
      await _cleanup(context);

      return finalizeArtifacts(baseArtifacts, artifacts);
    },
    runnerOptions
  );
  return {artifacts, runnerOptions};
}

module.exports = {
  navigationGather,
  _setup,
  _setupNavigation,
  _navigate,
  _navigation,
  _navigations,
  _cleanup,
};
