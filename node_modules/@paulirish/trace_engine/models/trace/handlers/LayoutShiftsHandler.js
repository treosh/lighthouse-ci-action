// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from '../../../core/platform/platform.js';
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
import { data as metaHandlerData } from './MetaHandler.js';
// This represents the maximum #time we will allow a cluster to go before we
// reset it.
export const MAX_CLUSTER_DURATION = Helpers.Timing.millisecondsToMicroseconds(Types.Timing.MilliSeconds(5000));
// This represents the maximum #time we will allow between layout shift events
// before considering it to be the start of a new cluster.
export const MAX_SHIFT_TIME_DELTA = Helpers.Timing.millisecondsToMicroseconds(Types.Timing.MilliSeconds(1000));
// Layout shifts are reported globally to the developer, irrespective of which
// frame they originated in. However, each process does have its own individual
// CLS score, so we need to segment by process. This means Layout Shifts from
// sites with one process (no subframes, or subframes from the same origin)
// will be reported together. In the case of multiple renderers (frames across
// different origins), we offer the developer the ability to switch renderer in
// the UI.
const layoutShiftEvents = [];
// These events denote potential node resizings. We store them to link captured
// layout shifts to the resizing of unsized elements.
const layoutInvalidationEvents = [];
const scheduleStyleInvalidationEvents = [];
const styleRecalcInvalidationEvents = [];
const backendNodeIds = new Set();
// Layout shifts happen during PrePaint as part of the rendering lifecycle.
// We determine if a LayoutInvalidation event is a potential root cause of a layout
// shift if the next PrePaint after the LayoutInvalidation is the parent
// node of such shift.
const prePaintEvents = [];
let sessionMaxScore = 0;
let clsWindowID = -1;
const clusters = [];
// The complete timeline of LS score changes in a trace.
// Includes drops to 0 when session windows end.
const scoreRecords = [];
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
export function initialize() {
    if (handlerState !== 1 /* HandlerState.UNINITIALIZED */) {
        throw new Error('LayoutShifts Handler was not reset');
    }
    handlerState = 2 /* HandlerState.INITIALIZED */;
}
export function reset() {
    handlerState = 1 /* HandlerState.UNINITIALIZED */;
    layoutShiftEvents.length = 0;
    layoutInvalidationEvents.length = 0;
    scheduleStyleInvalidationEvents.length = 0;
    styleRecalcInvalidationEvents.length = 0;
    prePaintEvents.length = 0;
    backendNodeIds.clear();
    clusters.length = 0;
    sessionMaxScore = 0;
    scoreRecords.length = 0;
    clsWindowID = -1;
}
export function handleEvent(event) {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('Handler is not initialized');
    }
    if (Types.TraceEvents.isTraceEventLayoutShift(event) && !event.args.data?.had_recent_input) {
        layoutShiftEvents.push(event);
        return;
    }
    if (Types.TraceEvents.isTraceEventLayoutInvalidationTracking(event)) {
        layoutInvalidationEvents.push(event);
        return;
    }
    if (Types.TraceEvents.isTraceEventScheduleStyleInvalidationTracking(event)) {
        scheduleStyleInvalidationEvents.push(event);
    }
    if (Types.TraceEvents.isTraceEventStyleRecalcInvalidationTracking(event)) {
        styleRecalcInvalidationEvents.push(event);
    }
    if (Types.TraceEvents.isTraceEventPrePaint(event)) {
        prePaintEvents.push(event);
        return;
    }
}
function traceWindowFromTime(time) {
    return {
        min: time,
        max: time,
        range: Types.Timing.MicroSeconds(0),
    };
}
function updateTraceWindowMax(traceWindow, newMax) {
    traceWindow.max = newMax;
    traceWindow.range = Types.Timing.MicroSeconds(traceWindow.max - traceWindow.min);
}
function buildScoreRecords() {
    const { traceBounds } = metaHandlerData();
    scoreRecords.push({ ts: traceBounds.min, score: 0 });
    for (const cluster of clusters) {
        let clusterScore = 0;
        if (cluster.events[0].args.data) {
            scoreRecords.push({ ts: cluster.clusterWindow.min, score: cluster.events[0].args.data.weighted_score_delta });
        }
        for (let i = 0; i < cluster.events.length; i++) {
            const event = cluster.events[i];
            if (!event.args.data) {
                continue;
            }
            clusterScore += event.args.data.weighted_score_delta;
            scoreRecords.push({ ts: event.ts, score: clusterScore });
        }
        scoreRecords.push({ ts: cluster.clusterWindow.max, score: 0 });
    }
}
/**
 * Collects backend node ids coming from LayoutShift and LayoutInvalidation
 * events.
 */
function collectNodes() {
    backendNodeIds.clear();
    // Collect the node ids present in the shifts.
    for (const layoutShift of layoutShiftEvents) {
        if (!layoutShift.args.data?.impacted_nodes) {
            continue;
        }
        for (const node of layoutShift.args.data.impacted_nodes) {
            backendNodeIds.add(node.node_id);
        }
    }
    // Collect the node ids present in LayoutInvalidation & scheduleStyleInvalidation events.
    for (const layoutInvalidation of layoutInvalidationEvents) {
        if (!layoutInvalidation.args.data?.nodeId) {
            continue;
        }
        backendNodeIds.add(layoutInvalidation.args.data.nodeId);
    }
    for (const scheduleStyleInvalidation of scheduleStyleInvalidationEvents) {
        if (!scheduleStyleInvalidation.args.data?.nodeId) {
            continue;
        }
        backendNodeIds.add(scheduleStyleInvalidation.args.data.nodeId);
    }
}
export async function finalize() {
    // Ensure the events are sorted by #time ascending.
    layoutShiftEvents.sort((a, b) => a.ts - b.ts);
    prePaintEvents.sort((a, b) => a.ts - b.ts);
    layoutInvalidationEvents.sort((a, b) => a.ts - b.ts);
    // Each function transforms the data used by the next, as such the invoke order
    // is important.
    await buildLayoutShiftsClusters();
    buildScoreRecords();
    collectNodes();
    handlerState = 3 /* HandlerState.FINALIZED */;
}
async function buildLayoutShiftsClusters() {
    const { navigationsByFrameId, mainFrameId, traceBounds } = metaHandlerData();
    const navigations = navigationsByFrameId.get(mainFrameId) || [];
    if (layoutShiftEvents.length === 0) {
        return;
    }
    let firstShiftTime = layoutShiftEvents[0].ts;
    let lastShiftTime = layoutShiftEvents[0].ts;
    let lastShiftNavigation = null;
    // Now step through each and create clusters.
    // A cluster is equivalent to a session window (see https://web.dev/cls/#what-is-cls).
    // To make the line chart clear, we explicitly demark the limits of each session window
    // by starting the cumulative score of the window at the time of the first layout shift
    // and ending it (dropping the line back to 0) when the window ends according to the
    // thresholds (MAX_CLUSTER_DURATION, MAX_SHIFT_TIME_DELTA).
    for (const event of layoutShiftEvents) {
        // First detect if either the cluster duration or the #time between this and
        // the last shift has been exceeded.
        const clusterDurationExceeded = event.ts - firstShiftTime > MAX_CLUSTER_DURATION;
        const maxTimeDeltaSinceLastShiftExceeded = event.ts - lastShiftTime > MAX_SHIFT_TIME_DELTA;
        // Next take a look at navigations. If between this and the last shift we have navigated,
        // note it.
        const currentShiftNavigation = Platform.ArrayUtilities.nearestIndexFromEnd(navigations, nav => nav.ts < event.ts);
        const hasNavigated = lastShiftNavigation !== currentShiftNavigation && currentShiftNavigation !== null;
        // If any of the above criteria are met or if we don't have any cluster yet we should
        // start a new one.
        if (clusterDurationExceeded || maxTimeDeltaSinceLastShiftExceeded || hasNavigated || !clusters.length) {
            // The cluster starts #time should be the timestamp of the first layout shift in it.
            const clusterStartTime = event.ts;
            // If the last session window ended because the max delta time between shifts
            // was exceeded set the endtime to MAX_SHIFT_TIME_DELTA microseconds after the
            // last shift in the session.
            const endTimeByMaxSessionDuration = clusterDurationExceeded ? firstShiftTime + MAX_CLUSTER_DURATION : Infinity;
            // If the last session window ended because the max session duration was
            // surpassed, set the endtime so that the window length = MAX_CLUSTER_DURATION;
            const endTimeByMaxShiftGap = maxTimeDeltaSinceLastShiftExceeded ? lastShiftTime + MAX_SHIFT_TIME_DELTA : Infinity;
            // If there was a navigation during the last window, close it at the time
            // of the navigation.
            const endTimeByNavigation = hasNavigated ? navigations[currentShiftNavigation].ts : Infinity;
            // End the previous cluster at the time of the first of the criteria above that was met.
            const previousClusterEndTime = Math.min(endTimeByMaxSessionDuration, endTimeByMaxShiftGap, endTimeByNavigation);
            // If there is an existing cluster update its closing time.
            if (clusters.length > 0) {
                const currentCluster = clusters[clusters.length - 1];
                updateTraceWindowMax(currentCluster.clusterWindow, Types.Timing.MicroSeconds(previousClusterEndTime));
            }
            clusters.push({
                events: [],
                clusterWindow: traceWindowFromTime(clusterStartTime),
                clusterCumulativeScore: 0,
                scoreWindows: {
                    good: traceWindowFromTime(clusterStartTime),
                    needsImprovement: null,
                    bad: null,
                },
            });
            firstShiftTime = clusterStartTime;
        }
        // Given the above we should have a cluster available, so pick the most
        // recent one and append the shift, bump its score and window values accordingly.
        const currentCluster = clusters[clusters.length - 1];
        const timeFromNavigation = currentShiftNavigation !== null ?
            Types.Timing.MicroSeconds(event.ts - navigations[currentShiftNavigation].ts) :
            undefined;
        currentCluster.clusterCumulativeScore += event.args.data ? event.args.data.weighted_score_delta : 0;
        if (!event.args.data) {
            continue;
        }
        const shift = {
            rawSourceEvent: event,
            ...event,
            args: {
                frame: event.args.frame,
                data: {
                    ...event.args.data,
                    rawEvent: event,
                },
            },
            parsedData: {
                timeFromNavigation,
                cumulativeWeightedScoreInWindow: currentCluster.clusterCumulativeScore,
                // The score of the session window is temporarily set to 0 just
                // to initialize it. Since we need to get the score of all shifts
                // in the session window to determine its value, its definite
                // value is set when stepping through the built clusters.
                sessionWindowData: { cumulativeWindowScore: 0, id: clusters.length },
            },
        };
        currentCluster.events.push(shift);
        updateTraceWindowMax(currentCluster.clusterWindow, event.ts);
        lastShiftTime = event.ts;
        lastShiftNavigation = currentShiftNavigation;
    }
    // Now step through each cluster and set up the times at which the value
    // goes from Good, to needs improvement, to Bad. Note that if there is a
    // large jump we may go from Good to Bad without ever creating a Needs
    // Improvement window at all.
    for (const cluster of clusters) {
        let weightedScore = 0;
        let windowID = -1;
        // If this is the last cluster update its window. The cluster duration is determined
        // by the minimum between: time to next navigation, trace end time, time to maximum
        // cluster duration and time to maximum gap between layout shifts.
        if (cluster === clusters[clusters.length - 1]) {
            const clusterEndByMaxDuration = MAX_CLUSTER_DURATION + cluster.clusterWindow.min;
            const clusterEndByMaxGap = cluster.clusterWindow.max + MAX_SHIFT_TIME_DELTA;
            const nextNavigationIndex = Platform.ArrayUtilities.nearestIndexFromBeginning(navigations, nav => nav.ts > cluster.clusterWindow.max);
            const nextNavigationTime = nextNavigationIndex ? navigations[nextNavigationIndex].ts : Infinity;
            const clusterEnd = Math.min(clusterEndByMaxDuration, clusterEndByMaxGap, traceBounds.max, nextNavigationTime);
            updateTraceWindowMax(cluster.clusterWindow, Types.Timing.MicroSeconds(clusterEnd));
        }
        for (const shift of cluster.events) {
            weightedScore += shift.args.data ? shift.args.data.weighted_score_delta : 0;
            windowID = shift.parsedData.sessionWindowData.id;
            const ts = shift.ts;
            // Update the the CLS score of this shift's session window now that
            // we have it.
            shift.parsedData.sessionWindowData.cumulativeWindowScore = cluster.clusterCumulativeScore;
            if (weightedScore < 0.1 /* LayoutShiftsThreshold.NEEDS_IMPROVEMENT */) {
                // Expand the Good window.
                updateTraceWindowMax(cluster.scoreWindows.good, ts);
            }
            else if (weightedScore >= 0.1 /* LayoutShiftsThreshold.NEEDS_IMPROVEMENT */ && weightedScore < 0.25 /* LayoutShiftsThreshold.BAD */) {
                if (!cluster.scoreWindows.needsImprovement) {
                    // Close the Good window, and open the needs improvement window.
                    updateTraceWindowMax(cluster.scoreWindows.good, Types.Timing.MicroSeconds(ts - 1));
                    cluster.scoreWindows.needsImprovement = traceWindowFromTime(ts);
                }
                // Expand the needs improvement window.
                updateTraceWindowMax(cluster.scoreWindows.needsImprovement, ts);
            }
            else if (weightedScore >= 0.25 /* LayoutShiftsThreshold.BAD */) {
                if (!cluster.scoreWindows.bad) {
                    // We may jump from Good to Bad here, so update whichever window is open.
                    if (cluster.scoreWindows.needsImprovement) {
                        updateTraceWindowMax(cluster.scoreWindows.needsImprovement, Types.Timing.MicroSeconds(ts - 1));
                    }
                    else {
                        updateTraceWindowMax(cluster.scoreWindows.good, Types.Timing.MicroSeconds(ts - 1));
                    }
                    cluster.scoreWindows.bad = traceWindowFromTime(shift.ts);
                }
                // Expand the Bad window.
                updateTraceWindowMax(cluster.scoreWindows.bad, ts);
            }
            // At this point the windows are set by the timestamps of the events, but the
            // next cluster begins at the timestamp of its first event. As such we now
            // need to expand the score window to the end of the cluster, and we do so
            // by using the Bad widow if it's there, or the NI window, or finally the
            // Good window.
            if (cluster.scoreWindows.bad) {
                updateTraceWindowMax(cluster.scoreWindows.bad, cluster.clusterWindow.max);
            }
            else if (cluster.scoreWindows.needsImprovement) {
                updateTraceWindowMax(cluster.scoreWindows.needsImprovement, cluster.clusterWindow.max);
            }
            else {
                updateTraceWindowMax(cluster.scoreWindows.good, cluster.clusterWindow.max);
            }
        }
        if (weightedScore > sessionMaxScore) {
            clsWindowID = windowID;
            sessionMaxScore = weightedScore;
        }
    }
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('Layout Shifts Handler is not finalized');
    }
    return {
        clusters,
        sessionMaxScore: sessionMaxScore,
        clsWindowID,
        prePaintEvents,
        layoutInvalidationEvents,
        scheduleStyleInvalidationEvents,
        styleRecalcInvalidationEvents: [],
        scoreRecords,
        // TODO(crbug/41484172): change the type so no need to clone
        backendNodeIds: [...backendNodeIds],
    };
}
export function deps() {
    return ['Screenshots', 'Meta'];
}
export function stateForLayoutShiftScore(score) {
    let state = "good" /* ScoreClassification.GOOD */;
    if (score >= 0.1 /* LayoutShiftsThreshold.NEEDS_IMPROVEMENT */) {
        state = "ok" /* ScoreClassification.OK */;
    }
    if (score >= 0.25 /* LayoutShiftsThreshold.BAD */) {
        state = "bad" /* ScoreClassification.BAD */;
    }
    return state;
}
//# sourceMappingURL=LayoutShiftsHandler.js.map