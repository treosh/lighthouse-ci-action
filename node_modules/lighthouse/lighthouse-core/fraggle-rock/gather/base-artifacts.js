/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const isEqual = require('lodash.isequal');
const {
  getBrowserVersion,
  getBenchmarkIndex,
  getEnvironmentWarnings,
} = require('../../gather/driver/environment.js');

/**
 * @param {LH.Config.FRConfig} config
 * @param {LH.Gatherer.FRTransitionalDriver} driver
 * @param {{gatherMode: LH.Gatherer.GatherMode}} context
 * @return {Promise<LH.BaseArtifacts>}
 */
async function getBaseArtifacts(config, driver, context) {
  const BenchmarkIndex = await getBenchmarkIndex(driver.executionContext);
  const {userAgent} = await getBrowserVersion(driver.defaultSession);

  return {
    // Meta artifacts.
    fetchTime: new Date().toJSON(),
    Timing: [],
    LighthouseRunWarnings: [],
    settings: config.settings,
    // Environment artifacts that can always be computed.
    BenchmarkIndex,
    HostUserAgent: userAgent,
    HostFormFactor: userAgent.includes('Android') || userAgent.includes('Mobile') ?
      'mobile' : 'desktop',
    // Contextual artifacts whose collection changes based on gather mode.
    URL: {requestedUrl: '', finalUrl: ''},
    PageLoadError: null,
    GatherContext: context,
    // Artifacts that have been replaced by regular gatherers in Fraggle Rock.
    Stacks: [],
    NetworkUserAgent: '',
    WebAppManifest: null,
    InstallabilityErrors: {errors: []},
    traces: {},
    devtoolsLogs: {},
  };
}

/**
 * Deduplicates identical warnings.
 * @param {Array<string | LH.IcuMessage>} warnings
 * @return {Array<string | LH.IcuMessage>}
 */
function deduplicateWarnings(warnings) {
  /** @type {Array<string | LH.IcuMessage>} */
  const unique = [];

  for (const warning of warnings) {
    if (unique.some(existing => isEqual(warning, existing))) continue;
    unique.push(warning);
  }

  return unique;
}

/**
 * @param {LH.FRBaseArtifacts} baseArtifacts
 * @param {Partial<LH.Artifacts>} gathererArtifacts
 * @return {LH.Artifacts}
 */
function finalizeArtifacts(baseArtifacts, gathererArtifacts) {
  const warnings = baseArtifacts.LighthouseRunWarnings
    .concat(gathererArtifacts.LighthouseRunWarnings || [])
    .concat(getEnvironmentWarnings({settings: baseArtifacts.settings, baseArtifacts}));

  // Cast to remove the partial from gathererArtifacts.
  const artifacts = /** @type {LH.Artifacts} */ ({...baseArtifacts, ...gathererArtifacts});

  // Set the post-run meta artifacts.
  artifacts.Timing = log.getTimeEntries();
  artifacts.LighthouseRunWarnings = deduplicateWarnings(warnings);

  if (artifacts.PageLoadError && !artifacts.URL.finalUrl) {
    artifacts.URL.finalUrl = artifacts.URL.requestedUrl;
  }

  // Check that the runner remembered to mutate the special-case URL artifact.
  if (!artifacts.URL.requestedUrl) throw new Error('Runner did not set requestedUrl');
  if (!artifacts.URL.finalUrl) throw new Error('Runner did not set finalUrl');

  return artifacts;
}

module.exports = {
  getBaseArtifacts,
  finalizeArtifacts,
};
