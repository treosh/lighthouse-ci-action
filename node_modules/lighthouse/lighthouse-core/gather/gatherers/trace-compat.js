/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * This gatherer remaps the result of the Trace gatherer for compatibility with legacy Lighthouse
 * when devtools logs and traces were special-cased.
 */

const TraceGatherer = require('./trace.js');
const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');

/** @implements {LH.Gatherer.FRGathererInstance<'Trace'>} */
class TraceCompat extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'Trace'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {Trace: TraceGatherer.symbol},
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'Trace'>} passContext
   * @return {Promise<LH.Artifacts['traces']>}
   */
  async getArtifact(passContext) {
    return {
      defaultPass: passContext.dependencies.Trace,
    };
  }
}

module.exports = TraceCompat;
