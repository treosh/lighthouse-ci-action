/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const i18n = require('../../lib/i18n/i18n.js');
const ComputedFci = require('../../computed/metrics/first-cpu-idle.js');

const UIStrings = {
  /** The name of the metric that marks when the page has displayed content and the CPU is not busy executing the page's scripts. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
  title: 'First CPU Idle',
  /** Description of the First CPU Idle metric, which marks the time at which the page has displayed content and the CPU is not busy executing the page's scripts. This is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'First CPU Idle marks the first time at which the page\'s main thread is ' +
    'quiet enough to handle input.  [Learn more](https://web.dev/first-cpu-idle).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class FirstCPUIdle extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'first-cpu-idle',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      requiredArtifacts: ['traces', 'devtoolsLogs'],
    };
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      // 75th and 95th percentiles HTTPArchive -> median and PODR
      // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
      // see https://www.desmos.com/calculator/yv89gz2nwf
      scorePODR: 2900,
      scoreMedian: 6500,
    };
  }

  /**
   * Identify the time the page is "first interactive"
   * @see https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit#
   *
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const metricComputationData = {trace, devtoolsLog, settings: context.settings};
    const metricResult = await ComputedFci.request(metricComputationData, context);

    return {
      score: Audit.computeLogNormalScore(
        metricResult.timing,
        context.options.scorePODR,
        context.options.scoreMedian
      ),
      numericValue: metricResult.timing,
      displayValue: str_(i18n.UIStrings.seconds, {timeInMs: metricResult.timing}),
    };
  }
}

module.exports = FirstCPUIdle;
module.exports.UIStrings = UIStrings;
