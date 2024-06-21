// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
/**
 * IMPORTANT!
 * See UserTimings.md in this directory for some handy documentation on
 * UserTimings and the trace events we parse currently.
 **/
let syntheticEvents = [];
const performanceMeasureEvents = [];
const performanceMarkEvents = [];
const consoleTimings = [];
const timestampEvents = [];
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
export function reset() {
    syntheticEvents.length = 0;
    performanceMeasureEvents.length = 0;
    performanceMarkEvents.length = 0;
    consoleTimings.length = 0;
    timestampEvents.length = 0;
    handlerState = 2 /* HandlerState.INITIALIZED */;
}
const resourceTimingNames = [
    'workerStart',
    'redirectStart',
    'redirectEnd',
    'fetchStart',
    'domainLookupStart',
    'domainLookupEnd',
    'connectStart',
    'connectEnd',
    'secureConnectionStart',
    'requestStart',
    'responseStart',
    'responseEnd',
];
const navTimingNames = [
    'navigationStart',
    'unloadEventStart',
    'unloadEventEnd',
    'redirectStart',
    'redirectEnd',
    'fetchStart',
    'commitNavigationEnd',
    'domainLookupStart',
    'domainLookupEnd',
    'connectStart',
    'connectEnd',
    'secureConnectionStart',
    'requestStart',
    'responseStart',
    'responseEnd',
    'domLoading',
    'domInteractive',
    'domContentLoadedEventStart',
    'domContentLoadedEventEnd',
    'domComplete',
    'loadEventStart',
    'loadEventEnd',
];
export function handleEvent(event) {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('UserTimings handler is not initialized');
    }
    // These are events dispatched under the blink.user_timing category
    // but that the user didn't add. Filter them out so that they do not
    // Appear in the timings track (they still appear in the main thread
    // flame chart).
    const ignoredNames = [...resourceTimingNames, ...navTimingNames];
    if (ignoredNames.includes(event.name)) {
        return;
    }
    if (Types.TraceEvents.isTraceEventPerformanceMeasure(event)) {
        performanceMeasureEvents.push(event);
        return;
    }
    if (Types.TraceEvents.isTraceEventPerformanceMark(event)) {
        performanceMarkEvents.push(event);
    }
    if (Types.TraceEvents.isTraceEventConsoleTime(event)) {
        consoleTimings.push(event);
    }
    if (Types.TraceEvents.isTraceEventTimeStamp(event)) {
        timestampEvents.push(event);
    }
}
export async function finalize() {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('UserTimings handler is not initialized');
    }
    const asyncEvents = [...performanceMeasureEvents, ...consoleTimings];
    syntheticEvents = Helpers.Trace.createMatchedSortedSyntheticEvents(asyncEvents);
    handlerState = 3 /* HandlerState.FINALIZED */;
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('UserTimings handler is not finalized');
    }
    return {
        performanceMeasures: syntheticEvents.filter(e => e.cat === 'blink.user_timing'),
        consoleTimings: syntheticEvents.filter(e => e.cat === 'blink.console'),
        // TODO(crbug/41484172): UserTimingsHandler.test.ts fails if this is not copied.
        performanceMarks: [...performanceMarkEvents],
        timestampEvents: [...timestampEvents],
    };
}
//# sourceMappingURL=UserTimingsHandler.js.map