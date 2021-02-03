/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer.js');

/**
 * @fileoverview Tracks unused JavaScript
 */
class JsUsage extends Gatherer {
  constructor() {
    super();
    /** @type {LH.Crdp.Debugger.ScriptParsedEvent[]} */
    this._scriptParsedEvents = [];
    this.onScriptParsed = this.onScriptParsed.bind(this);
  }

  /**
   * @param {LH.Crdp.Debugger.ScriptParsedEvent} event
   */
  onScriptParsed(event) {
    if (event.embedderName) {
      this._scriptParsedEvents.push(event);
    }
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   */
  async beforePass(passContext) {
    await passContext.driver.sendCommand('Profiler.enable');
    await passContext.driver.sendCommand('Profiler.startPreciseCoverage', {detailed: false});

    await passContext.driver.sendCommand('Debugger.enable');
    await passContext.driver.on('Debugger.scriptParsed', this.onScriptParsed);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['JsUsage']>}
   */
  async afterPass(passContext) {
    const driver = passContext.driver;

    const coverageResponse = await driver.sendCommand('Profiler.takePreciseCoverage');
    const scriptUsages = coverageResponse.result;
    await driver.sendCommand('Profiler.stopPreciseCoverage');
    await driver.sendCommand('Profiler.disable');

    await passContext.driver.sendCommand('Debugger.disable');

    /** @type {Record<string, Array<LH.Crdp.Profiler.ScriptCoverage>>} */
    const usageByUrl = {};
    for (const scriptUsage of scriptUsages) {
      // `ScriptCoverage.url` can be overridden by a magic sourceURL comment.
      // Get the associated ScriptParsedEvent and use embedderName, which is the original url.
      // See https://chromium-review.googlesource.com/c/v8/v8/+/2317310
      let url = scriptUsage.url;
      const scriptParsedEvent =
        this._scriptParsedEvents.find(e => e.scriptId === scriptUsage.scriptId);
      if (scriptParsedEvent && scriptParsedEvent.embedderName) {
        url = scriptParsedEvent.embedderName;
      }

      // If `url` is blank, that means the script was anonymous (eval, new Function, onload, ...).
      // Or, it's because it was code Lighthouse over the protocol via `Runtime.evaluate`.
      // We currently don't consider coverage of anonymous scripts, and we defintelty don't want
      // coverage of code Lighthouse ran to inspect the page, so we ignore this ScriptCoverage if
      // url is blank.
      if (scriptUsage.url === '' || (scriptParsedEvent && scriptParsedEvent.embedderName === '')) {
        continue;
      }

      const scripts = usageByUrl[url] || [];
      scripts.push(scriptUsage);
      usageByUrl[url] = scripts;
    }

    return usageByUrl;
  }
}

module.exports = JsUsage;
