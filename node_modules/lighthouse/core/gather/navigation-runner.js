/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import puppeteer from 'puppeteer-core';
import log from 'lighthouse-logger';

import {Driver} from './driver.js';
import {Runner} from '../runner.js';
import {getEmptyArtifactState, collectPhaseArtifacts, awaitArtifacts} from './runner-helpers.js';
import * as prepare from './driver/prepare.js';
import {gotoURL} from './driver/navigation.js';
import * as storage from './driver/storage.js';
import * as emulation from '../lib/emulation.js';
import {defaultNavigationConfig} from '../config/constants.js';
import {initializeConfig} from '../config/config.js';
import {getBaseArtifacts, finalizeArtifacts} from './base-artifacts.js';
import * as format from '../../shared/localization/format.js';
import {LighthouseError} from '../lib/lh-error.js';
import UrlUtils from '../lib/url-utils.js';
import {getPageLoadError} from '../lib/navigation-error.js';
import Trace from './gatherers/trace.js';
import DevtoolsLog from './gatherers/devtools-log.js';
import {NetworkRecords} from '../computed/network-records.js';

/**
 * @typedef NavigationContext
 * @property {Driver} driver
 * @property {LH.Puppeteer.Page} page
 * @property {LH.Config.ResolvedConfig} resolvedConfig
 * @property {LH.Config.NavigationDefn} navigation
 * @property {LH.NavigationRequestor} requestor
 * @property {LH.FRBaseArtifacts} baseArtifacts
 * @property {Map<string, LH.ArbitraryEqualityMap>} computedCache
 */

/** @typedef {Omit<Parameters<typeof collectPhaseArtifacts>[0], 'phase'>} PhaseState */

const DEFAULT_HOSTNAME = '127.0.0.1';
const DEFAULT_PORT = 9222;

/**
 * @param {{driver: Driver, resolvedConfig: LH.Config.ResolvedConfig, requestor: LH.NavigationRequestor}} args
 * @return {Promise<{baseArtifacts: LH.FRBaseArtifacts}>}
 */
async function _setup({driver, resolvedConfig, requestor}) {
  await driver.connect();

  // We can't trigger the navigation through user interaction if we reset the page before starting.
  if (typeof requestor === 'string' && !resolvedConfig.settings.skipAboutBlank) {
    await gotoURL(driver, defaultNavigationConfig.blankPage, {waitUntil: ['navigated']});
  }

  const baseArtifacts = await getBaseArtifacts(resolvedConfig, driver, {gatherMode: 'navigation'});

  await prepare.prepareTargetForNavigationMode(driver, resolvedConfig.settings);

  return {baseArtifacts};
}

/**
 * @param {NavigationContext} navigationContext
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
async function _setupNavigation({requestor, driver, navigation, resolvedConfig}) {
  // We can't trigger the navigation through user interaction if we reset the page before starting.
  if (typeof requestor === 'string' && !resolvedConfig.settings.skipAboutBlank) {
    await gotoURL(driver, navigation.blankPage, {...navigation, waitUntil: ['navigated']});
  }

  const {warnings} = await prepare.prepareTargetForIndividualNavigation(
    driver.defaultSession,
    resolvedConfig.settings,
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
 * @return {Promise<{requestedUrl: string, mainDocumentUrl: string, navigationError: LH.LighthouseError | undefined, warnings: Array<LH.IcuMessage>}>}
 */
async function _navigate(navigationContext) {
  const {driver, resolvedConfig, requestor} = navigationContext;

  try {
    const {requestedUrl, mainDocumentUrl, warnings} = await gotoURL(driver, requestor, {
      ...navigationContext.navigation,
      debugNavigation: resolvedConfig.settings.debugNavigation,
      maxWaitForFcp: resolvedConfig.settings.maxWaitForFcp,
      maxWaitForLoad: resolvedConfig.settings.maxWaitForLoad,
      waitUntil: navigationContext.navigation.pauseAfterFcpMs ? ['fcp', 'load'] : ['load'],
    });
    return {requestedUrl, mainDocumentUrl, navigationError: undefined, warnings};
  } catch (err) {
    if (!(err instanceof LighthouseError)) throw err;
    if (err.code !== 'NO_FCP' && err.code !== 'PAGE_HUNG') throw err;
    if (typeof requestor !== 'string') throw err;

    // TODO: Make the urls optional here so we don't need to throw an error with a callback requestor.
    return {
      requestedUrl: requestor,
      mainDocumentUrl: requestor,
      navigationError: err,
      warnings: [],
    };
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
  const devtoolsLog = devtoolsLogArtifactId && (await getArtifactState[devtoolsLogArtifactId]);
  const records = devtoolsLog && (await NetworkRecords.request(devtoolsLog, navigationContext));

  const traceArtifactId = traceArtifactDefn?.id;
  const trace = traceArtifactId && (await getArtifactState[traceArtifactId]);

  return {devtoolsLog, records, trace};
}

/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @param {Awaited<ReturnType<typeof _setupNavigation>>} setupResult
 * @param {Awaited<ReturnType<typeof _navigate>>} navigateResult
 * @return {Promise<{artifacts: Partial<LH.GathererArtifacts>, warnings: Array<LH.IcuMessage>, pageLoadError: LH.LighthouseError | undefined}>}
 */
async function _computeNavigationResult(
  navigationContext,
  phaseState,
  setupResult,
  navigateResult
) {
  const {navigationError, mainDocumentUrl} = navigateResult;
  const warnings = [...setupResult.warnings, ...navigateResult.warnings];
  const debugData = await _collectDebugData(navigationContext, phaseState);
  const pageLoadError = debugData.records
    ? getPageLoadError(navigationError, {
      url: mainDocumentUrl,
      loadFailureMode: navigationContext.navigation.loadFailureMode,
      networkRecords: debugData.records,
      warnings,
    })
    : navigationError;

  if (pageLoadError) {
    const locale = navigationContext.resolvedConfig.settings.locale;
    const localizedMessage = format.getFormatted(pageLoadError.friendlyMessage, locale);
    log.error('NavigationRunner', localizedMessage, navigateResult.requestedUrl);

    /** @type {Partial<LH.GathererArtifacts>} */
    const artifacts = {};
    const pageLoadErrorId = `pageLoadError-${navigationContext.navigation.id}`;
    if (debugData.devtoolsLog) artifacts.devtoolsLogs = {[pageLoadErrorId]: debugData.devtoolsLog};
    if (debugData.trace) artifacts.traces = {[pageLoadErrorId]: debugData.trace};

    return {
      pageLoadError,
      artifacts,
      warnings: [...warnings, pageLoadError.friendlyMessage],
    };
  } else {
    await collectPhaseArtifacts({phase: 'getArtifact', ...phaseState});

    const artifacts = await awaitArtifacts(phaseState.artifactState);
    return {
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
    page: navigationContext.page,
    computedCache: navigationContext.computedCache,
    artifactDefinitions: navigationContext.navigation.artifacts,
    artifactState,
    baseArtifacts: navigationContext.baseArtifacts,
    settings: navigationContext.resolvedConfig.settings,
  };

  const setupResult = await _setupNavigation(navigationContext);

  const disableAsyncStacks =
    await prepare.enableAsyncStacks(navigationContext.driver.defaultSession);

  await collectPhaseArtifacts({phase: 'startInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'startSensitiveInstrumentation', ...phaseState});
  const navigateResult = await _navigate(navigationContext);

  // Every required url is initialized to an empty string in `getBaseArtifacts`.
  // If we haven't set all the required urls yet, set them here.
  if (!Object.values(phaseState.baseArtifacts).every(Boolean)) {
    phaseState.baseArtifacts.URL = {
      requestedUrl: navigateResult.requestedUrl,
      mainDocumentUrl: navigateResult.mainDocumentUrl,
      finalDisplayedUrl: await navigationContext.driver.url(),
    };
  }
  phaseState.url = navigateResult.mainDocumentUrl;

  await collectPhaseArtifacts({phase: 'stopSensitiveInstrumentation', ...phaseState});
  await collectPhaseArtifacts({phase: 'stopInstrumentation', ...phaseState});

  // bf-cache-failures can emit `Page.frameNavigated` at the end of the run.
  // This can cause us to issue protocol commands after the target closes.
  // We should disable our `Page.frameNavigated` handlers before that.
  await disableAsyncStacks();

  await _cleanupNavigation(navigationContext);

  return _computeNavigationResult(navigationContext, phaseState, setupResult, navigateResult);
}

/**
 * @param {{driver: Driver, page: LH.Puppeteer.Page, resolvedConfig: LH.Config.ResolvedConfig, requestor: LH.NavigationRequestor; baseArtifacts: LH.FRBaseArtifacts, computedCache: NavigationContext['computedCache']}} args
 * @return {Promise<{artifacts: Partial<LH.FRArtifacts & LH.FRBaseArtifacts>}>}
 */
async function _navigations(args) {
  const {
    driver,
    page,
    resolvedConfig,
    requestor,
    baseArtifacts,
    computedCache,
  } = args;

  if (!resolvedConfig.artifacts || !resolvedConfig.navigations) {
    throw new Error('No artifacts were defined on the config');
  }

  /** @type {Partial<LH.FRArtifacts & LH.FRBaseArtifacts>} */
  const artifacts = {};
  /** @type {Array<LH.IcuMessage>} */
  const LighthouseRunWarnings = [];

  for (const navigation of resolvedConfig.navigations) {
    const navigationContext = {
      driver,
      page,
      navigation,
      requestor,
      resolvedConfig,
      baseArtifacts,
      computedCache,
    };

    let shouldHaltNavigations = false;
    const navigationResult = await _navigation(navigationContext);
    if (navigation.loadFailureMode === 'fatal') {
      if (navigationResult.pageLoadError) {
        artifacts.PageLoadError = navigationResult.pageLoadError;
        shouldHaltNavigations = true;
      }
    }

    LighthouseRunWarnings.push(...navigationResult.warnings);
    Object.assign(artifacts, navigationResult.artifacts);
    if (shouldHaltNavigations) break;
  }

  return {artifacts: {...artifacts, LighthouseRunWarnings}};
}

/**
 * @param {{requestedUrl?: string, driver: Driver, resolvedConfig: LH.Config.ResolvedConfig, lhBrowser?: LH.Puppeteer.Browser, lhPage?: LH.Puppeteer.Page}} args
 */
async function _cleanup({requestedUrl, driver, resolvedConfig, lhBrowser, lhPage}) {
  const didResetStorage = !resolvedConfig.settings.disableStorageReset && requestedUrl;
  if (didResetStorage) await storage.clearDataForOrigin(driver.defaultSession, requestedUrl);

  await driver.disconnect();

  // If Lighthouse started the Puppeteer instance then we are responsible for closing it.
  await lhPage?.close();
  await lhBrowser?.disconnect();
}

/**
 * @param {LH.Puppeteer.Page|undefined} page
 * @param {LH.NavigationRequestor|undefined} requestor
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<LH.Gatherer.FRGatherResult>}
 */
async function navigationGather(page, requestor, options = {}) {
  const {flags = {}, config} = options;
  log.setLevel(flags.logLevel || 'error');

  const {resolvedConfig} = await initializeConfig('navigation', config, flags);
  const computedCache = new Map();

  const isCallback = typeof requestor === 'function';

  const runnerOptions = {resolvedConfig, computedCache};
  const artifacts = await Runner.gather(
    async () => {
      const normalizedRequestor = isCallback ? requestor : UrlUtils.normalizeUrl(requestor);

      /** @type {LH.Puppeteer.Browser|undefined} */
      let lhBrowser = undefined;
      /** @type {LH.Puppeteer.Page|undefined} */
      let lhPage = undefined;

      // For navigation mode, we shouldn't connect to a browser in audit mode,
      // therefore we connect to the browser in the gatherFn callback.
      if (!page) {
        const {hostname = DEFAULT_HOSTNAME, port = DEFAULT_PORT} = flags;
        lhBrowser = await puppeteer.connect({browserURL: `http://${hostname}:${port}`});
        lhPage = await lhBrowser.newPage();
        page = lhPage;
      }

      const driver = new Driver(page);
      const context = {
        driver,
        lhBrowser,
        lhPage,
        resolvedConfig,
        requestor: normalizedRequestor,
      };
      const {baseArtifacts} = await _setup(context);
      const {artifacts} = await _navigations({...context, page, baseArtifacts, computedCache});
      await _cleanup(context);

      return finalizeArtifacts(baseArtifacts, artifacts);
    },
    runnerOptions
  );
  return {artifacts, runnerOptions};
}

export {
  navigationGather,
  _setup,
  _setupNavigation,
  _navigate,
  _navigation,
  _navigations,
  _cleanup,
};
