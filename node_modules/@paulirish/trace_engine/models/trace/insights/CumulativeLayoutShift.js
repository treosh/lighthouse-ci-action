// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Helpers from '../helpers/helpers.js';
export function deps() {
    return ['Meta', 'Animations'];
}
/**
 * Each failure reason is represented by a bit flag. The bit shift operator '<<' is used to define
 * which bit corresponds to each failure reason.
 * https://source.chromium.org/search?q=f:compositor_animations.h%20%22enum%20FailureReason%22
 * @type {{flag: number, failure: AnimationFailureReasons}[]}
 */
const ACTIONABLE_FAILURE_REASONS = [
    {
        flag: 1 << 13,
        failure: "UNSUPPORTED_CSS_PROPERTY" /* AnimationFailureReasons.UNSUPPORTED_CSS_PROPERTY */,
    },
    {
        flag: 1 << 11,
        failure: "TRANSFROM_BOX_SIZE_DEPENDENT" /* AnimationFailureReasons.TRANSFROM_BOX_SIZE_DEPENDENT */,
    },
    {
        flag: 1 << 12,
        failure: "FILTER_MAY_MOVE_PIXELS" /* AnimationFailureReasons.FILTER_MAY_MOVE_PIXELS */,
    },
    {
        flag: 1 << 4,
        failure: "NON_REPLACE_COMPOSITE_MODE" /* AnimationFailureReasons.NON_REPLACE_COMPOSITE_MODE */,
    },
    {
        flag: 1 << 6,
        failure: "INCOMPATIBLE_ANIMATIONS" /* AnimationFailureReasons.INCOMPATIBLE_ANIMATIONS */,
    },
    {
        flag: 1 << 3,
        failure: "UNSUPPORTED_TIMING_PARAMS" /* AnimationFailureReasons.UNSUPPORTED_TIMING_PARAMS */,
    },
];
/**
 * Returns a list of NoncompositedAnimationFailures.
 */
function getNonCompositedAnimations(animations) {
    const failures = [];
    for (const event of animations) {
        const beginEvent = event.args.data.beginEvent;
        const instantEvents = event.args.data.instantEvents || [];
        /**
         * Animation events containing composite information are ASYNC_NESTABLE_INSTANT ('n').
         * An animation may also contain multiple 'n' events, so we look through those with useful non-composited data.
         */
        for (const event of instantEvents) {
            const failureMask = event.args.data.compositeFailed;
            const unsupportedProperties = event.args.data.unsupportedProperties;
            if (!failureMask || !unsupportedProperties) {
                continue;
            }
            const failureReasons = ACTIONABLE_FAILURE_REASONS.filter(reason => failureMask & reason.flag).map(reason => {
                return reason.failure;
            });
            const failure = {
                name: beginEvent.args.data.displayName,
                failureReasons,
                unsupportedProperties,
            };
            failures.push(failure);
        }
    }
    return failures;
}
export function generateInsight(traceParsedData, context) {
    const compositeAnimationEvents = traceParsedData.Animations.animations.filter(event => {
        const nav = Helpers.Trace.getNavigationForTraceEvent(event, context.frameId, traceParsedData.Meta.navigationsByFrameId);
        return nav?.args.data?.navigationId === context.navigationId;
    });
    const animationFailures = getNonCompositedAnimations(compositeAnimationEvents);
    return {
        animationFailures,
    };
}
//# sourceMappingURL=CumulativeLayoutShift.js.map