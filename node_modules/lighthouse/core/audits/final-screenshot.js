/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Audit} from './audit.js';
import {LighthouseError} from '../lib/lh-error.js';
import {ProcessedTrace} from '../computed/processed-trace.js';
import {Screenshots} from '../computed/screenshots.js';

class FinalScreenshot extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'final-screenshot',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: 'Final Screenshot',
      description: 'The last screenshot captured of the pageload.',
      requiredArtifacts: ['traces', 'GatherContext'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const processedTrace = await ProcessedTrace.request(trace, context);
    const screenshots = await Screenshots.request(trace, context);
    const {timeOrigin} = processedTrace.timestamps;
    const finalScreenshot = screenshots[screenshots.length - 1];

    if (!finalScreenshot) {
      // If a timespan didn't happen to contain frames, that's fine. Just mark not applicable.
      if (artifacts.GatherContext.gatherMode === 'timespan') return {notApplicable: true, score: 1};

      // If it was another mode, that's a fatal error.
      throw new LighthouseError(LighthouseError.errors.NO_SCREENSHOTS);
    }

    return {
      score: 1,
      details: {
        type: 'screenshot',
        timing: Math.round((finalScreenshot.timestamp - timeOrigin) / 1000),
        timestamp: finalScreenshot.timestamp,
        data: finalScreenshot.datauri,
      },
    };
  }
}

export default FinalScreenshot;
