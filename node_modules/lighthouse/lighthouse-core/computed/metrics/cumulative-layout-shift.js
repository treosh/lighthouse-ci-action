/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('../computed-artifact.js');
const ProcessedTrace = require('../processed-trace.js');
const LHError = require('../../lib/lh-error.js');

/** @typedef {{ts: number, isMainFrame: boolean, weightedScore: number}} LayoutShiftEvent */

class CumulativeLayoutShift {
  /**
   * Returns all LayoutShift events that had no recent input.
   * Only a `weightedScore` per event is returned. For non-main-frame events, this is
   * the only score that matters. For main-frame events, `weighted_score_delta === score`.
   * @see https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/layout/layout_shift_tracker.cc;l=492-495;drc=de3b3a8a8839269c6b44403fa38a13a1ed12fed5
   * @param {LH.TraceEvent[]} traceEvents
   * @return {Array<LayoutShiftEvent>}
   */
  static getLayoutShiftEvents(traceEvents) {
    const layoutShiftEvents = [];

    // Chromium will set `had_recent_input` if there was recent user input, which
    // skips shift events from contributing to CLS. This flag is also set when
    // Lighthouse changes the emulation size. This results in the first few shift
    // events having `had_recent_input` set, so ignore it for those events.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1094974.
    let ignoreHadRecentInput = true;

    for (const event of traceEvents) {
      if (event.name !== 'LayoutShift' ||
          !event.args.data ||
          event.args.data.is_main_frame === undefined) {
        continue;
      }

      // For all-frames CLS calculation, we rely on `weighted_score_delta`, which
      // was added in Chrome 90: https://crbug.com/1173139
      if (event.args.data.weighted_score_delta === undefined) {
        throw new LHError(
          LHError.errors.UNSUPPORTED_OLD_CHROME,
          {featureName: 'Cumulative Layout Shift'}
        );
      }

      if (event.args.data.had_recent_input) {
        // `had_recent_input` events aren't used unless currently ignoring.
        if (!ignoreHadRecentInput) continue;
      } else {
        // After a false `had_recent_input`, stop ignoring property.
        ignoreHadRecentInput = false;
      }

      layoutShiftEvents.push({
        ts: event.ts,
        isMainFrame: event.args.data.is_main_frame,
        weightedScore: event.args.data.weighted_score_delta,
      });
    }

    return layoutShiftEvents;
  }

  /**
   * Calculates cumulative layout shifts per cluster (session) of LayoutShift
   * events -- where a new cluster is created when there's a gap of more than
   * 1000ms since the last LayoutShift event or the cluster is greater than
   * 5000ms long -- and returns the max LayoutShift score found.
   * @param {Array<LayoutShiftEvent>} layoutShiftEvents
   * @return {number}
   */
  static calculate(layoutShiftEvents) {
    const gapMicroseconds = 1_000_000;
    const limitMicroseconds = 5_000_000;
    let maxScore = 0;
    let currentClusterScore = 0;
    let firstTs = Number.NEGATIVE_INFINITY;
    let prevTs = Number.NEGATIVE_INFINITY;

    for (const event of layoutShiftEvents) {
      if (event.ts - firstTs > limitMicroseconds || event.ts - prevTs > gapMicroseconds) {
        firstTs = event.ts;
        currentClusterScore = 0;
      }
      prevTs = event.ts;
      currentClusterScore += event.weightedScore;
      maxScore = Math.max(maxScore, currentClusterScore);
    }

    return maxScore;
  }

  /**
   * Sum all layout shift events from the entire trace.
   * @param {Array<LayoutShiftEvent>} layoutShiftEvents
   * @return {number}
   */
  static calculateTotalCumulativeLayoutShift(layoutShiftEvents) {
    return layoutShiftEvents.reduce((sum, e) => sum += e.weightedScore, 0);
  }

  /**
   * @param {LH.Trace} trace
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<{cumulativeLayoutShift: number, cumulativeLayoutShiftMainFrame: number, totalCumulativeLayoutShift: number}>}
   */
  static async compute_(trace, context) {
    const processedTrace = await ProcessedTrace.request(trace, context);

    const allFrameShiftEvents =
        CumulativeLayoutShift.getLayoutShiftEvents(processedTrace.frameTreeEvents);
    const mainFrameShiftEvents = allFrameShiftEvents.filter(e => e.isMainFrame);

    // The original Cumulative Layout Shift metric, the sum of all main-frame shift events.
    const totalCumulativeLayoutShift =
        CumulativeLayoutShift.calculateTotalCumulativeLayoutShift(mainFrameShiftEvents);

    return {
      cumulativeLayoutShift: CumulativeLayoutShift.calculate(allFrameShiftEvents),
      cumulativeLayoutShiftMainFrame: CumulativeLayoutShift.calculate(mainFrameShiftEvents),
      totalCumulativeLayoutShift,
    };
  }
}

module.exports = makeComputedArtifact(CumulativeLayoutShift, null);
