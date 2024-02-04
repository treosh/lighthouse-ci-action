/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {makeComputedArtifact} from './computed-artifact.js';
import {NetworkAnalyzer} from '../lib/dependency-graph/simulator/network-analyzer.js';
import {NetworkRecords} from './network-records.js';

class NetworkAnalysis {
  /**
   * @param {Array<LH.Artifacts.NetworkRequest>} records
   * @return {LH.Util.StrictOmit<LH.Artifacts.NetworkAnalysis, 'throughput'>}
   */
  static computeRTTAndServerResponseTime(records) {
    // First pass compute the estimated observed RTT to each origin's servers.
    /** @type {Map<string, number>} */
    const rttByOrigin = new Map();
    for (const [origin, summary] of NetworkAnalyzer.estimateRTTByOrigin(records).entries()) {
      rttByOrigin.set(origin, summary.min);
    }

    // We'll use the minimum RTT as the assumed connection latency since we care about how much addt'l
    // latency each origin introduces as Lantern will be simulating with its own connection latency.
    const minimumRtt = Math.min(...Array.from(rttByOrigin.values()));
    // We'll use the observed RTT information to help estimate the server response time
    const responseTimeSummaries = NetworkAnalyzer.estimateServerResponseTimeByOrigin(records, {
      rttByOrigin,
    });

    /** @type {Map<string, number>} */
    const additionalRttByOrigin = new Map();
    /** @type {Map<string, number>} */
    const serverResponseTimeByOrigin = new Map();
    for (const [origin, summary] of responseTimeSummaries.entries()) {
      // Not all origins have usable timing data, we'll default to using no additional latency.
      const rttForOrigin = rttByOrigin.get(origin) || minimumRtt;
      additionalRttByOrigin.set(origin, rttForOrigin - minimumRtt);
      serverResponseTimeByOrigin.set(origin, summary.median);
    }

    return {
      rtt: minimumRtt,
      additionalRttByOrigin,
      serverResponseTimeByOrigin,
    };
  }

  /**
   * @param {LH.DevtoolsLog} devtoolsLog
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.NetworkAnalysis>}
   */
  static async compute_(devtoolsLog, context) {
    const records = await NetworkRecords.request(devtoolsLog, context);
    const throughput = NetworkAnalyzer.estimateThroughput(records);
    const rttAndServerResponseTime = NetworkAnalysis.computeRTTAndServerResponseTime(records);
    return {throughput, ...rttAndServerResponseTime};
  }
}

const NetworkAnalysisComputed = makeComputedArtifact(NetworkAnalysis, null);
export {NetworkAnalysisComputed as NetworkAnalysis};
