/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Tracks unused CSS rules.
 */

import log from 'lighthouse-logger';

import FRGatherer from '../base-gatherer.js';
import {Sentry} from '../../lib/sentry.js';

class CSSUsage extends FRGatherer {
  constructor() {
    super();
    /** @type {LH.Gatherer.FRProtocolSession|undefined} */
    this._session = undefined;
    /** @type {Map<string, Promise<LH.Artifacts.CSSStyleSheetInfo|Error>>} */
    this._sheetPromises = new Map();
    /**
     * Initialize as undefined so we can assert results are fetched.
     * @type {LH.Crdp.CSS.RuleUsage[]|undefined}
     */
    this._ruleUsage = undefined;
    this._onStylesheetAdded = this._onStylesheetAdded.bind(this);
  }

  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'timespan', 'navigation'],
  };

  /**
   * @param {LH.Crdp.CSS.StyleSheetAddedEvent} event
   */
  async _onStylesheetAdded(event) {
    if (!this._session) throw new Error('Session not initialized');
    const styleSheetId = event.header.styleSheetId;
    const sheetPromise = this._session.sendCommand('CSS.getStyleSheetText', {styleSheetId})
      .then(content => ({
        header: event.header,
        content: content.text,
      }))
      .catch(/** @param {Error} err */ (err) => {
        log.warn(
          'CSSUsage',
          `Error fetching content of stylesheet with URL "${event.header.sourceURL}"`
        );
        Sentry.captureException(err, {
          tags: {
            gatherer: this.name,
          },
          extra: {
            url: event.header.sourceURL,
          },
          level: 'error',
        });
        return err;
      });
    this._sheetPromises.set(styleSheetId, sheetPromise);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startCSSUsageTracking(context) {
    const session = context.driver.defaultSession;
    this._session = session;
    session.on('CSS.styleSheetAdded', this._onStylesheetAdded);

    await session.sendCommand('DOM.enable');
    await session.sendCommand('CSS.enable');
    await session.sendCommand('CSS.startRuleUsageTracking');
  }


  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async stopCSSUsageTracking(context) {
    const session = context.driver.defaultSession;
    const coverageResponse = await session.sendCommand('CSS.stopRuleUsageTracking');
    this._ruleUsage = coverageResponse.ruleUsage;
    session.off('CSS.styleSheetAdded', this._onStylesheetAdded);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startInstrumentation(context) {
    if (context.gatherMode !== 'timespan') return;
    await this.startCSSUsageTracking(context);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async stopInstrumentation(context) {
    if (context.gatherMode !== 'timespan') return;
    await this.stopCSSUsageTracking(context);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['CSSUsage']>}
   */
  async getArtifact(context) {
    const session = context.driver.defaultSession;
    const executionContext = context.driver.executionContext;

    if (context.gatherMode !== 'timespan') {
      await this.startCSSUsageTracking(context);

      // Force style to recompute.
      // Doesn't appear to be necessary in newer versions of Chrome.
      await executionContext.evaluateAsync('getComputedStyle(document.body)');

      await this.stopCSSUsageTracking(context);
    }

    /** @type {Map<string, LH.Artifacts.CSSStyleSheetInfo>} */
    const dedupedStylesheets = new Map();
    const sheets = await Promise.all(this._sheetPromises.values());

    for (const sheet of sheets) {
      // Erroneous sheets will be reported via sentry and the log.
      // We can ignore them here without throwing a fatal error.
      if (sheet instanceof Error) {
        continue;
      }

      dedupedStylesheets.set(sheet.content, sheet);
    }

    await session.sendCommand('CSS.disable');
    await session.sendCommand('DOM.disable');

    if (!this._ruleUsage) throw new Error('Issue collecting rule usages');

    return {
      rules: this._ruleUsage,
      stylesheets: Array.from(dedupedStylesheets.values()),
    };
  }
}

export default CSSUsage;
