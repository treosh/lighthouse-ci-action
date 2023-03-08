/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const NetworkMonitor = require('./network-monitor.js');
const {waitForFullyLoaded, waitForFrameNavigated, waitForUserToContinue} = require('./wait-for-condition.js'); // eslint-disable-line max-len
const constants = require('../../config/constants.js');
const i18n = require('../../lib/i18n/i18n.js');
const URL = require('../../lib/url-shim.js');

const UIStrings = {
  /**
   * @description Warning that the web page redirected during testing and that may have affected the load.
   * @example {https://example.com/requested/page} requested
   * @example {https://example.com/final/resolved/page} final
   */
  warningRedirected: 'The page may not be loading as expected because your test URL ' +
  `({requested}) was redirected to {final}. ` +
  'Try testing the second URL directly.',
  /**
   * @description Warning that Lighthouse timed out while waiting for the page to load.
   */
  warningTimeout: 'The page loaded too slowly to finish within the time limit. ' +
  'Results may be incomplete.',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);


// Controls how long to wait after FCP before continuing
const DEFAULT_PAUSE_AFTER_FCP = 0;
// Controls how long to wait after onLoad before continuing
const DEFAULT_PAUSE_AFTER_LOAD = 0;
// Controls how long to wait between network requests before determining the network is quiet
const DEFAULT_NETWORK_QUIET_THRESHOLD = 5000;
// Controls how long to wait between longtasks before determining the CPU is idle, off by default
const DEFAULT_CPU_QUIET_THRESHOLD = 0;

/** @typedef {{waitUntil: Array<'fcp'|'load'|'navigated'>} & LH.Config.SharedPassNavigationJson & Partial<Pick<LH.Config.Settings, 'maxWaitForFcp'|'maxWaitForLoad'|'debugNavigation'>>} NavigationOptions */

/** @param {NavigationOptions} options */
function resolveWaitForFullyLoadedOptions(options) {
  /* eslint-disable max-len */
  let {pauseAfterFcpMs, pauseAfterLoadMs, networkQuietThresholdMs, cpuQuietThresholdMs} = options;
  let maxWaitMs = options.maxWaitForLoad;
  let maxFCPMs = options.maxWaitForFcp;

  if (typeof pauseAfterFcpMs !== 'number') pauseAfterFcpMs = DEFAULT_PAUSE_AFTER_FCP;
  if (typeof pauseAfterLoadMs !== 'number') pauseAfterLoadMs = DEFAULT_PAUSE_AFTER_LOAD;
  if (typeof networkQuietThresholdMs !== 'number') {
    networkQuietThresholdMs = DEFAULT_NETWORK_QUIET_THRESHOLD;
  }
  if (typeof cpuQuietThresholdMs !== 'number') cpuQuietThresholdMs = DEFAULT_CPU_QUIET_THRESHOLD;
  if (typeof maxWaitMs !== 'number') maxWaitMs = constants.defaultSettings.maxWaitForLoad;
  if (typeof maxFCPMs !== 'number') maxFCPMs = constants.defaultSettings.maxWaitForFcp;
  /* eslint-enable max-len */

  if (!options.waitUntil.includes('fcp')) maxFCPMs = undefined;

  return {
    pauseAfterFcpMs,
    pauseAfterLoadMs,
    networkQuietThresholdMs,
    cpuQuietThresholdMs,
    maxWaitForLoadedMs: maxWaitMs,
    maxWaitForFcpMs: maxFCPMs,
  };
}

/**
 * Navigates to the given URL, assuming that the page is not already on this URL.
 * Resolves on the url of the loaded page, taking into account any redirects.
 * Typical use of this method involves navigating to a neutral page such as `about:blank` in between
 * navigations.
 *
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {LH.NavigationRequestor} requestor
 * @param {NavigationOptions} options
 * @return {Promise<{requestedUrl: string, finalUrl: string, warnings: Array<LH.IcuMessage>}>}
 */
async function gotoURL(driver, requestor, options) {
  const status = typeof requestor === 'string' ?
    {msg: `Navigating to ${requestor}`, id: 'lh:driver:navigate'} :
    {msg: 'Navigating using a user defined function', id: 'lh:driver:navigate'};
  log.time(status);

  const session = driver.defaultSession;
  const networkMonitor = new NetworkMonitor(driver.defaultSession);

  // Enable the events and network monitor needed to track navigation progress.
  await networkMonitor.enable();
  await session.sendCommand('Page.enable');
  await session.sendCommand('Page.setLifecycleEventsEnabled', {enabled: true});

  let waitForNavigationTriggered;
  if (typeof requestor === 'string') {
    // No timeout needed for Page.navigate. See https://github.com/GoogleChrome/lighthouse/pull/6413
    session.setNextProtocolTimeout(Infinity);
    waitForNavigationTriggered = session.sendCommand('Page.navigate', {url: requestor});
  } else {
    waitForNavigationTriggered = requestor();
  }

  const waitForNavigated = options.waitUntil.includes('navigated');
  const waitForLoad = options.waitUntil.includes('load');
  const waitForFcp = options.waitUntil.includes('fcp');

  /** @type {Array<Promise<{timedOut: boolean}>>} */
  const waitConditionPromises = [];

  if (waitForNavigated) {
    const navigatedPromise = waitForFrameNavigated(session).promise;
    waitConditionPromises.push(navigatedPromise.then(() => ({timedOut: false})));
  }

  if (waitForLoad) {
    const waitOptions = resolveWaitForFullyLoadedOptions(options);
    waitConditionPromises.push(waitForFullyLoaded(session, networkMonitor, waitOptions));
  } else if (waitForFcp) {
    throw new Error('Cannot wait for FCP without waiting for page load');
  }

  const waitConditions = await Promise.all(waitConditionPromises);
  const timedOut = waitConditions.some(condition => condition.timedOut);
  const navigationUrls = await networkMonitor.getNavigationUrls();

  let requestedUrl = navigationUrls.requestedUrl;
  if (typeof requestor === 'string') {
    if (requestor !== requestedUrl) {
      log.error('Navigation', 'Provided URL did not match initial navigation URL');
    }
    requestedUrl = requestor;
  }
  if (!requestedUrl) throw Error('No navigations detected when running user defined requestor.');

  const finalUrl = navigationUrls.finalUrl || requestedUrl;

  // Bring `Page.navigate` errors back into the promise chain. See https://github.com/GoogleChrome/lighthouse/pull/6739.
  await waitForNavigationTriggered;
  await networkMonitor.disable();

  if (options.debugNavigation) {
    await waitForUserToContinue(driver);
  }

  log.timeEnd(status);
  return {
    requestedUrl,
    finalUrl,
    warnings: getNavigationWarnings({timedOut, finalUrl, requestedUrl}),
  };
}

/**
 * @param {{timedOut: boolean, requestedUrl: string, finalUrl: string; }} navigation
 * @return {Array<LH.IcuMessage>}
 */
function getNavigationWarnings(navigation) {
  const {requestedUrl, finalUrl} = navigation;
  /** @type {Array<LH.IcuMessage>} */
  const warnings = [];

  if (navigation.timedOut) warnings.push(str_(UIStrings.warningTimeout));

  if (!URL.equalWithExcludedFragments(requestedUrl, finalUrl)) {
    warnings.push(str_(UIStrings.warningRedirected, {
      requested: requestedUrl,
      final: finalUrl,
    }));
  }

  return warnings;
}

module.exports = {gotoURL, getNavigationWarnings, UIStrings};
