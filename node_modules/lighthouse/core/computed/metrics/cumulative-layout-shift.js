/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {makeComputedArtifact} from '../computed-artifact.js';
import {ProcessedTrace} from '../processed-trace.js';
import * as RectHelpers from '../../lib/rect-helpers.js';

/** @typedef {{ts: number, isMainFrame: boolean, weightedScore: number, impactedNodes?: LH.Artifacts.TraceImpactedNode[]}} LayoutShiftEvent */

const RECENT_INPUT_WINDOW = 500;

class CumulativeLayoutShift {
  /**
   * Returns all LayoutShift events that had no recent input.
   * Only a `weightedScore` per event is returned. For non-main-frame events, this is
   * the only score that matters. For main-frame events, `weighted_score_delta === score`.
   * @see https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/layout/layout_shift_tracker.cc;l=492-495;drc=de3b3a8a8839269c6b44403fa38a13a1ed12fed5
   * @param {LH.Artifacts.ProcessedTrace} processedTrace
   * @return {Array<LayoutShiftEvent>}
   */
  static getLayoutShiftEvents(processedTrace) {
    const layoutShiftEvents = [];

    // Chromium will set `had_recent_input` if there was recent user input, which
    // skips shift events from contributing to CLS. This flag is also set when
    // Lighthouse changes the emulation size. This results in the first few shift
    // events having `had_recent_input` set, so ignore it for those events.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1094974.
    let mustRespectHadRecentInput = false;

    // Even if emulation was applied before navigating, Chrome will issue a viewport
    // change event after a navigation starts which is treated as an interaction when
    // deciding the `had_recent_input` flag. Anything within 500ms of this event should
    // always be counted for CLS regardless of the `had_recent_input` flag.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1302667
    let viewportChangeTs = processedTrace.timestamps.timeOrigin;
    const firstViewportEvent = processedTrace.frameEvents.find(event => event.name === 'viewport');
    if (firstViewportEvent) {
      viewportChangeTs = firstViewportEvent.ts;
    }

    for (const event of processedTrace.frameTreeEvents) {
      if (event.name !== 'LayoutShift' ||
          !event.args.data ||
          event.args.data.is_main_frame === undefined) {
        continue;
      }

      // For all-frames CLS calculation, we rely on `weighted_score_delta`
      // All layout shift events should have this since M90: https://crbug.com/1173139
      if (event.args.data.weighted_score_delta === undefined) {
        throw new Error('CLS missing weighted_score_delta');
      }

      if (event.args.data.had_recent_input) {
        const timing = (event.ts - viewportChangeTs) / 1000;
        if (timing > RECENT_INPUT_WINDOW || mustRespectHadRecentInput) continue;
      } else {
        mustRespectHadRecentInput = true;
      }

      layoutShiftEvents.push({
        ts: event.ts,
        isMainFrame: event.args.data.is_main_frame,
        weightedScore: event.args.data.weighted_score_delta,
        impactedNodes: event.args.data.impacted_nodes,
      });
    }

    return layoutShiftEvents;
  }

  /**
   * Each layout shift event has a 'score' which is the amount added to the CLS as a result of the given shift(s).
   * We calculate the score per element by taking the 'score' of each layout shift event and
   * distributing it between all the nodes that were shifted, proportianal to the impact region of
   * each shifted element.
   *
   * @param {LayoutShiftEvent[]} layoutShiftEvents
   * @return {Map<number, number>}
   */
  static getImpactByNodeId(layoutShiftEvents) {
    /** @type {Map<number, number>} */
    const impactByNodeId = new Map();

    for (const event of layoutShiftEvents) {
      if (!event.impactedNodes) continue;

      let totalAreaOfImpact = 0;
      /** @type {Map<number, number>} */
      const pixelsMovedPerNode = new Map();

      for (const node of event.impactedNodes) {
        if (!node.node_id || !node.old_rect || !node.new_rect) continue;

        const oldRect = RectHelpers.traceRectToLHRect(node.old_rect);
        const newRect = RectHelpers.traceRectToLHRect(node.new_rect);
        const areaOfImpact = RectHelpers.getRectArea(oldRect) +
          RectHelpers.getRectArea(newRect) -
          RectHelpers.getRectOverlapArea(oldRect, newRect);

        pixelsMovedPerNode.set(node.node_id, areaOfImpact);
        totalAreaOfImpact += areaOfImpact;
      }

      for (const [nodeId, pixelsMoved] of pixelsMovedPerNode.entries()) {
        let clsContribution = impactByNodeId.get(nodeId) || 0;
        clsContribution += (pixelsMoved / totalAreaOfImpact) * event.weightedScore;
        impactByNodeId.set(nodeId, clsContribution);
      }
    }

    return impactByNodeId;
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
   * @param {LH.Trace} trace
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<{cumulativeLayoutShift: number, cumulativeLayoutShiftMainFrame: number, impactByNodeId: Map<number, number>}>}
   */
  static async compute_(trace, context) {
    const processedTrace = await ProcessedTrace.request(trace, context);

    const allFrameShiftEvents =
        CumulativeLayoutShift.getLayoutShiftEvents(processedTrace);
    const impactByNodeId = CumulativeLayoutShift.getImpactByNodeId(allFrameShiftEvents);
    const mainFrameShiftEvents = allFrameShiftEvents.filter(e => e.isMainFrame);

    return {
      cumulativeLayoutShift: CumulativeLayoutShift.calculate(allFrameShiftEvents),
      cumulativeLayoutShiftMainFrame: CumulativeLayoutShift.calculate(mainFrameShiftEvents),
      impactByNodeId,
    };
  }
}

const CumulativeLayoutShiftComputed = makeComputedArtifact(CumulativeLayoutShift, null);
export {CumulativeLayoutShiftComputed as CumulativeLayoutShift};
