/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const linearInterpolation = require('../../lib/statistics.js').linearInterpolation;
const Interactive = require('../../computed/metrics/lantern-interactive.js');
const i18n = require('../../lib/i18n/i18n.js');
const NetworkRecords = require('../../computed/network-records.js');
const LoadSimulator = require('../../computed/load-simulator.js');
const PageDependencyGraph = require('../../computed/page-dependency-graph.js');

const str_ = i18n.createMessageInstanceIdFn(__filename, {});

/** @typedef {import('../../lib/dependency-graph/simulator/simulator')} Simulator */
/** @typedef {import('../../lib/dependency-graph/base-node.js').Node} Node */

const WASTED_MS_FOR_AVERAGE = 300;
const WASTED_MS_FOR_POOR = 750;
const WASTED_MS_FOR_SCORE_OF_ZERO = 5000;

/**
 * @typedef {object} ByteEfficiencyProduct
 * @property {Array<LH.Audit.ByteEfficiencyItem>} items
 * @property {Map<string, number>=} wastedBytesByUrl
 * @property {LH.Audit.Details.Opportunity['headings']} headings
 * @property {LH.IcuMessage} [displayValue]
 * @property {LH.IcuMessage} [explanation]
 * @property {Array<string | LH.IcuMessage>} [warnings]
 */

/**
 * @overview Used as the base for all byte efficiency audits. Computes total bytes
 *    and estimated time saved. Subclass and override `audit_` to return results.
 */
class UnusedBytes extends Audit {
  /**
   * Creates a score based on the wastedMs value using linear interpolation between control points.
   *
   * @param {number} wastedMs
   * @return {number}
   */
  static scoreForWastedMs(wastedMs) {
    if (wastedMs === 0) {
      return 1;
    } else if (wastedMs < WASTED_MS_FOR_AVERAGE) {
      return linearInterpolation(0, 1, WASTED_MS_FOR_AVERAGE, 0.75, wastedMs);
    } else if (wastedMs < WASTED_MS_FOR_POOR) {
      return linearInterpolation(WASTED_MS_FOR_AVERAGE, 0.75, WASTED_MS_FOR_POOR, 0.5, wastedMs);
    } else {
      return Math.max(
        0,
        linearInterpolation(WASTED_MS_FOR_POOR, 0.5, WASTED_MS_FOR_SCORE_OF_ZERO, 0, wastedMs)
      );
    }
  }

  /**
   * Estimates the number of bytes this network record would have consumed on the network based on the
   * uncompressed size (totalBytes). Uses the actual transfer size from the network record if applicable.
   *
   * @param {LH.Artifacts.NetworkRequest|undefined} networkRecord
   * @param {number} totalBytes Uncompressed size of the resource
   * @param {LH.Crdp.Network.ResourceType=} resourceType
   * @return {number}
   */
  static estimateTransferSize(networkRecord, totalBytes, resourceType) {
    if (!networkRecord) {
      // We don't know how many bytes this asset used on the network, but we can guess it was
      // roughly the size of the content gzipped.
      // See https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer for specific CSS/Script examples
      // See https://discuss.httparchive.org/t/file-size-and-compression-savings/145 for fallback multipliers
      switch (resourceType) {
        case 'Stylesheet':
          // Stylesheets tend to compress extremely well.
          return Math.round(totalBytes * 0.2);
        case 'Script':
        case 'Document':
          // Scripts and HTML compress fairly well too.
          return Math.round(totalBytes * 0.33);
        default:
          // Otherwise we'll just fallback to the average savings in HTTPArchive
          return Math.round(totalBytes * 0.5);
      }
    } else if (networkRecord.resourceType === resourceType) {
      // This was a regular standalone asset, just use the transfer size.
      return networkRecord.transferSize || 0;
    } else {
      // This was an asset that was inlined in a different resource type (e.g. HTML document).
      // Use the compression ratio of the resource to estimate the total transferred bytes.
      const transferSize = networkRecord.transferSize || 0;
      const resourceSize = networkRecord.resourceSize || 0;
      // Get the compression ratio, if it's an invalid number, assume no compression.
      const compressionRatio = Number.isFinite(resourceSize) && resourceSize > 0 ?
        (transferSize / resourceSize) : 1;
      return Math.round(totalBytes * compressionRatio);
    }
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const gatherContext = artifacts.GatherContext;
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const settings = context?.settings || {};
    const simulatorOptions = {
      devtoolsLog,
      settings,
    };
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    const hasContentfulRecords = networkRecords.some(record => record.transferSize);

    // Requesting load simulator requires non-empty network records.
    // Timespans are not guaranteed to have any network activity.
    // There are no bytes to be saved if no bytes were downloaded, so mark N/A if empty.
    if (!hasContentfulRecords && gatherContext.gatherMode === 'timespan') {
      return {
        score: 1,
        notApplicable: true,
      };
    }

    const [result, graph, simulator] = await Promise.all([
      this.audit_(artifacts, networkRecords, context),
      // Page dependency graph is only used in navigation mode.
      gatherContext.gatherMode === 'navigation' ?
        PageDependencyGraph.request({trace, devtoolsLog}, context) :
        null,
      LoadSimulator.request(simulatorOptions, context),
    ]);

    return this.createAuditProduct(result, graph, simulator, gatherContext);
  }

  /**
   * Computes the estimated effect of all the byte savings on the maximum of the following:
   *
   * - end time of the last long task in the provided graph
   * - (if includeLoad is true or not provided) end time of the last node in the graph
   *
   * @param {Array<LH.Audit.ByteEfficiencyItem>} results The array of byte savings results per resource
   * @param {Node} graph
   * @param {Simulator} simulator
   * @param {{includeLoad?: boolean, label?: string, providedWastedBytesByUrl?: Map<string, number>}=} options
   * @return {number}
   */
  static computeWasteWithTTIGraph(results, graph, simulator, options) {
    options = Object.assign({includeLoad: true, label: this.meta.id}, options);
    const beforeLabel = `${options.label}-before`;
    const afterLabel = `${options.label}-after`;

    const simulationBeforeChanges = simulator.simulate(graph, {label: beforeLabel});

    const wastedBytesByUrl = options.providedWastedBytesByUrl || new Map();
    if (!options.providedWastedBytesByUrl) {
      for (const {url, wastedBytes} of results) {
        wastedBytesByUrl.set(url, (wastedBytesByUrl.get(url) || 0) + wastedBytes);
      }
    }

    // Update all the transfer sizes to reflect implementing our recommendations
    /** @type {Map<string, number>} */
    const originalTransferSizes = new Map();
    graph.traverse(node => {
      if (node.type !== 'network') return;
      const wastedBytes = wastedBytesByUrl.get(node.record.url);
      if (!wastedBytes) return;

      const original = node.record.transferSize;
      originalTransferSizes.set(node.record.requestId, original);

      node.record.transferSize = Math.max(original - wastedBytes, 0);
    });

    const simulationAfterChanges = simulator.simulate(graph, {label: afterLabel});

    // Restore the original transfer size after we've done our simulation
    graph.traverse(node => {
      if (node.type !== 'network') return;
      const originalTransferSize = originalTransferSizes.get(node.record.requestId);
      if (originalTransferSize === undefined) return;
      node.record.transferSize = originalTransferSize;
    });

    const savingsOnOverallLoad = simulationBeforeChanges.timeInMs - simulationAfterChanges.timeInMs;
    const savingsOnTTI = Interactive.getLastLongTaskEndTime(simulationBeforeChanges.nodeTimings) -
      Interactive.getLastLongTaskEndTime(simulationAfterChanges.nodeTimings);

    let savings = savingsOnTTI;
    if (options.includeLoad) savings = Math.max(savings, savingsOnOverallLoad);

    // Round waste to nearest 10ms
    return Math.round(Math.max(savings, 0) / 10) * 10;
  }

  /**
   * @param {ByteEfficiencyProduct} result
   * @param {Node|null} graph
   * @param {Simulator} simulator
   * @param {LH.Artifacts['GatherContext']} gatherContext
   * @return {LH.Audit.Product}
   */
  static createAuditProduct(result, graph, simulator, gatherContext) {
    const results = result.items.sort((itemA, itemB) => itemB.wastedBytes - itemA.wastedBytes);

    const wastedBytes = results.reduce((sum, item) => sum + item.wastedBytes, 0);

    let wastedMs;
    if (gatherContext.gatherMode === 'navigation') {
      if (!graph) throw Error('Page dependency graph should always be computed in navigation mode');
      wastedMs = this.computeWasteWithTTIGraph(results, graph, simulator, {
        providedWastedBytesByUrl: result.wastedBytesByUrl,
      });
    } else {
      wastedMs = simulator.computeWastedMsFromWastedBytes(wastedBytes);
    }

    let displayValue = result.displayValue || '';
    if (typeof result.displayValue === 'undefined' && wastedBytes) {
      displayValue = str_(i18n.UIStrings.displayValueByteSavings, {wastedBytes});
    }

    const details = Audit.makeOpportunityDetails(result.headings, results, wastedMs, wastedBytes);

    return {
      explanation: result.explanation,
      warnings: result.warnings,
      displayValue,
      numericValue: wastedMs,
      numericUnit: 'millisecond',
      score: UnusedBytes.scoreForWastedMs(wastedMs),
      details,
    };
  }

  /* eslint-disable no-unused-vars */

  /**
   * @param {LH.Artifacts} artifacts
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @param {LH.Audit.Context} context
   * @return {ByteEfficiencyProduct|Promise<ByteEfficiencyProduct>}
   */
  static audit_(artifacts, networkRecords, context) {
    throw new Error('audit_ unimplemented');
  }

  /* eslint-enable no-unused-vars */
}

module.exports = UnusedBytes;
