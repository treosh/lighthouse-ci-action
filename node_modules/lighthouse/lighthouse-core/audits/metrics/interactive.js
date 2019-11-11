/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const i18n = require('../../lib/i18n/i18n.js');
const Interactive = require('../../computed/metrics/interactive.js');

const UIStrings = {
  /** The name of the metric that marks the time at which the page is fully loaded and is able to quickly respond to user input (clicks, taps, and keypresses feel responsive). Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
  title: 'Time to Interactive',
  /** Description of the Time to Interactive (TTI) metric, which evaluates when a page has completed its primary network activity and main thread work. This is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Time to interactive is the amount of time it takes for the page to become fully ' +
    'interactive. [Learn more](https://web.dev/interactive).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * @fileoverview This audit identifies the time the page is "consistently interactive".
 * Looks for the first period of at least 5 seconds after FMP where both CPU and network were quiet,
 * and returns the timestamp of the beginning of the CPU quiet period.
 * @see https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit#
 */
class InteractiveMetric extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'interactive',
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
      // see https://www.desmos.com/calculator/5xgy0pyrbp
      scorePODR: 2900,
      scoreMedian: 7300,
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const metricComputationData = {trace, devtoolsLog, settings: context.settings};
    const metricResult = await Interactive.request(metricComputationData, context);
    const timeInMs = metricResult.timing;
    const extendedInfo = {
      timeInMs,
      timestamp: metricResult.timestamp,
      // @ts-ignore - TODO(bckenny): make lantern metric/metric a discriminated union.
      optimistic: metricResult.optimisticEstimate && metricResult.optimisticEstimate.timeInMs,
      // @ts-ignore
      pessimistic: metricResult.pessimisticEstimate && metricResult.pessimisticEstimate.timeInMs,
    };

    return {
      score: Audit.computeLogNormalScore(
        timeInMs,
        context.options.scorePODR,
        context.options.scoreMedian
      ),
      numericValue: timeInMs,
      displayValue: str_(i18n.UIStrings.seconds, {timeInMs}),
      extendedInfo: {
        value: extendedInfo,
      },
    };
  }
}

module.exports = InteractiveMetric;
module.exports.UIStrings = UIStrings;
