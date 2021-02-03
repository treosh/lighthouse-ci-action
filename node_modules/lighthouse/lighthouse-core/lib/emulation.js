/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @typedef {import('../gather/driver.js')} Driver */

const OFFLINE_METRICS = {
  offline: true,
  // values of 0 remove any active throttling. crbug.com/456324#c9
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
};

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
 *
 * @param {Driver} driver
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
async function emulate(driver, settings) {
  if (settings.emulatedUserAgent !== false) {
    // Network.enable must be called for UA overriding to work
    await driver.sendCommand('Network.enable');
    await driver.sendCommand('Network.setUserAgentOverride', {
      userAgent: /** @type {string} */ (settings.emulatedUserAgent),
    });
  }
  // See devtools-entry for one usecase for disabling screenEmulation
  if (settings.screenEmulation.disabled !== true) {
    const {width, height, deviceScaleFactor, mobile} = settings.screenEmulation;
    const params = {width, height, deviceScaleFactor, mobile};
    await driver.sendCommand('Emulation.setDeviceMetricsOverride', params);
    await driver.sendCommand('Emulation.setTouchEmulationEnabled', {
      enabled: params.mobile,
    });
  }
}


/**
 * @param {Driver} driver
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableNetworkThrottling(driver, throttlingSettings) {
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
  return driver.sendCommand('Network.emulateNetworkConditions', conditions);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function clearAllNetworkEmulation(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', NO_THROTTLING_METRICS);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function goOffline(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', OFFLINE_METRICS);
}

/**
 * @param {Driver} driver
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableCPUThrottling(driver, throttlingSettings) {
  const rate = throttlingSettings.cpuSlowdownMultiplier;
  return driver.sendCommand('Emulation.setCPUThrottlingRate', {rate});
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function disableCPUThrottling(driver) {
  return driver.sendCommand('Emulation.setCPUThrottlingRate', NO_CPU_THROTTLE_METRICS);
}

module.exports = {
  emulate,
  enableNetworkThrottling,
  clearAllNetworkEmulation,
  enableCPUThrottling,
  disableCPUThrottling,
  goOffline,
};
