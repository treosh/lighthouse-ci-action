/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {makeComputedArtifact} from '../computed-artifact.js';
import {NavigationMetric} from './navigation-metric.js';
import {LighthouseError} from '../../lib/lh-error.js';
import {LanternFirstMeaningfulPaint} from './lantern-first-meaningful-paint.js';

class FirstMeaningfulPaint extends NavigationMetric {
  /**
   * @param {LH.Artifacts.NavigationMetricComputationData} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static computeSimulatedMetric(data, context) {
    const metricData = NavigationMetric.getMetricComputationInput(data);
    return LanternFirstMeaningfulPaint.request(metricData, context);
  }

  /**
   * @param {LH.Artifacts.NavigationMetricComputationData} data
   * @return {Promise<LH.Artifacts.Metric>}
   */
  static async computeObservedMetric(data) {
    const {processedNavigation} = data;
    if (processedNavigation.timings.firstMeaningfulPaint === undefined) {
      throw new LighthouseError(LighthouseError.errors.NO_FMP);
    }

    return {
      timing: processedNavigation.timings.firstMeaningfulPaint,
      timestamp: processedNavigation.timestamps.firstMeaningfulPaint,
    };
  }
}

const FirstMeaningfulPaintComputed = makeComputedArtifact(
  FirstMeaningfulPaint,
  ['devtoolsLog', 'gatherContext', 'settings', 'simulator', 'trace', 'URL']
);
export {FirstMeaningfulPaintComputed as FirstMeaningfulPaint};
