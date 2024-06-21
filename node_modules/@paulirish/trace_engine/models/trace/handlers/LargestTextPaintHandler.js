// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Types from '../types/types.js';
/**
 * A trace file will contain all the text paints that were candidates for the
 * LargestTextPaint. If an LCP event is text, it will point to one of these
 * candidates, so we store them by their DOM Node ID.
 **/
const textPaintByDOMNodeId = new Map();
export function reset() {
    textPaintByDOMNodeId.clear();
}
export function handleEvent(event) {
    if (!Types.TraceEvents.isTraceEventLargestTextPaintCandidate(event)) {
        return;
    }
    if (!event.args.data) {
        return;
    }
    textPaintByDOMNodeId.set(event.args.data.DOMNodeId, event);
}
export function data() {
    return textPaintByDOMNodeId;
}
//# sourceMappingURL=LargestTextPaintHandler.js.map