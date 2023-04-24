/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Computed Largest Contentful Paint (LCP) for all frames.
 */

import {makeComputedArtifact} from '../computed-artifact.js';
import {NavigationMetric} from './navigation-metric.js';
import {LighthouseError} from '../../lib/lh-error.js';

class LargestContentfulPaintAllFrames extends NavigationMetric {
  /**
   * TODO: Simulate LCP all frames in lantern.
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static async computeSimulatedMetric() {
    throw new Error('LCP All Frames not implemented in lantern');
  }

  /**
   * @param {LH.Artifacts.NavigationMetricComputationData} data
   * @return {Promise<LH.Artifacts.Metric>}
   */
  static async computeObservedMetric(data) {
    const {processedNavigation} = data;
    if (processedNavigation.timings.largestContentfulPaintAllFrames === undefined) {
      throw new LighthouseError(LighthouseError.errors.NO_LCP_ALL_FRAMES);
    }

    return {
      timing: processedNavigation.timings.largestContentfulPaintAllFrames,
      timestamp: processedNavigation.timestamps.largestContentfulPaintAllFrames,
    };
  }
}

const LargestContentfulPaintAllFramesComputed = makeComputedArtifact(
  LargestContentfulPaintAllFrames,
  ['devtoolsLog', 'gatherContext', 'settings', 'simulator', 'trace', 'URL']
);
export {LargestContentfulPaintAllFramesComputed as LargestContentfulPaintAllFrames};
