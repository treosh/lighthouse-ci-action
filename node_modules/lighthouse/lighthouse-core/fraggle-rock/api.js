/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Driver = require('./gather/driver.js');
const Runner = require('../runner.js');
const Config = require('../config/config.js');

/**
 * @param {LH.Gatherer.GathererInstance} gatherer
 * @return {gatherer is LH.Gatherer.FRGathererInstance}
 */
function isFRGatherer(gatherer) {
  // TODO(FR-COMPAT): use configuration on gatherer.meta to detect interface compatibility
  return gatherer.name === 'Accessibility';
}

/** @param {{page: import('puppeteer').Page, config?: LH.Config.Json}} options */
async function snapshot(options) {
  const config = new Config(options.config);
  const driver = new Driver(options.page);
  await driver.connect();

  const url = await options.page.url();

  return Runner.run(
    async () => {
      /** @type {LH.BaseArtifacts} */
      const baseArtifacts = {
        fetchTime: new Date().toJSON(),
        LighthouseRunWarnings: [],
        URL: {requestedUrl: url, finalUrl: url},
        Timing: [],
        Stacks: [],
        settings: config.settings,
        // TODO(FR-COMPAT): convert these to regular artifacts
        HostFormFactor: 'mobile',
        HostUserAgent: 'unknown',
        NetworkUserAgent: 'unknown',
        BenchmarkIndex: 0,
        InstallabilityErrors: {errors: []},
        traces: {},
        devtoolsLogs: {},
        WebAppManifest: null,
        PageLoadError: null,
      };

      const gatherers = (config.passes || [])
        .flatMap(pass => pass.gatherers);

      /** @type {Partial<LH.GathererArtifacts>} */
      const artifacts = {};

      for (const {instance} of gatherers) {
        // TODO(FR-COMPAT): use configuration on gatherer.meta to detect snapshot support
        if (!isFRGatherer(instance)) continue;

        /** @type {keyof LH.GathererArtifacts} */
        const artifactName = instance.name;
        const artifact = await Promise.resolve()
          .then(() => instance.afterPass({driver}))
          .catch(err => err);

        artifacts[artifactName] = artifact;
      }

      return /** @type {LH.Artifacts} */ ({...baseArtifacts, ...artifacts}); // Cast to drop Partial<>
    },
    {
      url,
      config,
    }
  );
}

module.exports = {
  snapshot,
};
