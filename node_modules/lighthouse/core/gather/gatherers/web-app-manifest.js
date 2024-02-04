/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import log from 'lighthouse-logger';

import {parseManifest} from '../../lib/manifest-parser.js';
import BaseGatherer from '../base-gatherer.js';

class WebAppManifest extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.ProtocolSession} session
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
   * @param {LH.Gatherer.ProtocolSession} session
   * @param {string} pageUrl
   * @return {Promise<LH.Artifacts.Manifest|null>}
   */
  static async getWebAppManifest(session, pageUrl) {
    const status = {msg: 'Get webapp manifest', id: 'lh:gather:getWebAppManifest'};
    log.time(status);
    const response = await WebAppManifest.fetchAppManifest(session);
    if (!response) return null;
    const manifest = parseManifest(response.data, response.url, pageUrl);
    log.timeEnd(status);
    return manifest;
  }

  /**
   * @param {LH.Gatherer.Context} context
   * @return {Promise<LH.Artifacts['WebAppManifest']>}
   */
  async getArtifact(context) {
    const driver = context.driver;
    const {finalDisplayedUrl} = context.baseArtifacts.URL;
    try {
      return await WebAppManifest.getWebAppManifest(driver.defaultSession, finalDisplayedUrl);
    } catch {
      return null;
    }
  }
}

export default WebAppManifest;
