/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const NO_THROTTLING_METRICS = {
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
  offline: false,
};

const NO_CPU_THROTTLE_METRICS = {
  rate: 1,
};

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
async function emulate(session, settings) {
  if (settings.emulatedUserAgent !== false) {
    // Network.enable must be called for UA overriding to work
    await session.sendCommand('Network.enable');
    await session.sendCommand('Network.setUserAgentOverride', {
      userAgent: /** @type {string} */ (settings.emulatedUserAgent),
    });
  }
  // See devtools-entry for one usecase for disabling screenEmulation
  if (settings.screenEmulation.disabled !== true) {
    const {width, height, deviceScaleFactor, mobile} = settings.screenEmulation;
    const params = {width, height, deviceScaleFactor, mobile};
    await session.sendCommand('Emulation.setDeviceMetricsOverride', params);
    await session.sendCommand('Emulation.setTouchEmulationEnabled', {
      enabled: params.mobile,
    });
  }
}

/**
 * Sets the throttling options specified in config settings, clearing existing network throttling if
 * throttlingMethod is not `devtools` (but not CPU throttling, suspected requirement of WPT-compat).
 *
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
async function throttle(session, settings) {
  // TODO(FR-COMPAT): reconsider if this should be resetting anything
  if (settings.throttlingMethod !== 'devtools') return clearNetworkThrottling(session);

  await Promise.all([
    enableNetworkThrottling(session, settings.throttling),
    enableCPUThrottling(session, settings.throttling),
  ]);
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<void>}
 */
async function clearThrottling(session) {
  await Promise.all([clearNetworkThrottling(session), clearCPUThrottling(session)]);
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableNetworkThrottling(session, throttlingSettings) {
  /** @type {LH.Crdp.Network.EmulateNetworkConditionsRequest} */
  const conditions = {
    offline: false,
    latency: throttlingSettings.requestLatencyMs || 0,
    downloadThroughput: throttlingSettings.downloadThroughputKbps || 0,
    uploadThroughput: throttlingSettings.uploadThroughputKbps || 0,
  };

  // DevTools expects throughput in bytes per second rather than kbps
  conditions.downloadThroughput = Math.floor(conditions.downloadThroughput * 1024 / 8);
  conditions.uploadThroughput = Math.floor(conditions.uploadThroughput * 1024 / 8);
  return session.sendCommand('Network.emulateNetworkConditions', conditions);
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<void>}
 */
function clearNetworkThrottling(session) {
  return session.sendCommand('Network.emulateNetworkConditions', NO_THROTTLING_METRICS);
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableCPUThrottling(session, throttlingSettings) {
  const rate = throttlingSettings.cpuSlowdownMultiplier;
  return session.sendCommand('Emulation.setCPUThrottlingRate', {rate});
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<void>}
 */
function clearCPUThrottling(session) {
  return session.sendCommand('Emulation.setCPUThrottlingRate', NO_CPU_THROTTLE_METRICS);
}

module.exports = {
  emulate,
  throttle,
  clearThrottling,
  enableNetworkThrottling,
  clearNetworkThrottling,
  enableCPUThrottling,
  clearCPUThrottling,
};
