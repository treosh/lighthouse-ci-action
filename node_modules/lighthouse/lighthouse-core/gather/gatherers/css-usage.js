/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');

/**
 * @fileoverview Tracks unused CSS rules.
 */
class CSSUsage extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    // TODO(FR-COMPAT): Add support for timespan.
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['CSSUsage']>}
   */
  async getArtifact(context) {
    const session = context.driver.defaultSession;
    const executionContext = context.driver.executionContext;

    /** @type {Array<LH.Crdp.CSS.StyleSheetAddedEvent>} */
    const stylesheets = [];
    /** @param {LH.Crdp.CSS.StyleSheetAddedEvent} sheet */
    const onStylesheetAdded = sheet => stylesheets.push(sheet);
    session.on('CSS.styleSheetAdded', onStylesheetAdded);

    await session.sendCommand('DOM.enable');
    await session.sendCommand('CSS.enable');
    await session.sendCommand('CSS.startRuleUsageTracking');

    // Force style to recompute.
    // Doesn't appear to be necessary in newer versions of Chrome.
    await executionContext.evaluateAsync('getComputedStyle(document.body)');

    session.off('CSS.styleSheetAdded', onStylesheetAdded);

    // Fetch style sheet content in parallel.
    const promises = stylesheets.map(sheet => {
      const styleSheetId = sheet.header.styleSheetId;
      return session.sendCommand('CSS.getStyleSheetText', {styleSheetId}).then(content => {
        return {
          header: sheet.header,
          content: content.text,
        };
      });
    });
    const styleSheetInfo = await Promise.all(promises);

    const ruleUsageResponse = await session.sendCommand('CSS.stopRuleUsageTracking');
    await session.sendCommand('CSS.disable');
    await session.sendCommand('DOM.disable');

    const dedupedStylesheets = new Map(styleSheetInfo.map(sheet => {
      return [sheet.content, sheet];
    }));
    return {
      rules: ruleUsageResponse.ruleUsage,
      stylesheets: Array.from(dedupedStylesheets.values()),
    };
  }
}

module.exports = CSSUsage;
