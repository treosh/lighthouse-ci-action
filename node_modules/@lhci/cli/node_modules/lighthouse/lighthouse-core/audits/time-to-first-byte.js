/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');
const MainResource = require('../computed/main-resource.js');

const UIStrings = {
  /** Title of a diagnostic audit that provides detail on how long it took from starting a request to when the server started responding. This descriptive title is shown to users when the amount is acceptable and no user action is required. */
  title: 'Server response times are low (TTFB)',
  /** Title of a diagnostic audit that provides detail on how long it took from starting a request to when the server started responding. This imperative title is shown to users when there is a significant amount of execution time that could be reduced. */
  failureTitle: 'Reduce server response times (TTFB)',
  /** Description of a Lighthouse audit that tells the user *why* they should reduce the amount of time it takes their server to start responding to requests. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Time To First Byte identifies the time at which your server sends a response.' +
    ' [Learn more](https://web.dev/time-to-first-byte).',
  /** Used to summarize the total Time to First Byte duration for the primary HTML response. The `{timeInMs}` placeholder will be replaced with the time duration, shown in milliseconds (e.g. 210 ms) */
  displayValue: `Root document took {timeInMs, number, milliseconds}\xa0ms`,
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

const TTFB_THRESHOLD = 600;

class TTFBMetric extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'time-to-first-byte',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['devtoolsLogs', 'URL'],
    };
  }

  /**
   * @param {LH.Artifacts.NetworkRequest} record
   */
  static caclulateTTFB(record) {
    const timing = record.timing;
    return timing ? timing.receiveHeadersEnd - timing.sendEnd : 0;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const mainResource = await MainResource.request({devtoolsLog, URL: artifacts.URL}, context);

    const ttfb = TTFBMetric.caclulateTTFB(mainResource);
    const passed = ttfb < TTFB_THRESHOLD;
    const displayValue = str_(UIStrings.displayValue, {timeInMs: ttfb});

    /** @type {LH.Audit.Details.Opportunity} */
    const details = {
      type: 'opportunity',
      overallSavingsMs: ttfb - TTFB_THRESHOLD,
      headings: [],
      items: [],
    };

    return {
      numericValue: ttfb,
      score: Number(passed),
      displayValue,
      details,
      extendedInfo: {
        value: {
          wastedMs: ttfb - TTFB_THRESHOLD,
        },
      },
    };
  }
}

module.exports = TTFBMetric;
module.exports.UIStrings = UIStrings;
