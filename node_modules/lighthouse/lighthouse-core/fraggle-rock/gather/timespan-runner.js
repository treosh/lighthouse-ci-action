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
const {prepareTargetForTimespanMode} = require('../../gather/driver/prepare.js');
const {initializeConfig} = require('../config/config.js');
const {getBaseArtifacts, finalizeArtifacts} = require('./base-artifacts.js');

/**
 * @param {{page: import('puppeteer').Page, config?: LH.Config.Json, configContext?: LH.Config.FRContext}} options
 * @return {Promise<{endTimespanGather(): Promise<LH.Gatherer.FRGatherResult>}>}
 */
async function startTimespanGather(options) {
  const {configContext = {}} = options;
  log.setLevel(configContext.logLevel || 'error');

  const {config} = initializeConfig(options.config, {...configContext, gatherMode: 'timespan'});
  const driver = new Driver(options.page);
  await driver.connect();

  /** @type {Map<string, LH.ArbitraryEqualityMap>} */
  const computedCache = new Map();
  const artifactDefinitions = config.artifacts || [];
  const requestedUrl = await driver.url();
  const baseArtifacts = await getBaseArtifacts(config, driver, {gatherMode: 'timespan'});
  const artifactState = getEmptyArtifactState();
  /** @type {Omit<import('./runner-helpers.js').CollectPhaseArtifactOptions, 'phase'>} */
  const phaseOptions = {
    url: requestedUrl,
    driver,
    artifactDefinitions,
    artifactState,
    baseArtifacts,
    computedCache,
    gatherMode: 'timespan',
    settings: config.settings,
  };

  await prepareTargetForTimespanMode(driver, config.settings);
  await collectPhaseArtifacts({phase: 'startInstrumentation', ...phaseOptions});
  await collectPhaseArtifacts({phase: 'startSensitiveInstrumentation', ...phaseOptions});

  return {
    async endTimespanGather() {
      const finalUrl = await driver.url();
      phaseOptions.url = finalUrl;

      const runnerOptions = {config, computedCache};
      const artifacts = await Runner.gather(
        async () => {
          baseArtifacts.URL.requestedUrl = requestedUrl;
          baseArtifacts.URL.finalUrl = finalUrl;

          await collectPhaseArtifacts({phase: 'stopSensitiveInstrumentation', ...phaseOptions});
          await collectPhaseArtifacts({phase: 'stopInstrumentation', ...phaseOptions});
          await collectPhaseArtifacts({phase: 'getArtifact', ...phaseOptions});
          await driver.disconnect();

          const artifacts = await awaitArtifacts(artifactState);
          return finalizeArtifacts(baseArtifacts, artifacts);
        },
        runnerOptions
      );
      return {artifacts, runnerOptions};
    },
  };
}

module.exports = {
  startTimespanGather,
};
