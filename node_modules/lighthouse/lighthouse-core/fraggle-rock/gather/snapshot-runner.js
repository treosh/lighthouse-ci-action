/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
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
const {initializeConfig} = require('../config/config.js');
const {getBaseArtifacts, finalizeArtifacts} = require('./base-artifacts.js');

/**
 * @param {{page: import('puppeteer').Page, config?: LH.Config.Json, configContext?: LH.Config.FRContext}} options
 * @return {Promise<LH.Gatherer.FRGatherResult>}
 */
async function snapshotGather(options) {
  const {configContext = {}} = options;
  log.setLevel(configContext.logLevel || 'error');

  const {config} = initializeConfig(options.config, {...configContext, gatherMode: 'snapshot'});
  const driver = new Driver(options.page);
  await driver.connect();

  /** @type {Map<string, LH.ArbitraryEqualityMap>} */
  const computedCache = new Map();
  const url = await driver.url();

  const runnerOptions = {config, computedCache};
  const artifacts = await Runner.gather(
    async () => {
      const baseArtifacts = await getBaseArtifacts(config, driver, {gatherMode: 'snapshot'});
      baseArtifacts.URL.requestedUrl = url;
      baseArtifacts.URL.finalUrl = url;

      const artifactDefinitions = config.artifacts || [];
      const artifactState = getEmptyArtifactState();
      await collectPhaseArtifacts({
        url,
        phase: 'getArtifact',
        gatherMode: 'snapshot',
        driver,
        baseArtifacts,
        artifactDefinitions,
        artifactState,
        computedCache,
        settings: config.settings,
      });

      await driver.disconnect();

      const artifacts = await awaitArtifacts(artifactState);
      return finalizeArtifacts(baseArtifacts, artifacts);
    },
    runnerOptions
  );
  return {artifacts, runnerOptions};
}

module.exports = {
  snapshotGather,
};
