// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Types from '../types/types.js';
let lastUpdateLayoutTreeEvent = null;
const selectorDataForUpdateLayoutTree = new Map();
export function reset() {
    lastUpdateLayoutTreeEvent = null;
    selectorDataForUpdateLayoutTree.clear();
}
export function handleEvent(event) {
    if (Types.TraceEvents.isTraceEventSelectorStats(event) && lastUpdateLayoutTreeEvent && event.args.selector_stats) {
        selectorDataForUpdateLayoutTree.set(lastUpdateLayoutTreeEvent, {
            timings: event.args.selector_stats.selector_timings,
        });
        return;
    }
    if (Types.TraceEvents.isTraceEventUpdateLayoutTree(event)) {
        lastUpdateLayoutTreeEvent = event;
        return;
    }
}
export function data() {
    return {
        dataForUpdateLayoutEvent: selectorDataForUpdateLayoutTree,
    };
}
//# sourceMappingURL=SelectorStatsHandler.js.map