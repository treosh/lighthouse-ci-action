/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const UnusedBytes = require('./byte-efficiency/byte-efficiency-audit.js');
const i18n = require('../lib/i18n/i18n.js');
const ProcessedTrace = require('../computed/processed-trace.js');
const NetworkRecords = require('../computed/network-records.js');
const MainResource = require('../computed/main-resource.js');
const LanternInteractive = require('../computed/metrics/lantern-interactive.js');

const UIStrings = {
  /** Imperative title of a Lighthouse audit that tells the user to eliminate the redirects taken through multiple URLs to load the page. This is shown in a list of audits that Lighthouse generates. */
  title: 'Avoid multiple page redirects',
  /** Description of a Lighthouse audit that tells users why they should reduce the number of server-side redirects on their page. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Redirects introduce additional delays before the page can be loaded. [Learn more](https://web.dev/redirects/).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class Redirects extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'redirects',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      supportedModes: ['navigation'],
      requiredArtifacts: ['URL', 'GatherContext', 'devtoolsLogs', 'traces'],
    };
  }

  /**
   * This method generates the document request chain including client-side and server-side redirects.
   *
   * Example:
   *    GET /initialUrl => 302 /firstRedirect
   *    GET /firstRedirect => 200 /firstRedirect, window.location = '/secondRedirect'
   *    GET /secondRedirect => 302 /finalUrl
   *    GET /finalUrl => 200 /finalUrl
   *
   * Returns network records [/initialUrl, /firstRedirect, /secondRedirect, /thirdRedirect, /finalUrl]
   *
   * @param {LH.Artifacts.NetworkRequest} mainResource
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @param {LH.Artifacts.ProcessedTrace} processedTrace
   * @return {Array<LH.Artifacts.NetworkRequest>}
   */
  static getDocumentRequestChain(mainResource, networkRecords, processedTrace) {
    /** @type {Array<LH.Artifacts.NetworkRequest>} */
    const documentRequests = [];

    // Find all the document requests by examining navigation events and their redirects
    for (const event of processedTrace.processEvents) {
      if (event.name !== 'navigationStart') continue;

      const data = event.args.data || {};
      if (!data.documentLoaderURL || !data.isLoadingMainFrame) continue;

      let networkRecord = networkRecords.find(record => record.url === data.documentLoaderURL);
      while (networkRecord) {
        documentRequests.push(networkRecord);
        networkRecord = networkRecord.redirectDestination;
      }
    }

    // If we found documents in the trace, just use this directly.
    if (documentRequests.length) return documentRequests;

    // Use the main resource as a backup if we didn't find any modern navigationStart events
    return (mainResource.redirects || []).concat(mainResource);
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const settings = context.settings;
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const gatherContext = artifacts.GatherContext;

    const processedTrace = await ProcessedTrace.request(trace, context);
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    const mainResource = await MainResource.request({URL: artifacts.URL, devtoolsLog}, context);

    const metricComputationData = {trace, devtoolsLog, gatherContext, settings};
    const metricResult = await LanternInteractive.request(metricComputationData, context);

    /** @type {Map<string, LH.Gatherer.Simulation.NodeTiming>} */
    const nodeTimingsByUrl = new Map();
    for (const [node, timing] of metricResult.pessimisticEstimate.nodeTimings.entries()) {
      if (node.type === 'network') {
        nodeTimingsByUrl.set(node.record.url, timing);
      }
    }

    const documentRequests = Redirects.getDocumentRequestChain(
      mainResource, networkRecords, processedTrace);

    let totalWastedMs = 0;
    const tableRows = [];

    // Iterate through all the document requests and report how much time was wasted until the
    // next document request was issued. The final document request will have a `wastedMs` of 0.
    for (let i = 0; i < documentRequests.length; i++) {
      // If we didn't have enough documents for at least 1 redirect, just skip this loop.
      if (documentRequests.length < 2) break;

      const initialRequest = documentRequests[i];
      const redirectedRequest = documentRequests[i + 1] || initialRequest;

      const initialTiming = nodeTimingsByUrl.get(initialRequest.url);
      const redirectedTiming = nodeTimingsByUrl.get(redirectedRequest.url);
      if (!initialTiming || !redirectedTiming) {
        throw new Error('Could not find redirects in graph');
      }

      const lanternTimingDeltaMs = redirectedTiming.startTime - initialTiming.startTime;
      const observedTimingDeltaS = redirectedRequest.startTime - initialRequest.startTime;
      const wastedMs = settings.throttlingMethod === 'simulate' ?
        lanternTimingDeltaMs : observedTimingDeltaS * 1000;
      totalWastedMs += wastedMs;

      tableRows.push({
        url: initialRequest.url,
        wastedMs,
      });
    }

    /** @type {LH.Audit.Details.Opportunity['headings']} */
    const headings = [
      {key: 'url', valueType: 'url', label: str_(i18n.UIStrings.columnURL)},
      {key: 'wastedMs', valueType: 'timespanMs', label: str_(i18n.UIStrings.columnTimeSpent)},
    ];
    const details = Audit.makeOpportunityDetails(headings, tableRows, totalWastedMs);

    return {
      // We award a passing grade if you only have 1 redirect
      // TODO(phulce): reconsider if cases like the example in https://github.com/GoogleChrome/lighthouse/issues/8984
      // should fail this audit.
      score: documentRequests.length <= 2 ? 1 : UnusedBytes.scoreForWastedMs(totalWastedMs),
      numericValue: totalWastedMs,
      numericUnit: 'millisecond',
      displayValue: totalWastedMs ?
        str_(i18n.UIStrings.displayValueMsSavings, {wastedMs: totalWastedMs}) :
        '',
      details,
    };
  }
}

module.exports = Redirects;
module.exports.UIStrings = UIStrings;
