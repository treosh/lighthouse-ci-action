/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const TracingProcessor = require('../../lib/tracehouse/trace-processor.js');
const ProcessedTrace = require('../processed-trace.js');
const ProcessedNavigation = require('../processed-navigation.js');
const NetworkRecords = require('../network-records.js');

/**
 * @fileOverview Encapsulates logic for choosing the correct metric computation method based on the
 * specified throttling settings, supporting simulated and observed metric types.
 *
 * To implement a fully supported metric:
 *     - Override the computeObservedMetric method with the observed-mode implementation.
 *     - Override the computeSimulatedMetric method with the simulated-mode implementation (which
 *       may call another computed artifact with the name LanternMyMetricName).
 */
class Metric {
  constructor() {}

  /**
   * Narrows the metric computation data to the input so child metric requests can be cached.
   *
   * @param {LH.Artifacts.MetricComputationData} data
   * @return {LH.Artifacts.MetricComputationDataInput}
   */
  static getMetricComputationInput(data) {
    return {
      trace: data.trace,
      devtoolsLog: data.devtoolsLog,
      gatherContext: data.gatherContext,
      settings: data.settings,
    };
  }

  /**
   * @param {LH.Artifacts.MetricComputationData} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static computeSimulatedMetric(data, context) { // eslint-disable-line no-unused-vars
    throw new Error('Unimplemented');
  }

  /**
   * @param {LH.Artifacts.MetricComputationData} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.Metric>}
   */
  static computeObservedMetric(data, context) { // eslint-disable-line no-unused-vars
    throw new Error('Unimplemented');
  }

  /**
   * @param {LH.Artifacts.MetricComputationDataInput} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.LanternMetric|LH.Artifacts.Metric>}
   */
  static async compute_(data, context) {
    // TODO: remove this fallback when lighthouse-pub-ads plugin can update.
    const gatherContext = data.gatherContext || {gatherMode: 'navigation'};
    const {trace, devtoolsLog, settings} = data;
    if (!trace || !devtoolsLog || !settings) {
      throw new Error('Did not provide necessary metric computation data');
    }

    const processedTrace = await ProcessedTrace.request(trace, context);
    const processedNavigation = gatherContext.gatherMode === 'timespan' ?
      undefined : await ProcessedNavigation.request(processedTrace, context);

    const augmentedData = Object.assign({
      networkRecords: await NetworkRecords.request(devtoolsLog, context),
      gatherContext,
      processedTrace,
      processedNavigation,
    }, data);

    TracingProcessor.assertHasToplevelEvents(augmentedData.processedTrace.mainThreadEvents);

    switch (settings.throttlingMethod) {
      case 'simulate':
        if (gatherContext.gatherMode !== 'navigation') {
          throw new Error(`${gatherContext.gatherMode} does not support throttlingMethod simulate`);
        }

        return this.computeSimulatedMetric(augmentedData, context);
      case 'provided':
      case 'devtools':
        return this.computeObservedMetric(augmentedData, context);
      default:
        throw new TypeError(`Unrecognized throttling method: ${settings.throttlingMethod}`);
    }
  }
}

module.exports = Metric;
