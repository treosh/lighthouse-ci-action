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
const {getBaseArtifacts} = require('./base-artifacts.js');
const i18n = require('../../lib/i18n/i18n.js');
const LighthouseError = require('../../lib/lh-error.js');
const {getPageLoadError} = require('../../lib/navigation-error.js');
const DevtoolsLog = require('../../gather/gatherers/devtools-log.js');
const NetworkRecords = require('../../computed/network-records.js');

/**
 * @typedef NavigationContext
 * @property {Driver} driver
 * @property {LH.Config.FRConfig} config
 * @property {LH.Config.NavigationDefn} navigation
 * @property {string} requestedUrl
 * @property {Map<string, LH.ArbitraryEqualityMap>} computedCache
 */

/** @typedef {Omit<Parameters<typeof collectPhaseArtifacts>[0], 'phase'>} PhaseState */

/**
 * @param {{driver: Driver, config: LH.Config.FRConfig, requestedUrl: string}} args
 * @return {Promise<{baseArtifacts: LH.FRBaseArtifacts}>}
 */
async function _setup({driver, config, requestedUrl}) {
  await driver.connect();
  await gotoURL(driver, defaultNavigationConfig.blankPage, {waitUntil: ['navigated']});

  const baseArtifacts = await getBaseArtifacts(config, driver);
  baseArtifacts.URL.requestedUrl = requestedUrl;

  await prepare.prepareTargetForNavigationMode(driver, config.settings);

  return {baseArtifacts};
}

/**
 * @param {NavigationContext} navigationContext
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
async function _setupNavigation({requestedUrl, driver, navigation, config}) {
  await gotoURL(driver, navigation.blankPage, {...navigation, waitUntil: ['navigated']});
  const {warnings} = await prepare.prepareTargetForIndividualNavigation(
    driver.defaultSession,
    config.settings,
    {
      ...navigation,
      url: requestedUrl,
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
 * @return {Promise<{finalUrl: string, navigationError: LH.LighthouseError | undefined, warnings: Array<LH.IcuMessage>}>}
 */
async function _navigate(navigationContext) {
  const {driver, config, requestedUrl} = navigationContext;

  try {
    const {finalUrl, warnings} = await gotoURL(driver, requestedUrl, {
      ...navigationContext.navigation,
      maxWaitForFcp: config.settings.maxWaitForFcp,
      maxWaitForLoad: config.settings.maxWaitForLoad,
      waitUntil: navigationContext.navigation.pauseAfterFcpMs ? ['fcp', 'load'] : ['load'],
    });

    return {finalUrl, navigationError: undefined, warnings};
  } catch (err) {
    if (!(err instanceof LighthouseError)) throw err;
    if (err.code !== 'NO_FCP' && err.code !== 'PAGE_HUNG') throw err;
    return {finalUrl: requestedUrl, navigationError: err, warnings: []};
  }
}

/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @return {Promise<Array<LH.Artifacts.NetworkRequest> | undefined>}
 */
async function _collectNetworkRecords(navigationContext, phaseState) {
  const devtoolsLogArtifactDefn = phaseState.artifactDefinitions.find(
    definition => definition.gatherer.instance.meta.symbol === DevtoolsLog.symbol
  );
  if (!devtoolsLogArtifactDefn) return undefined;

  const devtoolsLogArtifactId = devtoolsLogArtifactDefn.id;
  const artifactDefinitions = [devtoolsLogArtifactDefn];
  await collectPhaseArtifacts({...phaseState, phase: 'getArtifact', artifactDefinitions});

  const devtoolsLog = await phaseState.artifactState.getArtifact[devtoolsLogArtifactId];
  const records = await NetworkRecords.request(devtoolsLog, navigationContext);
  return records;
}

/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @param {UnPromise<ReturnType<typeof _setupNavigation>>} setupResult
 * @param {UnPromise<ReturnType<typeof _navigate>>} navigateResult
 * @return {Promise<{artifacts: Partial<LH.GathererArtifacts>, warnings: Array<LH.IcuMessage>, pageLoadError: LH.LighthouseError | undefined}>}
 */
async function _computeNavigationResult(
  navigationContext,
  phaseState,
  setupResult,
  navigateResult
) {
  const {navigationError, finalUrl} = navigateResult;
  const warnings = [...setupResult.warnings, ...navigateResult.warnings];
  const networkRecords = await _collectNetworkRecords(navigationContext, phaseState);
  const pageLoadError = networkRecords
    ? getPageLoadError(navigationError, {
      url: finalUrl,
      loadFailureMode: navigationContext.navigation.loadFailureMode,
      networkRecords,
    })
    : navigationError;

  if (pageLoadError) {
    const locale = navigationContext.config.settings.locale;
    const localizedMessage = i18n.getFormatted(pageLoadError.friendlyMessage, locale);
    log.error('NavigationRunner', localizedMessage, navigationContext.requestedUrl);

    return {artifacts: {}, warnings: [...warnings, pageLoadError.friendlyMessage], pageLoadError};
  } else {
    await collectPhaseArtifacts({phase: 'getArtifact', ...phaseState});

    const artifacts = await awaitArtifacts(phaseState.artifactState);
    return {artifacts, warnings, pageLoadError: undefined};
  }
}

/**
 * @param {NavigationContext} navigationContext
 * @return {ReturnType<typeof _computeNavigationResult>}
 */
async function _navigation(navigationContext) {
  const artifactState = getEmptyArtifactState();
  const phaseState = {
    gatherMode: /** @type {'navigation'} */ ('navigation'),
    driver: navigationContext.driver,
    computedCache: navigationContext.computedCache,
    artifactDefinitions: navigationContext.navigation.artifacts,
    artifactState,
    settings: navigationContext.config.settings,
  };

  const setupResult = await _setupNavigation(navigationContext);
  await collectPhaseArtifacts({phase: 'startInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'startSensitiveInstrumentation', ...phaseState});
  const navigateResult = await _navigate(navigationContext);
  await collectPhaseArtifacts({phase: 'stopSensitiveInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'stopInstrumentation', ...phaseState});
  await _cleanupNavigation(navigationContext);

  return _computeNavigationResult(navigationContext, phaseState, setupResult, navigateResult);
}

/**
 * @param {{driver: Driver, config: LH.Config.FRConfig, requestedUrl: string; computedCache: NavigationContext['computedCache']}} args
 * @return {Promise<{artifacts: Partial<LH.FRArtifacts & LH.FRBaseArtifacts>}>}
 */
async function _navigations({driver, config, requestedUrl, computedCache}) {
  if (!config.navigations) throw new Error('No navigations configured');

  /** @type {Partial<LH.FRArtifacts & LH.FRBaseArtifacts>} */
  const artifacts = {};

  for (const navigation of config.navigations) {
    const navigationContext = {
      driver,
      navigation,
      requestedUrl,
      config,
      computedCache,
    };

    const navigationResult = await _navigation(navigationContext);
    if (navigationResult.pageLoadError && navigation.loadFailureMode === 'fatal') {
      artifacts.PageLoadError = navigationResult.pageLoadError;
      break;
    }

    // TODO(FR-COMPAT): merge RunWarnings between navigations
    Object.assign(artifacts, navigationResult.artifacts);
  }

  return {artifacts};
}

/**
 * @param {{requestedUrl: string, driver: Driver, config: LH.Config.FRConfig}} args
 */
async function _cleanup({requestedUrl, driver, config}) {
  const didResetStorage = !config.settings.disableStorageReset;
  if (didResetStorage) await storage.clearDataForOrigin(driver.defaultSession, requestedUrl);

  // TODO(FR-COMPAT): add driver.disconnect session tracking
}

/**
 * @param {{url: string, page: import('puppeteer').Page, config?: LH.Config.Json}} options
 * @return {Promise<LH.RunnerResult|undefined>}
 */
async function navigation(options) {
  const {url: requestedUrl, page} = options;
  const {config} = initializeConfig(options.config, {gatherMode: 'navigation'});
  const computedCache = new Map();

  return Runner.run(
    async () => {
      const driver = new Driver(page);
      const {baseArtifacts} = await _setup({driver, config, requestedUrl});
      const {artifacts} = await _navigations({driver, config, requestedUrl, computedCache});
      await _cleanup({driver, config, requestedUrl});

      return /** @type {LH.Artifacts} */ ({...baseArtifacts, ...artifacts}); // Cast to drop Partial<>
    },
    {
      url: requestedUrl,
      config,
      computedCache: new Map(),
    }
  );
}

module.exports = {
  navigation,
  _setup,
  _setupNavigation,
  _navigate,
  _navigation,
  _navigations,
  _cleanup,
};
