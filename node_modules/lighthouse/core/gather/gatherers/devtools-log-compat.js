/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview
 * This gatherer remaps the result of the DevtoolsLog gatherer for compatibility with legacy Lighthouse
 * when devtools logs and traces were special-cased.
 */

import DevtoolsLogGatherer from './devtools-log.js';
import FRGatherer from '../base-gatherer.js';

/** @implements {LH.Gatherer.FRGathererInstance<'DevtoolsLog'>} */
class DevtoolsLogCompat extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLogGatherer.symbol},
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} passContext
   * @return {Promise<LH.Artifacts['devtoolsLogs']>}
   */
  async getArtifact(passContext) {
    return {
      defaultPass: passContext.dependencies.DevtoolsLog,
    };
  }
}

export default DevtoolsLogCompat;
