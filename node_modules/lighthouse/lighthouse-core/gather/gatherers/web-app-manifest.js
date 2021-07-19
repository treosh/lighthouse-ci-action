/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const manifestParser = require('../../lib/manifest-parser.js');
const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');

class WebAppManifest extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.FRProtocolSession} session
   * @return {Promise<{url: string, data: string}|null>}
   */
  static async fetchAppManifest(session) {
    // In all environments but LR, Page.getAppManifest finishes very quickly.
    // In LR, there is a bug that causes this command to hang until outgoing
    // requests finish. This has been seen in long polling (where it will never
    // return) and when other requests take a long time to finish. We allow 10 seconds
    // for outgoing requests to finish. Anything more, and we continue the run without
    // a manifest.
    // Googlers, see: http://b/124008171
    session.setNextProtocolTimeout(10000);
    let response;
    try {
      response = await session.sendCommand('Page.getAppManifest');
    } catch (err) {
      if (err.code === 'PROTOCOL_TIMEOUT') {
        // LR will timeout fetching the app manifest in some cases, move on without one.
        // https://github.com/GoogleChrome/lighthouse/issues/7147#issuecomment-461210921
        log.error('WebAppManifest', 'Failed fetching manifest', err);
        return null;
      }

      throw err;
    }

    let data = response.data;

    // We're not reading `response.errors` however it may contain critical and noncritical
    // errors from Blink's manifest parser:
    //   https://chromedevtools.github.io/debugger-protocol-viewer/tot/Page/#type-AppManifestError
    if (!data) {
      // If the data is empty, the page had no manifest.
      return null;
    }

    const BOM_LENGTH = 3;
    const BOM_FIRSTCHAR = 65279;
    const isBomEncoded = data.charCodeAt(0) === BOM_FIRSTCHAR;

    if (isBomEncoded) {
      data = Buffer.from(data)
        .slice(BOM_LENGTH)
        .toString();
    }

    return {...response, data};
  }

  /**
   * Uses the debugger protocol to fetch the manifest from within the context of
   * the target page, reusing any credentials, emulation, etc, already established
   * there.
   *
   * Returns the parsed manifest or null if the page had no manifest. If the manifest
   * was unparseable as JSON, manifest.value will be undefined and manifest.warning
   * will have the reason. See manifest-parser.js for more information.
   *
   * @param {LH.Gatherer.FRProtocolSession} session
   * @param {string} pageUrl
   * @return {Promise<LH.Artifacts.Manifest|null>}
   */
  static async getWebAppManifest(session, pageUrl) {
    const status = {msg: 'Get webapp manifest', id: 'lh:gather:getWebAppManifest'};
    log.time(status);
    const response = await WebAppManifest.fetchAppManifest(session);
    if (!response) return null;
    const manifest = manifestParser(response.data, response.url, pageUrl);
    log.timeEnd(status);
    return manifest;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['WebAppManifest']>}
   */
  getArtifact(context) {
    const driver = context.driver;

    return WebAppManifest.getWebAppManifest(driver.defaultSession, context.url);
  }
}

module.exports = WebAppManifest;
