/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
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
