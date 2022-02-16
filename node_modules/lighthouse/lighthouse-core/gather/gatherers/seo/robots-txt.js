/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const FRGatherer = require('../../../fraggle-rock/gather/base-gatherer.js');

/* global fetch, location */

/** @return {Promise<LH.Artifacts['RobotsTxt']>} */
/* c8 ignore start */
async function getRobotsTxtContent() {
  try {
    const response = await fetch(new URL('/robots.txt', location.href).href);
    if (!response.ok) {
      return {status: response.status, content: null};
    }

    const content = await response.text();
    return {status: response.status, content};
  } catch (err) {
    return {status: null, content: null, errorMessage: err.message};
  }
}
/* c8 ignore stop */

class RobotsTxt extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<LH.Artifacts['RobotsTxt']>}
   */
  async getArtifact(passContext) {
    // Iframe fetcher still has issues with CSPs.
    // Only use the fetcher if we are fetching over the protocol.
    if (await passContext.driver.fetcher.shouldUseLegacyFetcher()) {
      return passContext.driver.executionContext.evaluate(getRobotsTxtContent, {
        args: [],
        useIsolation: true,
      });
    }

    const robotsUrl = new URL('/robots.txt', passContext.url).href;
    await passContext.driver.fetcher.enable();
    return passContext.driver.fetcher.fetchResource(robotsUrl)
      .catch(err => ({status: null, content: null, errorMessage: err.message}));
  }
}

module.exports = RobotsTxt;
