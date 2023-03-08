/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const URL = require('../lib/url-shim.js');
const NetworkRecords = require('../computed/network-records.js');
const MainResource = require('../computed/main-resource.js');

class NetworkRequests extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'network-requests',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: 'Network Requests',
      description: 'Lists the network requests that were made during page load.',
      requiredArtifacts: ['devtoolsLogs', 'URL', 'GatherContext'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const records = await NetworkRecords.request(devtoolsLog, context);
    const earliestMainThreadStartTime = records.reduce(
      (min, record) => Math.min(min, record.rendererStartTime),
      Infinity
    );

    // Optional mainFrameId check because the main resource is only available for
    // navigations. TODO: https://github.com/GoogleChrome/lighthouse/issues/14157
    // for the general solution to this.
    /** @type {string|undefined} */
    let mainFrameId;
    if (artifacts.GatherContext.gatherMode === 'navigation') {
      const mainResource = await MainResource.request({devtoolsLog, URL: artifacts.URL}, context);
      mainFrameId = mainResource.frameId;
    }

    /** @param {number} time */
    const timeToMs = time => time < earliestMainThreadStartTime || !Number.isFinite(time) ?
      undefined : (time - earliestMainThreadStartTime) * 1000;

    const results = records.map(record => {
      const endTimeDeltaMs = record.lrStatistics?.endTimeDeltaMs;
      const TCPMs = record.lrStatistics?.TCPMs;
      const requestMs = record.lrStatistics?.requestMs;
      const responseMs = record.lrStatistics?.responseMs;
      // Default these to undefined so omitted from JSON in the negative case.
      const isLinkPreload = record.isLinkPreload || undefined;
      const experimentalFromMainFrame = mainFrameId ?
        ((record.frameId === mainFrameId) || undefined) :
        undefined;

      return {
        url: URL.elideDataURI(record.url),
        protocol: record.protocol,
        rendererStartTime: timeToMs(record.rendererStartTime),
        startTime: timeToMs(record.startTime),
        endTime: timeToMs(record.endTime),
        finished: record.finished,
        transferSize: record.transferSize,
        resourceSize: record.resourceSize,
        statusCode: record.statusCode,
        mimeType: record.mimeType,
        resourceType: record.resourceType,
        priority: record.priority,
        isLinkPreload,
        experimentalFromMainFrame,
        lrEndTimeDeltaMs: endTimeDeltaMs, // Only exists on Lightrider runs
        lrTCPMs: TCPMs, // Only exists on Lightrider runs
        lrRequestMs: requestMs, // Only exists on Lightrider runs
        lrResponseMs: responseMs, // Only exists on Lightrider runs
      };
    });

    // NOTE(i18n): this audit is only for debug info in the LHR and does not appear in the report.
    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'url', itemType: 'url', text: 'URL'},
      {key: 'protocol', itemType: 'text', text: 'Protocol'},
      {key: 'startTime', itemType: 'ms', granularity: 1, text: 'Start Time'},
      {key: 'endTime', itemType: 'ms', granularity: 1, text: 'End Time'},
      {
        key: 'transferSize',
        itemType: 'bytes',
        displayUnit: 'kb',
        granularity: 1,
        text: 'Transfer Size',
      },
      {
        key: 'resourceSize',
        itemType: 'bytes',
        displayUnit: 'kb',
        granularity: 1,
        text: 'Resource Size',
      },
      {key: 'statusCode', itemType: 'text', text: 'Status Code'},
      {key: 'mimeType', itemType: 'text', text: 'MIME Type'},
      {key: 'resourceType', itemType: 'text', text: 'Resource Type'},
    ];

    const tableDetails = Audit.makeTableDetails(headings, results);

    // Include starting timestamp to allow syncing requests with navStart/metric timestamps.
    const networkStartTimeTs = Number.isFinite(earliestMainThreadStartTime) ?
        earliestMainThreadStartTime * 1_000_000 : undefined;
    tableDetails.debugData = {
      type: 'debugdata',
      networkStartTimeTs,
    };

    return {
      score: 1,
      details: tableDetails,
    };
  }
}

module.exports = NetworkRequests;
