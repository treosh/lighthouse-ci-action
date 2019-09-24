/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer.js');

/**
 * @fileoverview Tracks unused JavaScript
 */
class JsUsage extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   */
  async beforePass(passContext) {
    await passContext.driver.sendCommand('Profiler.enable');
    await passContext.driver.sendCommand('Profiler.startPreciseCoverage');
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['JsUsage']>}
   */
  async afterPass(passContext) {
    const driver = passContext.driver;

    const coverageResponse = await driver.sendCommand('Profiler.takePreciseCoverage');
    await driver.sendCommand('Profiler.stopPreciseCoverage');
    await driver.sendCommand('Profiler.disable');
    return coverageResponse.result;
  }
}

module.exports = JsUsage;
