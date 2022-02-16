/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const storage = require('./storage.js');
const emulation = require('../../lib/emulation.js');
const pageFunctions = require('../../lib/page-functions.js');

/**
 * Enables `Debugger` domain to receive async stacktrace information on network request initiators.
 * This is critical for tracking attribution of tasks and performance simulation accuracy.
 * @param {LH.Gatherer.FRProtocolSession} session
 */
async function enableAsyncStacks(session) {
  const enable = async () => {
    await session.sendCommand('Debugger.enable');
    await session.sendCommand('Debugger.setSkipAllPauses', {skip: true});
    await session.sendCommand('Debugger.setAsyncCallStackDepth', {maxDepth: 8});
  };

  // Resume any pauses that make it through `setSkipAllPauses`
  session.on('Debugger.paused', () => session.sendCommand('Debugger.resume'));

  // `Debugger.setSkipAllPauses` is reset after every navigation, so retrigger it on main frame navigations.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=990945&q=setSkipAllPauses&can=2
  session.on('Page.frameNavigated', event => {
    if (event.frame.parentId) return;
    enable().catch(err => log.error('Driver', err));
  });

  await enable();
}

/**
 * Use a RequestIdleCallback shim for tests run with simulated throttling, so that the deadline can be used without
 * a penalty.
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
async function shimRequestIdleCallbackOnNewDocument(driver, settings) {
  await driver.executionContext.evaluateOnNewDocument(pageFunctions.wrapRequestIdleCallback, {
    args: [settings.throttling.cpuSlowdownMultiplier],
  });
}

/**
 * Dismiss JavaScript dialogs (alert, confirm, prompt), providing a
 * generic promptText in case the dialog is a prompt.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<void>}
 */
async function dismissJavaScriptDialogs(session) {
  session.on('Page.javascriptDialogOpening', data => {
    log.warn('Driver', `${data.type} dialog opened by the page automatically suppressed.`);

    session
      .sendCommand('Page.handleJavaScriptDialog', {
        accept: true,
        promptText: 'Lighthouse prompt response',
      })
      .catch(err => log.warn('Driver', err));
  });

  await session.sendCommand('Page.enable');
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {{url: string}} navigation
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
async function resetStorageForNavigation(session, navigation) {
  /** @type {Array<LH.IcuMessage>} */
  const warnings = [];

  // Reset the storage and warn if there appears to be other important data.
  const warning = await storage.getImportantStorageWarning(session, navigation.url);
  if (warning) warnings.push(warning);
  await storage.clearDataForOrigin(session, navigation.url);
  await storage.clearBrowserCaches(session);

  return {warnings};
}

/**
 * Prepares a target for observational analysis by setting throttling and network headers/blocked patterns.
 *
 * This method assumes `prepareTargetForNavigationMode` or `prepareTargetForTimespanMode` has already been invoked.
 *
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @param {{disableThrottling: boolean, blockedUrlPatterns?: string[]}} options
 */
async function prepareThrottlingAndNetwork(session, settings, options) {
  const status = {msg: 'Preparing network conditions', id: `lh:gather:prepareThrottlingAndNetwork`};
  log.time(status);

  if (options.disableThrottling) await emulation.clearThrottling(session);
  else await emulation.throttle(session, settings);

  // Set request blocking before any network activity.
  // No "clearing" is done at the end of the recording since Network.setBlockedURLs([]) will unset all if
  // neccessary at the beginning of the next section.
  const blockedUrls = (options.blockedUrlPatterns || []).concat(
    settings.blockedUrlPatterns || []
  );
  await session.sendCommand('Network.setBlockedURLs', {urls: blockedUrls});

  const headers = settings.extraHeaders;
  if (headers) await session.sendCommand('Network.setExtraHTTPHeaders', {headers});

  log.timeEnd(status);
}

/**
 * Prepares a target to be analyzed by setting up device emulation (screen/UA, not throttling) and
 * async stack traces for network initiators.
 *
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {LH.Config.Settings} settings
 */
async function prepareDeviceEmulationAndAsyncStacks(driver, settings) {
  // Enable network domain here so future calls to `emulate()` don't clear cache (https://github.com/GoogleChrome/lighthouse/issues/12631)
  await driver.defaultSession.sendCommand('Network.enable');

  // Emulate our target device screen and user agent.
  await emulation.emulate(driver.defaultSession, settings);

  // Enable better stacks on network requests.
  await enableAsyncStacks(driver.defaultSession);
}

/**
 * Prepares a target to be analyzed in timespan mode by enabling protocol domains, emulation, and throttling.
 *
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {LH.Config.Settings} settings
 */
async function prepareTargetForTimespanMode(driver, settings) {
  const status = {msg: 'Preparing target for timespan mode', id: 'lh:prepare:timespanMode'};
  log.time(status);

  await prepareDeviceEmulationAndAsyncStacks(driver, settings);
  await prepareThrottlingAndNetwork(driver.defaultSession, settings, {
    disableThrottling: false,
    blockedUrlPatterns: undefined,
  });

  log.timeEnd(status);
}

/**
 * Prepares a target to be analyzed in navigation mode by enabling protocol domains, emulation, and new document
 * handlers for global APIs or error handling.
 *
 * This method should be used in combination with `prepareTargetForIndividualNavigation` before a specific navigation occurs.
 *
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {LH.Config.Settings} settings
 */
async function prepareTargetForNavigationMode(driver, settings) {
  const status = {msg: 'Preparing target for navigation mode', id: 'lh:prepare:navigationMode'};
  log.time(status);

  await prepareDeviceEmulationAndAsyncStacks(driver, settings);

  // Automatically handle any JavaScript dialogs to prevent a hung renderer.
  await dismissJavaScriptDialogs(driver.defaultSession);

  // Inject our snippet to cache important web platform APIs before they're (possibly) ponyfilled by the page.
  await driver.executionContext.cacheNativesOnNewDocument();

  // Wrap requestIdleCallback so pages under simulation receive the correct rIC deadlines.
  if (settings.throttlingMethod === 'simulate') {
    await shimRequestIdleCallbackOnNewDocument(driver, settings);
  }

  log.timeEnd(status);
}

/**
 * Prepares a target for a particular navigation by resetting storage and setting network.
 *
 * This method assumes `prepareTargetForNavigationMode` has already been invoked.
 *
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @param {Pick<LH.Config.NavigationDefn, 'disableThrottling'|'disableStorageReset'|'blockedUrlPatterns'> & {url: string}} navigation
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
async function prepareTargetForIndividualNavigation(session, settings, navigation) {
  const status = {msg: 'Preparing target for navigation', id: 'lh:prepare:navigation'};
  log.time(status);

  /** @type {Array<LH.IcuMessage>} */
  const warnings = [];

  const shouldResetStorage = !settings.disableStorageReset && !navigation.disableStorageReset;
  if (shouldResetStorage) {
    const {warnings: storageWarnings} = await resetStorageForNavigation(session, navigation);
    warnings.push(...storageWarnings);
  }

  await prepareThrottlingAndNetwork(session, settings, navigation);

  log.timeEnd(status);
  return {warnings};
}

module.exports = {
  prepareThrottlingAndNetwork,
  prepareTargetForTimespanMode,
  prepareTargetForNavigationMode,
  prepareTargetForIndividualNavigation,
};
