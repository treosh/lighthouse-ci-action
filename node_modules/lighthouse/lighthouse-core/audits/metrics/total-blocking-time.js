/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const ComputedTBT = require('../../computed/metrics/total-blocking-time.js');
const i18n = require('../../lib/i18n/i18n.js');

const UIStrings = {
  /** The name of a metric that calculates the total duration of blocking time for a web page. Blocking times are time periods when the page would be blocked (prevented) from responding to user input (clicks, taps, and keypresses will feel slow to respond). Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
  title: 'Total Blocking Time',
  /** Description of the Total Blocking Time (TBT) metric, which calculates the total duration of blocking time for a web page. Blocking times are time periods when the page would be blocked (prevented) from responding to user input (clicks, taps, and keypresses will feel slow to respond). This is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits.*/
  description: 'Sum of all time periods between FCP and Time to Interactive, ' +
      'when task length exceeded 50ms, expressed in milliseconds.',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class TotalBlockingTime extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'total-blocking-time',
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
      // According to a cluster telemetry run over top 10k sites on mobile, 5th percentile was 0ms,
      // 25th percentile was 270ms and median was 895ms. These numbers include 404 pages. Picking
      // thresholds according to our 25/75-th rule will be quite harsh scoring (a single 350ms task)
      // after FCP will yield a score of .5. The following coefficients are semi-arbitrarily picked
      // to give 600ms jank a score of .5 and 100ms jank a score of .999. We can tweak these numbers
      // in the future. See https://www.desmos.com/calculator/a7ib75kq3g
      scoreMedian: 600,
      scorePODR: 200,
    };
  }

  /**
   * Audits the page to calculate Total Blocking Time.
   *
   * We define Blocking Time as any time interval in the loading timeline where task length exceeds
   * 50ms. For example, if there is a 110ms main thread task, the last 60ms of it is blocking time.
   * Total Blocking Time is the sum of all Blocking Time between First Contentful Paint and
   * Interactive Time (TTI).
   *
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const metricComputationData = {trace, devtoolsLog, settings: context.settings};
    const metricResult = await ComputedTBT.request(metricComputationData, context);

    return {
      score: Audit.computeLogNormalScore(
        metricResult.timing,
        context.options.scorePODR,
        context.options.scoreMedian
      ),
      numericValue: metricResult.timing,
      displayValue: str_(i18n.UIStrings.ms, {timeInMs: metricResult.timing}),
    };
  }
}

module.exports = TotalBlockingTime;
module.exports.UIStrings = UIStrings;
