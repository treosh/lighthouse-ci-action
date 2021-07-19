/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {getBrowserVersion, getBenchmarkIndex} = require('../../gather/driver/environment.js');

/**
 * @param {LH.Config.FRConfig} config
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @return {Promise<LH.BaseArtifacts>}
 */
async function getBaseArtifacts(config, driver) {
  const HostUserAgent = (await getBrowserVersion(driver.defaultSession)).userAgent;

  // Whether Lighthouse was run on a mobile device (i.e. not on a desktop machine).
  const HostFormFactor =
    HostUserAgent.includes('Android') || HostUserAgent.includes('Mobile') ? 'mobile' : 'desktop';

  const BenchmarkIndex = await getBenchmarkIndex(driver.executionContext);

  /** @type {Array<string | LH.IcuMessage>} */
  const LighthouseRunWarnings = [];

  // TODO(FR-COMPAT): support slow host CPU warning
  // TODO(FR-COMPAT): support redirected URL warning

  return {
    // Meta artifacts.
    fetchTime: new Date().toJSON(),
    Timing: [],
    LighthouseRunWarnings,
    settings: config.settings,
    // Environment artifacts that can always be computed.
    HostFormFactor,
    HostUserAgent,
    BenchmarkIndex,
    // Contextual artifacts whose collection changes based on gather mode.
    URL: {requestedUrl: '', finalUrl: ''},
    PageLoadError: null, // TODO(FR-COMPAT): support PageLoadError
    // Artifacts that have been replaced by regular gatherers in Fraggle Rock.
    Stacks: [],
    NetworkUserAgent: '',
    WebAppManifest: null, // replaced by standard gatherer
    InstallabilityErrors: {errors: []}, // replaced by standard gatherer
    traces: {},
    devtoolsLogs: {},
  };
}

module.exports = {
  getBaseArtifacts,
};
