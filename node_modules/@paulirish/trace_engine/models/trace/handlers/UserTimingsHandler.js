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
// There are two events dispatched for performance.measure calls: one to
// represent the measured timing in the tracing clock (which we type as
// PerformanceMeasure) and another one for the call itself (which we
// type as UserTimingMeasure). The two events corresponding to the same
// call are linked together by a common trace_id. The reason two events
// are dispatched is because the first was originally added with the
// implementation of the performance.measure API and it uses an
// overridden timestamp and duration. To prevent breaking potential deps
// created since then, a second event was added instead of changing the
// params of the first.
const measureTraceByTraceId = new Map();
const performanceMeasureEvents = [];
const performanceMarkEvents = [];
const consoleTimings = [];
const timestampEvents = [];
export function reset() {
    syntheticEvents.length = 0;
    performanceMeasureEvents.length = 0;
    performanceMarkEvents.length = 0;
    consoleTimings.length = 0;
    timestampEvents.length = 0;
    measureTraceByTraceId.clear();
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
// These are events dispatched under the blink.user_timing category
// but that the user didn't add. Filter them out so that they do not
// Appear in the timings track (they still appear in the main thread
// flame chart).
const ignoredNames = [...resourceTimingNames, ...navTimingNames];
/**
 * Similar to the default {@see Helpers.Trace.eventTimeComparator}
 * but with a twist:
 * In case of equal start and end times, always put the second event
 * first.
 *
 * Explanation:
 * User timing entries come as trace events dispatched when
 * performance.measure/mark is called. The trace events buffered in
 * devtools frontend are sorted by the start time. If their start time
 * is the same, then the event for the first call will appear first.
 *
 * When entries are meant to be stacked, the corresponding
 * performance.measure calls usually are done in bottom-up direction:
 * calls for children first and for parent later (because the call
 * is usually done when the measured task is over). This means that
 * when two user timing events have the start and end time, usually the
 * second event is the parent of the first. Hence the switch.
 *
 */
function userTimingComparator(a, b, originalArray) {
    const aBeginTime = a.ts;
    const bBeginTime = b.ts;
    if (aBeginTime < bBeginTime) {
        return -1;
    }
    if (aBeginTime > bBeginTime) {
        return 1;
    }
    const aDuration = a.dur ?? 0;
    const bDuration = b.dur ?? 0;
    const aEndTime = aBeginTime + aDuration;
    const bEndTime = bBeginTime + bDuration;
    if (aEndTime > bEndTime) {
        return -1;
    }
    if (aEndTime < bEndTime) {
        return 1;
    }
    // Prefer the event located in a further position in the original array.
    return originalArray.indexOf(b) - originalArray.indexOf(a);
}
export function handleEvent(event) {
    if (ignoredNames.includes(event.name)) {
        return;
    }
    if (Types.Events.isUserTimingMeasure(event)) {
        measureTraceByTraceId.set(event.args.traceId, event);
    }
    if (Types.Events.isPerformanceMeasure(event)) {
        performanceMeasureEvents.push(event);
        return;
    }
    if (Types.Events.isPerformanceMark(event)) {
        performanceMarkEvents.push(event);
    }
    if (Types.Events.isConsoleTime(event)) {
        consoleTimings.push(event);
    }
    if (Types.Events.isConsoleTimeStamp(event)) {
        timestampEvents.push(event);
    }
}
export async function finalize() {
    const asyncEvents = [...performanceMeasureEvents, ...consoleTimings];
    syntheticEvents = Helpers.Trace.createMatchedSortedSyntheticEvents(asyncEvents);
    syntheticEvents = syntheticEvents.sort((a, b) => userTimingComparator(a, b, [...syntheticEvents]));
}
export function data() {
    return {
        performanceMeasures: syntheticEvents.filter(e => e.cat === 'blink.user_timing'),
        consoleTimings: syntheticEvents.filter(e => e.cat === 'blink.console'),
        // TODO(crbug/41484172): UserTimingsHandler.test.ts fails if this is not copied.
        performanceMarks: [...performanceMarkEvents],
        timestampEvents: [...timestampEvents],
        measureTraceByTraceId: new Map(measureTraceByTraceId),
    };
}
//# sourceMappingURL=UserTimingsHandler.js.map