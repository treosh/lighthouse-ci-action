/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import log from 'lighthouse-logger';

import BaseGatherer from '../base-gatherer.js';

class InstallabilityErrors extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * Creates an Artifacts.InstallabilityErrors, tranforming data from the protocol
   * for old versions of Chrome.
   * @param {LH.Gatherer.ProtocolSession} session
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
   * @param {LH.Gatherer.Context} context
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
