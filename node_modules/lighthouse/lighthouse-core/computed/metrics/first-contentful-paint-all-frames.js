/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('../computed-artifact.js');
const NavigationMetric = require('./navigation-metric.js');

class FirstContentfulPaintAllFrames extends NavigationMetric {
  /**
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static computeSimulatedMetric() {
    // TODO: Add support for all frames in lantern.
    throw new Error('FCP All Frames not implemented in lantern');
  }

  /**
   * @param {LH.Artifacts.NavigationMetricComputationData} data
   * @return {Promise<LH.Artifacts.Metric>}
   */
  static async computeObservedMetric(data) {
    const {processedNavigation} = data;

    return {
      timing: processedNavigation.timings.firstContentfulPaintAllFrames,
      timestamp: processedNavigation.timestamps.firstContentfulPaintAllFrames,
    };
  }
}

module.exports = makeComputedArtifact(
  FirstContentfulPaintAllFrames,
  ['devtoolsLog', 'gatherContext', 'settings', 'simulator', 'trace']
);
