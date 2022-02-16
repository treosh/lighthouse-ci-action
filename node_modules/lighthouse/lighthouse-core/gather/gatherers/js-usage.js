/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');

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
    /** @type {LH.Crdp.Debugger.ScriptParsedEvent[]} */
    this._scriptParsedEvents = [];
    /** @type {LH.Crdp.Profiler.ScriptCoverage[]} */
    this._scriptUsages = [];
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
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startSensitiveInstrumentation(context) {
    const session = context.driver.defaultSession;
    session.on('Debugger.scriptParsed', this.onScriptParsed);
    await session.sendCommand('Debugger.enable');
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async stopSensitiveInstrumentation(context) {
    const session = context.driver.defaultSession;
    await session.sendCommand('Debugger.disable');
    session.off('Debugger.scriptParsed', this.onScriptParsed);
  }

  /**
   * Usages alone do not always generate an exhaustive list of scripts in timespan and snapshot.
   * For audits which use this for url/scriptId mappings, we can include an empty usage object.
   *
   * @param {Record<string, Array<LH.Crdp.Profiler.ScriptCoverage>>} usageByUrl
   */
  _addMissingScriptIds(usageByUrl) {
    for (const scriptParsedEvent of this._scriptParsedEvents) {
      const url = scriptParsedEvent.embedderName;
      if (!url) continue;

      const scripts = usageByUrl[url] || [];
      if (!scripts.find(s => s.scriptId === scriptParsedEvent.scriptId)) {
        scripts.push({
          url,
          scriptId: scriptParsedEvent.scriptId,
          functions: [],
        });
      }
      usageByUrl[url] = scripts;
    }
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['JsUsage']>}
   */
  async getArtifact(context) {
    /** @type {Record<string, Array<LH.Crdp.Profiler.ScriptCoverage>>} */
    const usageByUrl = {};

    // Force `Debugger.scriptParsed` events for url to scriptId mappings in snapshot mode.
    if (context.gatherMode === 'snapshot') {
      await this.startSensitiveInstrumentation(context);
      await this.stopSensitiveInstrumentation(context);
    }

    for (const scriptUsage of this._scriptUsages) {
      // `ScriptCoverage.url` can be overridden by a magic sourceURL comment.
      // Get the associated ScriptParsedEvent and use embedderName, which is the original url.
      // See https://chromium-review.googlesource.com/c/v8/v8/+/2317310
      let url = scriptUsage.url;
      const scriptParsedEvent =
        this._scriptParsedEvents.find(e => e.scriptId === scriptUsage.scriptId);
      if (scriptParsedEvent?.embedderName) {
        url = scriptParsedEvent.embedderName;
      }

      // If `url` is blank, that means the script was anonymous (eval, new Function, onload, ...).
      // Or, it's because it was code Lighthouse over the protocol via `Runtime.evaluate`.
      // We currently don't consider coverage of anonymous scripts, and we definitely don't want
      // coverage of code Lighthouse ran to inspect the page, so we ignore this ScriptCoverage if
      // url is blank.
      if (scriptUsage.url === '' || (scriptParsedEvent && scriptParsedEvent.embedderName === '')) {
        continue;
      }

      const scripts = usageByUrl[url] || [];
      scripts.push(scriptUsage);
      usageByUrl[url] = scripts;
    }

    if (context.gatherMode !== 'navigation') {
      this._addMissingScriptIds(usageByUrl);
    }

    return usageByUrl;
  }
}

module.exports = JsUsage;
