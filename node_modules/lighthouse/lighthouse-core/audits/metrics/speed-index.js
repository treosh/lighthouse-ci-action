/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const i18n = require('../../lib/i18n/i18n.js');
const ComputedSi = require('../../computed/metrics/speed-index.js');

const UIStrings = {
  /** The name of the metric that summarizes how quickly the page looked visually complete. The name of this metric is largely abstract and can be loosely translated. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
  title: 'Speed Index',
  /** Description of the Speed Index metric, which summarizes how quickly the page looked visually complete. This is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Speed Index shows how quickly the contents of a page are visibly populated. ' +
      '[Learn more](https://web.dev/speed-index).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class SpeedIndex extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'speed-index',
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
      // see https://www.desmos.com/calculator/orvoyu9ygq
      scorePODR: 2900,
      scoreMedian: 5800,
    };
  }

  /**
   * Audits the page to give a score for the Speed Index.
   * @see https://github.com/GoogleChrome/lighthouse/issues/197
   * @param {LH.Artifacts} artifacts The artifacts from the gather phase.
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const metricComputationData = {trace, devtoolsLog, settings: context.settings};
    const metricResult = await ComputedSi.request(metricComputationData, context);

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

module.exports = SpeedIndex;
module.exports.UIStrings = UIStrings;
