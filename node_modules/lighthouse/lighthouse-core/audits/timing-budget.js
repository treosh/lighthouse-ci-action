/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const TimingSummary = require('../computed/metrics/timing-summary.js');
const MainResource = require('../computed/main-resource.js');
const Budget = require('../config/budget.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a Lighthouse audit that compares how quickly the page loads against targets set by the user. Timing budgets are a type of performance budget. */
  title: 'Timing budget',
  /** Description of a Lighthouse audit where a user sets budgets for how quickly the page loads. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Set a timing budget to help you keep an eye on the performance of your site. Performant sites load fast and respond to user input events quickly. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/budgets).',
  /** Label for a column in a data table; entries will be the names of different timing metrics, e.g. "Time to Interactive", "First Contentful Paint", etc. */
  columnTimingMetric: 'Metric',
  /** Label for a column in a data table; entries will be the measured value of a particular timing metric. Most entries will have a unit of milliseconds, but units could be other things as well. */
  columnMeasurement: 'Measurement',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/** @typedef {{metric: LH.Budget.TimingMetric, label: LH.IcuMessage, measurement?: LH.Audit.Details.NumericValue|number, overBudget?: LH.Audit.Details.NumericValue|number}} BudgetItem */

class TimingBudget extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'timing-budget',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      requiredArtifacts: ['devtoolsLogs', 'traces', 'URL'],
    };
  }

  /**
   * @param {LH.Budget.TimingMetric} timingMetric
   * @return {LH.IcuMessage}
   */
  static getRowLabel(timingMetric) {
    /** @type {Record<LH.Budget.TimingMetric, string>} */
    const strMappings = {
      'first-contentful-paint': i18n.UIStrings.firstContentfulPaintMetric,
      'interactive': i18n.UIStrings.interactiveMetric,
      'first-meaningful-paint': i18n.UIStrings.firstMeaningfulPaintMetric,
      'max-potential-fid': i18n.UIStrings.maxPotentialFIDMetric,
      'total-blocking-time': i18n.UIStrings.totalBlockingTimeMetric,
      'speed-index': i18n.UIStrings.speedIndexMetric,
      'largest-contentful-paint': i18n.UIStrings.largestContentfulPaintMetric,
      'cumulative-layout-shift': i18n.UIStrings.cumulativeLayoutShiftMetric,
    };
    return str_(strMappings[timingMetric]);
  }

  /**
   * @param {LH.Budget.TimingMetric} timingMetric
   * @param {LH.Artifacts.TimingSummary} summary
   * @return {number|undefined}
   */
  static getMeasurement(timingMetric, summary) {
    /** @type {Record<LH.Budget.TimingMetric, number|undefined>} */
    const measurements = {
      'first-contentful-paint': summary.firstContentfulPaint,
      'interactive': summary.interactive,
      'first-meaningful-paint': summary.firstMeaningfulPaint,
      'max-potential-fid': summary.maxPotentialFID,
      'total-blocking-time': summary.totalBlockingTime,
      'speed-index': summary.speedIndex,
      'largest-contentful-paint': summary.largestContentfulPaint,
      'cumulative-layout-shift': summary.cumulativeLayoutShift,
    };
    return measurements[timingMetric];
  }

  /**
   * @param {Immutable<LH.Budget>} budget
   * @param {LH.Artifacts.TimingSummary} summary
   * @return {Array<BudgetItem>}
   */
  static tableItems(budget, summary) {
    /** @type {Array<BudgetItem>} */
    let items = [];
    if (!budget.timings) {
      return items;
    }

    items = budget.timings.map((timingBudget) => {
      const metricName = timingBudget.metric;
      const label = this.getRowLabel(metricName);
      const measurement = this.getMeasurement(metricName, summary);
      const overBudget = measurement && (measurement > timingBudget.budget)
        ? (measurement - timingBudget.budget) : undefined;
      return {
        metric: metricName,
        label,
        measurement,
        overBudget,
      };
    }).sort((a, b) => {
      return (b.overBudget || 0) - (a.overBudget || 0);
    });

    // CLS requires a different granularity and should be a numeric type.
    // Defining type here overrides the column setting so that it doesn't receive ms units.
    const clsItem = items.find(item => item.metric === 'cumulative-layout-shift');
    if (clsItem) {
      if (typeof clsItem.measurement === 'number') {
        clsItem.measurement = {
          type: 'numeric',
          value: Number(clsItem.measurement),
          granularity: 0.01,
        };
      }
      if (typeof clsItem.overBudget === 'number') {
        clsItem.overBudget = {
          type: 'numeric',
          value: Number(clsItem.overBudget),
          granularity: 0.01,
        };
      }
    }

    return items;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const mainResource = await MainResource.request({URL: artifacts.URL, devtoolsLog}, context);
    const data = {trace, devtoolsLog, settings: context.settings};
    const summary = (await TimingSummary.request(data, context)).metrics;
    const budget = Budget.getMatchingBudget(context.settings.budgets, mainResource.url);

    if (!budget) {
      return {
        score: 0,
        notApplicable: true,
      };
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headers = [
      {key: 'label', itemType: 'text', text: str_(UIStrings.columnTimingMetric)},
      /**
       * Note: SpeedIndex, unlike other timing metrics, is not measured in milliseconds.
       * The renderer applies the correct units to the 'measurement' and 'overBudget' columns for SpeedIndex.
       */
      {key: 'measurement', itemType: 'ms', text: str_(UIStrings.columnMeasurement)},
      {key: 'overBudget', itemType: 'ms', text: str_(i18n.UIStrings.columnOverBudget)},
    ];

    return {
      details: Audit.makeTableDetails(headers, this.tableItems(budget, summary)),
      score: 1,
    };
  }
}

module.exports = TimingBudget;
module.exports.UIStrings = UIStrings;
