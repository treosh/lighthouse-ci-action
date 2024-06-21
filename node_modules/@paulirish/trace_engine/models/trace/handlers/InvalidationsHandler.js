// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Types from '../types/types.js';
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
const invalidationsForEvent = new Map();
let lastRecalcStyleEvent = null;
// Used to track paints so we track invalidations correctly per paint.
let hasPainted = false;
const allInvalidationTrackingEvents = [];
export function reset() {
    handlerState = 1 /* HandlerState.UNINITIALIZED */;
    invalidationsForEvent.clear();
    lastRecalcStyleEvent = null;
    allInvalidationTrackingEvents.length = 0;
    hasPainted = false;
}
export function initialize() {
    if (handlerState !== 1 /* HandlerState.UNINITIALIZED */) {
        throw new Error('InvalidationsHandler was not reset before being initialized');
    }
    handlerState = 2 /* HandlerState.INITIALIZED */;
}
function addInvalidationToEvent(event, invalidation) {
    const existingInvalidations = invalidationsForEvent.get(event) || [];
    const syntheticInvalidation = {
        ...invalidation,
        name: 'SyntheticInvalidation',
        frame: invalidation.args.data.frame,
        nodeId: invalidation.args.data.nodeId,
        rawEvent: invalidation,
    };
    if (invalidation.args.data.nodeName) {
        syntheticInvalidation.nodeName = invalidation.args.data.nodeName;
    }
    if (invalidation.args.data.reason) {
        syntheticInvalidation.reason = invalidation.args.data.reason;
    }
    if (invalidation.args.data.stackTrace) {
        syntheticInvalidation.stackTrace = invalidation.args.data.stackTrace;
    }
    existingInvalidations.push(syntheticInvalidation);
    invalidationsForEvent.set(event, existingInvalidations);
}
export function handleEvent(event) {
    if (Types.TraceEvents.isTraceEventUpdateLayoutTree(event)) {
        lastRecalcStyleEvent = event;
        // Associate any prior invalidations with this recalc event.
        for (const invalidation of allInvalidationTrackingEvents) {
            if (Types.TraceEvents.isTraceEventLayoutInvalidationTracking(invalidation)) {
                // LayoutInvalidation events cannot be associated with a LayoutTree
                // event.
                continue;
            }
            const recalcFrameId = lastRecalcStyleEvent.args.beginData?.frame;
            if (recalcFrameId && invalidation.args.data.frame === recalcFrameId) {
                addInvalidationToEvent(event, invalidation);
            }
        }
        return;
    }
    if (Types.TraceEvents.isTraceEventScheduleStyleInvalidationTracking(event) ||
        Types.TraceEvents.isTraceEventStyleRecalcInvalidationTracking(event) ||
        Types.TraceEvents.isTraceEventStyleInvalidatorInvalidationTracking(event) ||
        Types.TraceEvents.isTraceEventLayoutInvalidationTracking(event)) {
        if (hasPainted) {
            // If we have painted, then we can clear out the list of all existing
            // invalidations, as we cannot associate them across frames.
            allInvalidationTrackingEvents.length = 0;
            lastRecalcStyleEvent = null;
            hasPainted = false;
        }
        // Style invalidation events can occur before and during recalc styles. When we get a recalc style event (aka TraceEventUpdateLayoutTree), we check and associate any prior invalidations with it.
        // But any invalidations that occur during a TraceEventUpdateLayoutTree
        // event would be reported in trace events after. So each time we get an
        // invalidation that might be due to a style recalc, we check if the
        // timings overlap and if so associate them.
        if (lastRecalcStyleEvent &&
            (Types.TraceEvents.isTraceEventScheduleStyleInvalidationTracking(event) ||
                Types.TraceEvents.isTraceEventStyleRecalcInvalidationTracking(event) ||
                Types.TraceEvents.isTraceEventStyleInvalidatorInvalidationTracking(event))) {
            const recalcEndTime = lastRecalcStyleEvent.ts + (lastRecalcStyleEvent.dur || 0);
            if (event.ts >= lastRecalcStyleEvent.ts && event.ts <= recalcEndTime &&
                lastRecalcStyleEvent.args.beginData?.frame === event.args.data.frame) {
                addInvalidationToEvent(lastRecalcStyleEvent, event);
            }
        }
        allInvalidationTrackingEvents.push(event);
        return;
    }
    if (Types.TraceEvents.isTraceEventPaint(event)) {
        // Used to ensure that we do not create relationships across frames.
        hasPainted = true;
        return;
    }
    if (Types.TraceEvents.isTraceEventLayout(event)) {
        const layoutFrame = event.args.beginData.frame;
        for (const invalidation of allInvalidationTrackingEvents) {
            // The only invalidations that cause a Layout are LayoutInvalidations :)
            if (!Types.TraceEvents.isTraceEventLayoutInvalidationTracking(invalidation)) {
                continue;
            }
            if (invalidation.args.data.frame === layoutFrame) {
                addInvalidationToEvent(event, invalidation);
            }
        }
    }
}
export async function finalize() {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('InvalidationsHandler is not initialized');
    }
    handlerState = 3 /* HandlerState.FINALIZED */;
}
export function data() {
    return {
        invalidationsForEvent,
    };
}
//# sourceMappingURL=InvalidationsHandler.js.map