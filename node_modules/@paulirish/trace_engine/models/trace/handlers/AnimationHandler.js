// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
const animations = [];
const animationsSyntheticEvents = [];
export function reset() {
    animations.length = 0;
    animationsSyntheticEvents.length = 0;
}
export function handleEvent(event) {
    if (Types.Events.isAnimation(event)) {
        animations.push(event);
        return;
    }
}
export async function finalize() {
    const syntheticEvents = Helpers.Trace.createMatchedSortedSyntheticEvents(animations);
    animationsSyntheticEvents.push(...syntheticEvents);
}
export function data() {
    return {
        animations: animationsSyntheticEvents,
    };
}
//# sourceMappingURL=AnimationHandler.js.map