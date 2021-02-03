/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Computed Largest Contentful Paint (LCP) for all frames.
 */

const makeComputedArtifact = require('../computed-artifact.js');
const ComputedMetric = require('./metric.js');
const LHError = require('../../lib/lh-error.js');

class LargestContentfulPaintAllFrames extends ComputedMetric {
  /**
   * TODO: Simulate LCP all frames in lantern.
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static async computeSimulatedMetric() {
    throw new Error('LCP All Frames not implemented in lantern');
  }

  /**
   * @param {LH.Artifacts.MetricComputationData} data
   * @return {Promise<LH.Artifacts.Metric>}
   */
  static async computeObservedMetric(data) {
    const {traceOfTab} = data;
    if (traceOfTab.timings.largestContentfulPaintAllFrames === undefined) {
      throw new LHError(LHError.errors.NO_LCP_ALL_FRAMES);
    }

    return {
      timing: traceOfTab.timings.largestContentfulPaintAllFrames,
      timestamp: traceOfTab.timestamps.largestContentfulPaintAllFrames,
    };
  }
}

module.exports = makeComputedArtifact(LargestContentfulPaintAllFrames);
