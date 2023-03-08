/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Returns a high-percentle (usually 98th) measure of how long it
 * takes the page to visibly respond to user input (or null, if there was no
 * user input in the provided trace).
 */

/** @typedef {LH.Trace.CompleteEvent & {name: 'Responsiveness.Renderer.UserInteraction', args: {frame: string, data: {interactionType: 'drag'|'keyboard'|'tapOrClick', maxDuration: number}}}} ResponsivenessEvent */
/** @typedef {'keydown'|'keypress'|'keyup'|'mousedown'|'mouseup'|'pointerdown'|'pointerup'|'click'} EventTimingType */
/**
 * @typedef EventTimingData
 * @property {string} frame
 * @property {number} timeStamp The time of user interaction (in ms from navStart).
 * @property {number} processingStart The start of interaction handling (in ms from navStart).
 * @property {number} processingEnd The end of interaction handling (in ms from navStart).
 * @property {number} duration The time from user interaction to browser paint (in ms).
 * @property {EventTimingType} type
 * @property {number} nodeId
 * @property {number} interactionId
 */
/** @typedef {LH.Trace.AsyncEvent & {name: 'EventTiming', args: {data: EventTimingData}}} EventTimingEvent */
/**
 * A fallback EventTiming placeholder, used if updated EventTiming events are not available.
 * TODO: Remove once 103.0.5052.0 is sufficiently released.
 * @typedef {{name: 'FallbackTiming', duration: number}} FallbackTimingEvent
 */

const makeComputedArtifact = require('../computed-artifact.js');
const ProcessedTrace = require('../processed-trace.js');

const KEYBOARD_EVENTS = new Set(['keydown', 'keypress', 'keyup']);
const CLICK_TAP_DRAG_EVENTS = new Set([
  'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'click']);
/** A map of Responsiveness `interactionType` to matching EventTiming `type`s. */
const interactionTypeToType = {
  keyboard: KEYBOARD_EVENTS,
  tapOrClick: CLICK_TAP_DRAG_EVENTS,
  drag: CLICK_TAP_DRAG_EVENTS,
};

class Responsiveness {
  /**
   * @param {LH.Artifacts.ProcessedTrace} processedTrace
   * @return {ResponsivenessEvent|null}
   */
  static getHighPercentileResponsiveness(processedTrace) {
    const responsivenessEvents = processedTrace.frameTreeEvents
      // https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/timing/responsiveness_metrics.cc;l=146-150;drc=a1a2302f30b0a58f7669a41c80acdf1fa11958dd
      .filter(/** @return {e is ResponsivenessEvent} */ e => {
        return e.name === 'Responsiveness.Renderer.UserInteraction';
      }).sort((a, b) => b.args.data.maxDuration - a.args.data.maxDuration);

    // If there were no interactions with the page, the metric is N/A.
    if (responsivenessEvents.length === 0) {
      return null;
    }

    // INP is the "nearest-rank"/inverted_cdf 98th percentile, except Chrome only
    // keeps the 10 worst events around, so it can never be more than the 10th from
    // last array element. To keep things simpler, sort desc and pick from front.
    // See https://source.chromium.org/chromium/chromium/src/+/main:components/page_load_metrics/browser/responsiveness_metrics_normalization.cc;l=45-59;drc=cb0f9c8b559d9c7c3cb4ca94fc1118cc015d38ad
    const index = Math.min(9, Math.floor(responsivenessEvents.length / 50));

    return responsivenessEvents[index];
  }

  /**
   * Finds the interaction event that was probably the responsivenessEvent.maxDuration
   * source.
   * Note that (presumably due to rounding to ms), the interaction duration may not
   * be the same value as `maxDuration`, just the closest value. Function will throw
   * if the closest match is off by more than 4ms.
   * TODO: this doesn't try to match inputs to interactions and break ties if more than
   * one interaction had this duration by returning the first found.
   * @param {ResponsivenessEvent} responsivenessEvent
   * @param {LH.Trace} trace
   * @return {EventTimingEvent|FallbackTimingEvent}
   */
  static findInteractionEvent(responsivenessEvent, {traceEvents}) {
    const candidates = traceEvents.filter(/** @return {evt is EventTimingEvent} */ evt => {
      // Examine only beginning/instant EventTiming events.
      return evt.name === 'EventTiming' && evt.ph !== 'e';
    });

    if (candidates.length && !candidates.some(candidate => candidate.args.data?.frame)) {
      // Full EventTiming data added in https://crrev.com/c/3632661
      return {
        name: 'FallbackTiming',
        duration: responsivenessEvent.args.data.maxDuration,
      };
    }

    const {maxDuration, interactionType} = responsivenessEvent.args.data;
    let bestMatchEvent;
    let minDurationDiff = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      // Must be from same frame.
      if (candidate.args.data.frame !== responsivenessEvent.args.frame) continue;

      // TODO(bckenny): must be in same navigation as well.

      const {type, duration} = candidate.args.data;
      // Discard if type is incompatible with responsiveness interactionType.
      const matchingTypes = interactionTypeToType[interactionType];
      if (!matchingTypes) {
        throw new Error(`unexpected responsiveness interactionType '${interactionType}'`);
      }
      if (!matchingTypes.has(type)) continue;

      const durationDiff = Math.abs(duration - maxDuration);
      if (durationDiff < minDurationDiff) {
        bestMatchEvent = candidate;
        minDurationDiff = durationDiff;
      }
    }

    if (!bestMatchEvent) {
      throw new Error(`no interaction event found for responsiveness type '${interactionType}'`);
    }
    // TODO: seems to regularly happen up to 3ms and as high as 4. Allow for up to 5ms to be sure.
    if (minDurationDiff > 5) {
      throw new Error(`no interaction event found within 5ms of responsiveness maxDuration (max: ${maxDuration}, closest ${bestMatchEvent.args.data.duration})`); // eslint-disable-line max-len
    }

    return bestMatchEvent;
  }

  /**
   * @param {{trace: LH.Trace, settings: Immutable<LH.Config.Settings>}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<EventTimingEvent|FallbackTimingEvent|null>}
   */
  static async compute_(data, context) {
    const {settings, trace} = data;
    if (settings.throttlingMethod === 'simulate') {
      throw new Error('Responsiveness currently unsupported by simulated throttling');
    }

    const processedTrace = await ProcessedTrace.request(trace, context);
    const responsivenessEvent = Responsiveness.getHighPercentileResponsiveness(processedTrace);
    if (!responsivenessEvent) return null;

    const interactionEvent = Responsiveness.findInteractionEvent(responsivenessEvent, trace);
    return JSON.parse(JSON.stringify(interactionEvent));
  }
}

module.exports = makeComputedArtifact(Responsiveness, [
  'trace',
  'settings',
]);
