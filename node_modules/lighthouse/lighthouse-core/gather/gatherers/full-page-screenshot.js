/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer.js');

// JPEG quality setting
// Exploration and examples of reports using different quality settings: https://docs.google.com/document/d/1ZSffucIca9XDW2eEwfoevrk-OTl7WQFeMf0CgeJAA8M/edit#
const FULL_PAGE_SCREENSHOT_QUALITY = 30;
// Maximum screenshot height in Chrome https://bugs.chromium.org/p/chromium/issues/detail?id=770769
const MAX_SCREENSHOT_HEIGHT = 16384;
// Maximum data URL size in Chrome https://bugs.chromium.org/p/chromium/issues/detail?id=69227
const MAX_DATA_URL_SIZE = 2 * 1024 * 1024 - 1;

/**
 * @param {string} str
 */
function snakeCaseToCamelCase(str) {
  return str.replace(/(-\w)/g, m => m[1].toUpperCase());
}

class FullPageScreenshot extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {number} maxScreenshotHeight
   * @return {Promise<LH.Artifacts.FullPageScreenshot>}
   */
  async _takeScreenshot(passContext, maxScreenshotHeight) {
    const driver = passContext.driver;
    const metrics = await driver.sendCommand('Page.getLayoutMetrics');
    const deviceScaleFactor = await driver.evaluateAsync('window.devicePixelRatio');
    const width = Math.min(metrics.contentSize.width, maxScreenshotHeight);
    const height = Math.min(metrics.contentSize.height, maxScreenshotHeight);

    await driver.sendCommand('Emulation.setDeviceMetricsOverride', {
      mobile: passContext.baseArtifacts.TestedAsMobileDevice,
      height,
      screenHeight: height,
      width,
      screenWidth: width,
      deviceScaleFactor,
      scale: 1,
      positionX: 0,
      positionY: 0,
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
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts.FullPageScreenshot | null>}
   */
  async afterPass_(passContext) {
    const deviceScaleFactor = await passContext.driver.evaluateAsync('window.devicePixelRatio');
    const maxScreenshotHeight = Math.floor(MAX_SCREENSHOT_HEIGHT / deviceScaleFactor);
    let screenshot = await this._takeScreenshot(passContext, maxScreenshotHeight);

    if (screenshot.data.length > MAX_DATA_URL_SIZE) {
      // Hitting the data URL size limit is rare, it only happens for pages on tall
      // desktop sites with lots of images.
      // So just cutting down the height a bit usually fixes the issue.
      screenshot = await this._takeScreenshot(passContext, 5000);
      if (screenshot.data.length > MAX_DATA_URL_SIZE) {
        passContext.LighthouseRunWarnings.push(
          'Full page screenshot is too big–report won\'t show element screenshots.');
        return null;
      }
    }

    return screenshot;
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['FullPageScreenshot']>}
   */
  async afterPass(passContext) {
    const {driver} = passContext;

    // In case some other program is controlling emulation, try to remember what the device looks
    // like now and reset after gatherer is done.
    const lighthouseControlsEmulation = passContext.settings.emulatedFormFactor !== 'none' &&
      !passContext.settings.internalDisableDeviceScreenEmulation;

    try {
      return await this.afterPass_(passContext);
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
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
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
          mobile: passContext.baseArtifacts.TestedAsMobileDevice, // could easily be wrong
          ...observedDeviceMetrics,
        });
      }
    }
  }
}

module.exports = FullPageScreenshot;
module.exports.MAX_SCREENSHOT_HEIGHT = MAX_SCREENSHOT_HEIGHT;
