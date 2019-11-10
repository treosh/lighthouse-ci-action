/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @typedef {import('../gather/driver.js')} Driver */

/**
 * Nexus 5X metrics adapted from emulated_devices/module.json
 * @type {LH.Crdp.Emulation.SetDeviceMetricsOverrideRequest}
 */
const NEXUS5X_EMULATION_METRICS = {
  mobile: true,
  screenWidth: 412,
  screenHeight: 660,
  width: 412,
  height: 660,
  positionX: 0,
  positionY: 0,
  scale: 1,
  deviceScaleFactor: 2.625,
  screenOrientation: {
    angle: 0,
    type: 'portraitPrimary',
  },
};

/**
 * Desktop metrics adapted from emulated_devices/module.json
 * @type {LH.Crdp.Emulation.SetDeviceMetricsOverrideRequest}
 */
const DESKTOP_EMULATION_METRICS = {
  mobile: false,
  width: 1350,
  height: 940,
  deviceScaleFactor: 1,
};

// eslint-disable-next-line max-len
const NEXUS5X_USERAGENT = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Mobile Safari/537.36 Chrome-Lighthouse';
// eslint-disable-next-line max-len
const DESKTOP_USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Safari/537.36 Chrome-Lighthouse';

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
 * @param {Driver} driver
 * @return {Promise<void>}
 */
async function enableNexus5X(driver) {
  await Promise.all([
    driver.sendCommand('Emulation.setDeviceMetricsOverride', NEXUS5X_EMULATION_METRICS),
    // Network.enable must be called for UA overriding to work
    driver.sendCommand('Network.enable'),
    driver.sendCommand('Network.setUserAgentOverride', {userAgent: NEXUS5X_USERAGENT}),
    driver.sendCommand('Emulation.setTouchEmulationEnabled', {enabled: true}),
  ]);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
async function enableDesktop(driver) {
  await Promise.all([
    driver.sendCommand('Emulation.setDeviceMetricsOverride', DESKTOP_EMULATION_METRICS),
    // Network.enable must be called for UA overriding to work
    driver.sendCommand('Network.enable'),
    driver.sendCommand('Network.setUserAgentOverride', {userAgent: DESKTOP_USERAGENT}),
    driver.sendCommand('Emulation.setTouchEmulationEnabled', {enabled: false}),
  ]);
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
  enableNexus5X,
  enableDesktop,
  enableNetworkThrottling,
  clearAllNetworkEmulation,
  enableCPUThrottling,
  disableCPUThrottling,
  goOffline,
  MOBILE_USERAGENT: NEXUS5X_USERAGENT,
  DESKTOP_USERAGENT,
};
