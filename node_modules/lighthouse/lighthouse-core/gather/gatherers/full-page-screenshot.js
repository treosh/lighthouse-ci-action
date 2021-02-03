/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* globals window getBoundingClientRect */

const Gatherer = require('./gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');

// JPEG quality setting
// Exploration and examples of reports using different quality settings: https://docs.google.com/document/d/1ZSffucIca9XDW2eEwfoevrk-OTl7WQFeMf0CgeJAA8M/edit#
const FULL_PAGE_SCREENSHOT_QUALITY = 30;
// Maximum screenshot height in Chrome https://bugs.chromium.org/p/chromium/issues/detail?id=770769
const MAX_SCREENSHOT_HEIGHT = 16384;

/**
 * @param {string} str
 */
function snakeCaseToCamelCase(str) {
  return str.replace(/(-\w)/g, m => m[1].toUpperCase());
}

class FullPageScreenshot extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts.FullPageScreenshot['screenshot']>}
   */
  async _takeScreenshot(passContext) {
    const driver = passContext.driver;
    const metrics = await driver.sendCommand('Page.getLayoutMetrics');

    // Width should match emulated width, without considering content overhang.
    // Both layoutViewport and visualViewport capture this. visualViewport accounts
    // for page zoom/scale, which we currently don't account for (or expect). So we use layoutViewport.width.
    // Note: If the page is zoomed, many assumptions fail.
    //
    // Height should be as tall as the content. So we use contentSize.height
    const width = Math.min(metrics.layoutViewport.clientWidth, MAX_SCREENSHOT_HEIGHT);
    const height = Math.min(metrics.contentSize.height, MAX_SCREENSHOT_HEIGHT);

    await driver.sendCommand('Emulation.setDeviceMetricsOverride', {
      // If we're gathering with mobile screenEmulation on (overlay scrollbars, etc), continue to use that for this screenshot.
      mobile: passContext.settings.screenEmulation.mobile,
      height,
      width,
      deviceScaleFactor: 1,
      scale: 1,
      screenOrientation: {angle: 0, type: 'portraitPrimary'},
    });

    // TODO: elements collected earlier in gathering are likely to have been shifted by now.
    // The lower in the page, the more likely (footer elements especially).
    // https://github.com/GoogleChrome/lighthouse/issues/11118

    const result = await driver.sendCommand('Page.captureScreenshot', {
      format: 'jpeg',
      quality: FULL_PAGE_SCREENSHOT_QUALITY,
    });
    const data = 'data:image/jpeg;base64,' + result.data;

    return {
      width,
      height,
      data,
    };
  }

  /**
   * Gatherers can collect details about DOM nodes, including their position on the page.
   * Layout shifts occuring after a gatherer runs can cause these positions to be incorrect,
   * resulting in a poor experience for element screenshots.
   * `getNodeDetails` maintains a collection of DOM objects in the page, which we can iterate
   * to re-collect the bounding client rectangle.
   * @see pageFunctions.getNodeDetails
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts.FullPageScreenshot['nodes']>}
   */
  async _resolveNodes(passContext) {
    function resolveNodes() {
      /** @type {LH.Artifacts.FullPageScreenshot['nodes']} */
      const nodes = {};
      if (!window.__lighthouseNodesDontTouchOrAllVarianceGoesAway) return nodes;

      const lhIdToElements = window.__lighthouseNodesDontTouchOrAllVarianceGoesAway;
      for (const [node, id] of lhIdToElements.entries()) {
        // @ts-expect-error - getBoundingClientRect put into scope via stringification
        const rect = getBoundingClientRect(node);
        if (rect.width || rect.height) nodes[id] = rect;
      }

      return nodes;
    }
    const expression = `(function () {
      ${pageFunctions.getBoundingClientRectString};
      return (${resolveNodes.toString()}());
    })()`;

    // Collect nodes with the page context (`useIsolation: false`) and with our own, reused
    // context (`useIsolation: true`). Gatherers use both modes when collecting node details,
    // so we must do the same here too.
    const pageContextResult =
      await passContext.driver.evaluateAsync(expression, {useIsolation: false});
    const isolatedContextResult =
      await passContext.driver.evaluateAsync(expression, {useIsolation: true});
    return {...pageContextResult, ...isolatedContextResult};
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['FullPageScreenshot']>}
   */
  async afterPass(passContext) {
    const {driver} = passContext;

    // In case some other program is controlling emulation, try to remember what the device looks
    // like now and reset after gatherer is done.
    const lighthouseControlsEmulation = !passContext.settings.screenEmulation.disabled;

    try {
      return {
        screenshot: await this._takeScreenshot(passContext),
        nodes: await this._resolveNodes(passContext),
      };
    } finally {
      // Revert resized page.
      if (lighthouseControlsEmulation) {
        await driver.beginEmulation(passContext.settings);
      } else {
        // Best effort to reset emulation to what it was.
        // https://github.com/GoogleChrome/lighthouse/pull/10716#discussion_r428970681
        // TODO: seems like this would be brittle. Should at least work for devtools, but what
        // about scripted puppeteer usages? Better to introduce a "setEmulation" callback
        // in the LH runner api, which for ex. puppeteer consumers would setup puppeteer emulation,
        // and then just call that to reset?
        // https://github.com/GoogleChrome/lighthouse/issues/11122
        const observedDeviceMetrics = await driver.evaluateAsync(`(function() {
          return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            screenOrientation: {
              type: window.screen.orientation.type,
              angle: window.screen.orientation.angle,
            },
            deviceScaleFactor: window.devicePixelRatio,
          };
        })()`, {useIsolation: true});
        // Convert the Web API's snake case (landscape-primary) to camel case (landscapePrimary).
        observedDeviceMetrics.screenOrientation.type =
          snakeCaseToCamelCase(observedDeviceMetrics.screenOrientation.type);
        await driver.sendCommand('Emulation.setDeviceMetricsOverride', {
          mobile: passContext.settings.formFactor === 'mobile',
          ...observedDeviceMetrics,
        });
      }
    }
  }
}

module.exports = FullPageScreenshot;
module.exports.MAX_SCREENSHOT_HEIGHT = MAX_SCREENSHOT_HEIGHT;
