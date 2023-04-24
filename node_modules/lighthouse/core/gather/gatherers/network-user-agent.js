/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import FRGatherer from '../base-gatherer.js';
import DevtoolsLogGatherer from './devtools-log.js';

/** @implements {LH.Gatherer.FRGathererInstance<'DevtoolsLog'>} */
class NetworkUserAgent extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLogGatherer.symbol},
  };

  /**
   * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
   * @return {string}
   */
  static getNetworkUserAgent(devtoolsLog) {
    for (const entry of devtoolsLog) {
      if (entry.method !== 'Network.requestWillBeSent') continue;
      const userAgent = entry.params.request.headers['User-Agent'];
      if (userAgent) return userAgent;
    }

    return '';
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @return {Promise<LH.Artifacts['NetworkUserAgent']>}
   */
  async getArtifact(context) {
    return NetworkUserAgent.getNetworkUserAgent(context.dependencies.DevtoolsLog);
  }
}

export default NetworkUserAgent;
