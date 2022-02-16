/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const BootupTime = require('./bootup-time.js');
const i18n = require('../lib/i18n/i18n.js');
const thirdPartyWeb = require('../lib/third-party-web.js');
const NetworkRecords = require('../computed/network-records.js');
const MainThreadTasks = require('../computed/main-thread-tasks.js');

const UIStrings = {
  /** Title of a diagnostic audit that provides details about the code on a web page that the user doesn't control (referred to as "third-party code"). This descriptive title is shown to users when the amount is acceptable and no user action is required. */
  title: 'Minimize third-party usage',
  /** Title of a diagnostic audit that provides details about the code on a web page that the user doesn't control (referred to as "third-party code"). This imperative title is shown to users when there is a significant amount of page execution time caused by third-party code that should be reduced. */
  failureTitle: 'Reduce the impact of third-party code',
  /** Description of a Lighthouse audit that identifies the code on the page that the user doesn't control. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Third-party code can significantly impact load performance. ' +
    'Limit the number of redundant third-party providers and try to load third-party code after ' +
    'your page has primarily finished loading. [Learn more](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/).',
  /** Label for a table column that displays the name of a third-party provider that potentially links to their website. */
  columnThirdParty: 'Third-Party',
  /** Summary text for the result of a Lighthouse audit that identifies the code on a web page that the user doesn't control (referred to as "third-party code"). This text summarizes the number of distinct entities that were found on the page. */
  displayValue: 'Third-party code blocked the main thread for ' +
    `{timeInMs, number, milliseconds}\xa0ms`,
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

// A page passes when all third-party code blocks for less than 250 ms.
const PASS_THRESHOLD_IN_MS = 250;

/** @typedef {import("third-party-web").IEntity} ThirdPartyEntity */

/**
 * @typedef Summary
 * @property {number} mainThreadTime
 * @property {number} transferSize
 * @property {number} blockingTime
 */

/**
 * @typedef URLSummary
 * @property {number} transferSize
 * @property {number} blockingTime
 * @property {string | LH.IcuMessage} url
 */

/** @typedef SummaryMaps
 * @property {Map<ThirdPartyEntity, Summary>} byEntity Map of impact summaries for each entity.
 * @property {Map<string, Summary>} byURL Map of impact summaries for each URL.
 * @property {Map<ThirdPartyEntity, string[]>} urls Map of URLs under each entity.
 */

/**
 * Don't bother showing resources smaller than 4KiB since they're likely to be pixels, which isn't
 * too actionable.
 */
const MIN_TRANSFER_SIZE_FOR_SUBITEMS = 4096;

/** Show at most 5 sub items in the resource breakdown. */
const MAX_SUBITEMS = 5;

class ThirdPartySummary extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'third-party-summary',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['traces', 'devtoolsLogs', 'URL'],
    };
  }

  /**
   *
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @param {Array<LH.Artifacts.TaskNode>} mainThreadTasks
   * @param {number} cpuMultiplier
   * @return {SummaryMaps}
   */
  static getSummaries(networkRecords, mainThreadTasks, cpuMultiplier) {
    /** @type {Map<string, Summary>} */
    const byURL = new Map();
    /** @type {Map<ThirdPartyEntity, Summary>} */
    const byEntity = new Map();
    const defaultSummary = {mainThreadTime: 0, blockingTime: 0, transferSize: 0};

    for (const request of networkRecords) {
      const urlSummary = byURL.get(request.url) || {...defaultSummary};
      urlSummary.transferSize += request.transferSize;
      byURL.set(request.url, urlSummary);
    }

    const jsURLs = BootupTime.getJavaScriptURLs(networkRecords);

    for (const task of mainThreadTasks) {
      const attributableURL = BootupTime.getAttributableURLForTask(task, jsURLs);

      const urlSummary = byURL.get(attributableURL) || {...defaultSummary};
      const taskDuration = task.selfTime * cpuMultiplier;
      // The amount of time spent on main thread is the sum of all durations.
      urlSummary.mainThreadTime += taskDuration;
      // The amount of time spent *blocking* on main thread is the sum of all time longer than 50ms.
      // Note that this is not totally equivalent to the TBT definition since it fails to account for FCP,
      // but a majority of third-party work occurs after FCP and should yield largely similar numbers.
      urlSummary.blockingTime += Math.max(taskDuration - 50, 0);
      byURL.set(attributableURL, urlSummary);
    }

    // Map each URL's stat to a particular third party entity.
    /** @type {Map<ThirdPartyEntity, string[]>} */
    const urls = new Map();
    for (const [url, urlSummary] of byURL.entries()) {
      const entity = thirdPartyWeb.getEntity(url);
      if (!entity) {
        byURL.delete(url);
        continue;
      }

      const entitySummary = byEntity.get(entity) || {...defaultSummary};
      entitySummary.transferSize += urlSummary.transferSize;
      entitySummary.mainThreadTime += urlSummary.mainThreadTime;
      entitySummary.blockingTime += urlSummary.blockingTime;
      byEntity.set(entity, entitySummary);

      const entityURLs = urls.get(entity) || [];
      entityURLs.push(url);
      urls.set(entity, entityURLs);
    }

    return {byURL, byEntity, urls};
  }

  /**
   * @param {ThirdPartyEntity} entity
   * @param {SummaryMaps} summaries
   * @param {Summary} stats
   * @return {Array<URLSummary>}
   */
  static makeSubItems(entity, summaries, stats) {
    const entityURLs = summaries.urls.get(entity) || [];
    let items = entityURLs
      .map(url => /** @type {URLSummary} */ ({url, ...summaries.byURL.get(url)}))
      // Filter out any cases where byURL was missing entries.
      .filter((stat) => stat.transferSize > 0)
      // Sort by blocking time first, then transfer size to break ties.
      .sort((a, b) => (b.blockingTime - a.blockingTime) || (b.transferSize - a.transferSize));

    const subitemSummary = {transferSize: 0, blockingTime: 0};
    const minTransferSize = Math.max(MIN_TRANSFER_SIZE_FOR_SUBITEMS, stats.transferSize / 20);
    const maxSubItems = Math.min(MAX_SUBITEMS, items.length);
    let numSubItems = 0;
    while (numSubItems < maxSubItems) {
      const nextSubItem = items[numSubItems];
      if (nextSubItem.blockingTime === 0 && nextSubItem.transferSize < minTransferSize) {
        // Don't include the resource in the sub-item breakdown because it didn't have a big
        // enough impact on its own.
        break;
      }

      numSubItems++;
      subitemSummary.transferSize += nextSubItem.transferSize;
      subitemSummary.blockingTime += nextSubItem.blockingTime;
    }
    if (!subitemSummary.blockingTime && !subitemSummary.transferSize) {
      // Don't bother breaking down if there are no large resources.
      return [];
    }
    // Only show the top N entries for brevity. If there is more than one remaining entry
    // we'll replace the tail entries with single remainder entry.
    items = items.slice(0, numSubItems);
    const remainder = {
      url: str_(i18n.UIStrings.otherResourcesLabel),
      transferSize: stats.transferSize - subitemSummary.transferSize,
      blockingTime: stats.blockingTime - subitemSummary.blockingTime,
    };
    if (remainder.transferSize > minTransferSize) {
      items.push(remainder);
    }
    return items;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const settings = context.settings || {};
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    const mainEntity = thirdPartyWeb.getEntity(artifacts.URL.finalUrl);
    const tasks = await MainThreadTasks.request(trace, context);
    const multiplier = settings.throttlingMethod === 'simulate' ?
      settings.throttling.cpuSlowdownMultiplier : 1;

    const summaries = ThirdPartySummary.getSummaries(networkRecords, tasks, multiplier);
    const overallSummary = {wastedBytes: 0, wastedMs: 0};

    const results = Array.from(summaries.byEntity.entries())
      // Don't consider the page we're on to be third-party.
      // e.g. Facebook SDK isn't a third-party script on facebook.com
      .filter(([entity]) => !(mainEntity && mainEntity.name === entity.name))
      .map(([entity, stats]) => {
        overallSummary.wastedBytes += stats.transferSize;
        overallSummary.wastedMs += stats.blockingTime;

        return {
          ...stats,
          entity: {
            type: /** @type {const} */ ('link'),
            text: entity.name,
            url: entity.homepage || '',
          },
          subItems: {
            type: /** @type {const} */ ('subitems'),
            items: ThirdPartySummary.makeSubItems(entity, summaries, stats),
          },
        };
      })
      // Sort by blocking time first, then transfer size to break ties.
      .sort((a, b) => (b.blockingTime - a.blockingTime) || (b.transferSize - a.transferSize));

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      /* eslint-disable max-len */
      {key: 'entity', itemType: 'link', text: str_(UIStrings.columnThirdParty), subItemsHeading: {key: 'url', itemType: 'url'}},
      {key: 'transferSize', granularity: 1, itemType: 'bytes', text: str_(i18n.UIStrings.columnTransferSize), subItemsHeading: {key: 'transferSize'}},
      {key: 'blockingTime', granularity: 1, itemType: 'ms', text: str_(i18n.UIStrings.columnBlockingTime), subItemsHeading: {key: 'blockingTime'}},
      /* eslint-enable max-len */
    ];

    if (!results.length) {
      return {
        score: 1,
        notApplicable: true,
      };
    }

    return {
      score: Number(overallSummary.wastedMs <= PASS_THRESHOLD_IN_MS),
      displayValue: str_(UIStrings.displayValue, {
        timeInMs: overallSummary.wastedMs,
      }),
      details: Audit.makeTableDetails(headings, results, overallSummary),
    };
  }
}

module.exports = ThirdPartySummary;
module.exports.UIStrings = UIStrings;
