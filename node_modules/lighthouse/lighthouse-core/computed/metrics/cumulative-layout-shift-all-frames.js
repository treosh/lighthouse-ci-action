/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('../computed-artifact.js');

class CumulativeLayoutShiftAllFrames {
  /**
   * @param {LH.Trace} trace
   * @return {Promise<{value: number}>}
   */
  static async compute_(trace) {
    const cumulativeShift = trace.traceEvents
      .filter(e =>
        e.name === 'LayoutShift' &&
        e.args &&
        e.args.data &&
        e.args.data.score &&
        !e.args.data.had_recent_input
      )
      .map(e => {
        // @ts-expect-error Events without score are filtered out.
        return /** @type {number} */ (e.args.data.score);
      })
      .reduce((sum, score) => sum + score, 0);
    return {
      value: cumulativeShift,
    };
  }
}

module.exports = makeComputedArtifact(CumulativeLayoutShiftAllFrames);
