/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import log from 'lighthouse-logger';

import FRGatherer from '../base-gatherer.js';

class InstallabilityErrors extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * Creates an Artifacts.InstallabilityErrors, tranforming data from the protocol
   * for old versions of Chrome.
   * @param {LH.Gatherer.FRProtocolSession} session
   * @return {Promise<LH.Artifacts['InstallabilityErrors']>}
   */
  static async getInstallabilityErrors(session) {
    const status = {
      msg: 'Get webapp installability errors',
      id: 'lh:gather:getInstallabilityErrors',
    };
    log.time(status);
    const response = await session.sendCommand('Page.getInstallabilityErrors');

    const errors = response.installabilityErrors;

    log.timeEnd(status);
    return {errors};
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['InstallabilityErrors']>}
   */
  async getArtifact(context) {
    const driver = context.driver;

    try {
      return await InstallabilityErrors.getInstallabilityErrors(driver.defaultSession);
    } catch {
      return {
        errors: [
          {errorId: 'protocol-timeout', errorArguments: []},
        ],
      };
    }
  }
}

export default InstallabilityErrors;
