/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Driver = require('./driver.js');
const Runner = require('../../runner.js');
const {
  getEmptyArtifactState,
  collectPhaseArtifacts,
  awaitArtifacts,
} = require('./runner-helpers.js');
const {initializeConfig} = require('../config/config.js');
const {getBaseArtifacts} = require('./base-artifacts.js');

/**
 * @param {{page: import('puppeteer').Page, config?: LH.Config.Json}} options
 * @return {Promise<{endTimespan(): Promise<LH.RunnerResult|undefined>}>}
 */
async function startTimespan(options) {
  const {config} = initializeConfig(options.config, {gatherMode: 'timespan'});
  const driver = new Driver(options.page);
  await driver.connect();

  /** @type {Map<string, LH.ArbitraryEqualityMap>} */
  const computedCache = new Map();
  const artifactDefinitions = config.artifacts || [];
  const requestedUrl = await options.page.url();
  const artifactState = getEmptyArtifactState();
  /** @type {Omit<import('./runner-helpers.js').CollectPhaseArtifactOptions, 'phase'>} */
  const phaseOptions = {
    driver,
    artifactDefinitions,
    artifactState,
    computedCache,
    gatherMode: 'timespan',
    settings: config.settings,
  };

  await collectPhaseArtifacts({phase: 'startInstrumentation', ...phaseOptions});
  await collectPhaseArtifacts({phase: 'startSensitiveInstrumentation', ...phaseOptions});

  return {
    async endTimespan() {
      const finalUrl = await options.page.url();
      return Runner.run(
        async () => {
          const baseArtifacts = await getBaseArtifacts(config, driver);
          baseArtifacts.URL.requestedUrl = requestedUrl;
          baseArtifacts.URL.finalUrl = finalUrl;

          await collectPhaseArtifacts({phase: 'stopSensitiveInstrumentation', ...phaseOptions});
          await collectPhaseArtifacts({phase: 'stopInstrumentation', ...phaseOptions});
          await collectPhaseArtifacts({phase: 'getArtifact', ...phaseOptions});

          const artifacts = await awaitArtifacts(artifactState);
          return /** @type {LH.Artifacts} */ ({...baseArtifacts, ...artifacts}); // Cast to drop Partial<>
        },
        {
          url: finalUrl,
          config,
          computedCache,
        }
      );
    },
  };
}

module.exports = {
  startTimespan,
};
