// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
import { data as userTimingsData } from './UserTimingsHandler.js';
const extensionFlameChartEntries = [];
const extensionTrackData = [];
const extensionMarkers = [];
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
export function handleEvent(_event) {
    // Implementation not needed because data is sourced from UserTimingsHandler
}
export function reset() {
    handlerState = 2 /* HandlerState.INITIALIZED */;
    extensionFlameChartEntries.length = 0;
    extensionTrackData.length = 0;
    extensionMarkers.length = 0;
}
export async function finalize() {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('ExtensionTraceData handler is not initialized');
    }
    createExtensionFlameChartEntries();
    handlerState = 3 /* HandlerState.FINALIZED */;
}
function createExtensionFlameChartEntries() {
    const pairedMeasures = userTimingsData().performanceMeasures;
    const marks = userTimingsData().performanceMarks;
    const mergedRawExtensionEvents = Helpers.Trace.mergeEventsInOrder(pairedMeasures, marks);
    extractExtensionEntries(mergedRawExtensionEvents);
    Helpers.Extensions.buildTrackDataFromExtensionEntries(extensionFlameChartEntries, extensionTrackData);
}
export function extractExtensionEntries(timings) {
    for (const timing of timings) {
        const extensionPayload = extensionDataInTiming(timing);
        if (!extensionPayload) {
            // Not an extension user timing.
            continue;
        }
        const extensionName = extensionPayload.metadata.extensionName;
        if (!extensionName) {
            continue;
        }
        const extensionSyntheticEntry = {
            name: timing.name,
            ph: "X" /* Types.TraceEvents.Phase.COMPLETE */,
            pid: Types.TraceEvents.ProcessID(0),
            tid: Types.TraceEvents.ThreadID(0),
            ts: timing.ts,
            selfTime: Types.Timing.MicroSeconds(0),
            dur: timing.dur,
            cat: 'devtools.extension',
            args: extensionPayload,
        };
        if (Types.Extensions.isExtensionPayloadMarker(extensionPayload)) {
            extensionMarkers.push(extensionSyntheticEntry);
            continue;
        }
        if (Types.Extensions.isExtensionPayloadFlameChartEntry(extensionPayload)) {
            extensionFlameChartEntries.push(extensionSyntheticEntry);
            continue;
        }
    }
}
export function extensionDataInTiming(timing) {
    const timingDetail = Types.TraceEvents.isTraceEventPerformanceMark(timing) ? timing.args.data?.detail :
        timing.args.data.beginEvent.args.detail;
    if (!timingDetail) {
        return null;
    }
    try {
        // Attempt to parse the detail as an object that might be coming from a
        // DevTools Perf extension.
        // Wrapped in a try-catch because timingDetail might either:
        // 1. Not be `json.parse`-able (it should, but just in case...)
        // 2.Not be an object - in which case the `in` check will error.
        // If we hit either of these cases, we just ignore this mark and move on.
        const detailObj = JSON.parse(timingDetail);
        if (!('devtools' in detailObj)) {
            return null;
        }
        if (!('metadata' in detailObj['devtools'])) {
            return null;
        }
        return detailObj.devtools;
    }
    catch (e) {
        // No need to worry about this error, just discard this event and don't
        // treat it as having any useful information for the purposes of extensions
        return null;
    }
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('ExtensionTraceData handler is not finalized');
    }
    return {
        extensionTrackData: [...extensionTrackData],
        extensionMarkers: [...extensionMarkers],
    };
}
export function deps() {
    return ['UserTimings'];
}
//# sourceMappingURL=ExtensionTraceDataHandler.js.map