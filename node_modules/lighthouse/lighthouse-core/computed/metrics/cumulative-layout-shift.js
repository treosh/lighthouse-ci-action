/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('../computed-artifact.js');
const TraceOfTab = require('../trace-of-tab.js');
const LHError = require('../../lib/lh-error.js');

class CumulativeLayoutShift {
  /**
   * @param {LH.Trace} trace
   * @param {LH.Audit.Context} context
   * @return {Promise<{value: number, debugInfo: Record<string,boolean> | null}>}
   */
  static async compute_(trace, context) {
    const traceOfTab = await TraceOfTab.request(trace, context);

    // Find the last LayoutShift event, if any.
    let finalLayoutShift;
    for (let i = traceOfTab.mainThreadEvents.length - 1; i >= 0; i--) {
      const evt = traceOfTab.mainThreadEvents[i];
      if (evt.name === 'LayoutShift' && evt.args && evt.args.data && evt.args.data.is_main_frame) {
        finalLayoutShift = evt;
        break;
      }
    }

    const finalLayoutShiftTraceEventFound = !!finalLayoutShift;
    // tdresser sez: In about 10% of cases, layout instability is 0, and there will be no trace events.
    // TODO: Validate that. http://crbug.com/1003459
    if (!finalLayoutShift) {
      return {
        value: 0,
        debugInfo: {
          finalLayoutShiftTraceEventFound,
        },
      };
    }

    let cumulativeLayoutShift =
      finalLayoutShift.args &&
      finalLayoutShift.args.data &&
      finalLayoutShift.args.data.cumulative_score;

    if (cumulativeLayoutShift === undefined) {
      throw new LHError(LHError.errors.LAYOUT_SHIFT_MISSING_DATA);
    }

    // Chromium will set `had_recent_input` if there was recent user input, which
    // skips shift events from contributing to CLS. This flag is also set when Lighthouse changes
    // the emulation size. This consistently results in the first few shift event always being
    // ignored for CLS. Since we don't expect any user input, we add the score of these
    // shift events to CLS.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1094974.
    for (let i = 0; i < traceOfTab.mainThreadEvents.length; i++) {
      const evt = traceOfTab.mainThreadEvents[i];
      if (evt.name === 'LayoutShift' && evt.args && evt.args.data && evt.args.data.is_main_frame) {
        if (!evt.args.data.had_recent_input) break;
        if (typeof evt.args.data.score !== 'number') continue;
        cumulativeLayoutShift += evt.args.data.score;
      }
    }

    return {
      value: cumulativeLayoutShift,
      debugInfo: {
        finalLayoutShiftTraceEventFound,
      },
    };
  }
}

module.exports = makeComputedArtifact(CumulativeLayoutShift);
