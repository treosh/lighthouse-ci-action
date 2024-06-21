// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
const animations = [];
const animationsSyntheticEvents = [];
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
export function reset() {
    animations.length = 0;
    animationsSyntheticEvents.length = 0;
}
export function handleEvent(event) {
    if (Types.TraceEvents.isTraceEventAnimation(event)) {
        animations.push(event);
        return;
    }
}
export async function finalize() {
    const syntheticEvents = Helpers.Trace.createMatchedSortedSyntheticEvents(animations);
    animationsSyntheticEvents.push(...syntheticEvents);
    handlerState = 3 /* HandlerState.FINALIZED */;
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('Animation handler is not finalized');
    }
    return {
        animations: animationsSyntheticEvents,
    };
}
//# sourceMappingURL=AnimationHandler.js.map