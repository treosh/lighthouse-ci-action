/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {makeComputedArtifact} from './computed-artifact.js';
import {ProcessedTrace} from './processed-trace.js';
import LHTraceProcessor from '../lib/lh-trace-processor.js';

class ProcessedNavigation {
  /**
   * @param {LH.Trace | LH.Artifacts.ProcessedTrace} traceOrProcessedTrace
   * @return {traceOrProcessedTrace is LH.Artifacts.ProcessedTrace}
   */
  static isProcessedTrace(traceOrProcessedTrace) {
    return 'timeOriginEvt' in traceOrProcessedTrace;
  }

  /**
   * @param {LH.Trace | LH.Artifacts.ProcessedTrace} traceOrProcessedTrace
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.ProcessedNavigation>}
   */
  static async compute_(traceOrProcessedTrace, context) {
    // TODO: Remove this backport once pubads passes in a raw trace.
    if (this.isProcessedTrace(traceOrProcessedTrace)) {
      return LHTraceProcessor.processNavigation(traceOrProcessedTrace);
    }

    const processedTrace = await ProcessedTrace.request(traceOrProcessedTrace, context);
    return LHTraceProcessor.processNavigation(processedTrace);
  }
}

const ProcessedNavigationComputed = makeComputedArtifact(ProcessedNavigation, null);
export {ProcessedNavigationComputed as ProcessedNavigation};
