/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('./computed-artifact.js');
const LHError = require('../lib/lh-error.js');
const TraceProcessor = require('../lib/tracehouse/trace-processor.js');

// TraceProcessor throws generic errors, but we'd like our special localized and code-specific LHError
// objects to be thrown instead.
class LHTraceProcessor extends TraceProcessor {
  /**
   * @return {Error}
   */
  static createNoNavstartError() {
    return new LHError(LHError.errors.NO_NAVSTART);
  }

  /**
   * This isn't currently used, but will be when the time origin of trace processing is changed.
   * @see {TraceProcessor.computeTimeOrigin}
   * @see https://github.com/GoogleChrome/lighthouse/pull/11253#discussion_r507985527
   * @return {Error}
   */
  static createNoResourceSendRequestError() {
    return new LHError(LHError.errors.NO_RESOURCE_REQUEST);
  }

  /**
   * @return {Error}
   */
  static createNoTracingStartedError() {
    return new LHError(LHError.errors.NO_TRACING_STARTED);
  }
}


class TraceOfTab {
  /**
   * Finds key trace events, identifies main process/thread, and returns timings of trace events
   * in milliseconds since navigation start in addition to the standard microsecond monotonic timestamps.
   * @param {LH.Trace} trace
   * @return {Promise<LH.Artifacts.TraceOfTab>}
  */
  static async compute_(trace) {
    // Trace of tab doesn't require FCP to exist, but all of LH requires it.
    // We'll check that we got an FCP here and re-type accordingly so all of our consumers don't
    // have to repeat this check.
    const traceOfTab = await LHTraceProcessor.computeTraceOfTab(trace);
    const {
      timings,
      timestamps,
      firstContentfulPaintEvt,
      firstContentfulPaintAllFramesEvt,
    } = traceOfTab;
    const {
      firstContentfulPaint: firstContentfulPaintTiming,
      firstContentfulPaintAllFrames: firstContentfulPaintAllFramesTiming,
    } = timings;
    const {
      firstContentfulPaint: firstContentfulPaintTs,
      firstContentfulPaintAllFrames: firstContentfulPaintAllFramesTs,
    } = timestamps;

    if (
      !firstContentfulPaintEvt ||
      firstContentfulPaintTiming === undefined ||
      firstContentfulPaintTs === undefined ||
      // FCP-AF will only be undefined if FCP is also undefined.
      // These conditions are for enforcing types and should never actually trigger.
      !firstContentfulPaintAllFramesEvt ||
      firstContentfulPaintAllFramesTiming === undefined ||
      firstContentfulPaintAllFramesTs === undefined
    ) {
      throw new LHError(LHError.errors.NO_FCP);
    }

    // We already know that `traceOfTab` is good to go at this point, but tsc doesn't yet.
    // Help tsc out by reconstructing the object manually with the known defined values.
    return {
      ...traceOfTab,
      firstContentfulPaintEvt,
      firstContentfulPaintAllFramesEvt,
      timings: {
        ...timings,
        firstContentfulPaint: firstContentfulPaintTiming,
        firstContentfulPaintAllFrames: firstContentfulPaintAllFramesTiming,
      },
      timestamps: {
        ...timestamps,
        firstContentfulPaint: firstContentfulPaintTs,
        firstContentfulPaintAllFrames: firstContentfulPaintAllFramesTs,
      },
    };
  }
}

module.exports = makeComputedArtifact(TraceOfTab);
