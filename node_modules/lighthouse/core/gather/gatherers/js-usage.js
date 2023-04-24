/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import FRGatherer from '../base-gatherer.js';

/**
 * @fileoverview Tracks unused JavaScript
 */
class JsUsage extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'timespan', 'navigation'],
  };

  constructor() {
    super();
    /** @type {LH.Crdp.Profiler.ScriptCoverage[]} */
    this._scriptUsages = [];
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startInstrumentation(context) {
    const session = context.driver.defaultSession;
    await session.sendCommand('Profiler.enable');
    await session.sendCommand('Profiler.startPreciseCoverage', {detailed: false});
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async stopInstrumentation(context) {
    const session = context.driver.defaultSession;
    const coverageResponse = await session.sendCommand('Profiler.takePreciseCoverage');
    this._scriptUsages = coverageResponse.result;
    await session.sendCommand('Profiler.stopPreciseCoverage');
    await session.sendCommand('Profiler.disable');
  }

  /**
   * @return {Promise<LH.Artifacts['JsUsage']>}
   */
  async getArtifact() {
    /** @type {Record<string, LH.Crdp.Profiler.ScriptCoverage>} */
    const usageByScriptId = {};

    for (const scriptUsage of this._scriptUsages) {
      // If `url` is blank, that means the script was dynamically
      // created (eval, new Function, onload, ...)
      if (scriptUsage.url === '' || scriptUsage.url === '_lighthouse-eval.js') {
        // We currently don't consider coverage of dynamic scripts, and we definitely don't want
        // coverage of code Lighthouse ran to inspect the page, so we ignore this ScriptCoverage.
        // Audits would work the same without this, it is only an optimization (not tracking coverage
        // for scripts we don't care about).
        continue;
      }

      // Scripts run via puppeteer's evaluate interface will have this url.
      if (scriptUsage.url === '__puppeteer_evaluation_script__') {
        continue;
      }

      usageByScriptId[scriptUsage.scriptId] = scriptUsage;
    }

    return usageByScriptId;
  }
}

export default JsUsage;
