/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview
 * This gatherer collects all network and page devtools protocol traffic during the timespan/navigation.
 * This protocol log can be used to recreate the network records using lib/network-recorder.js.
 */

import FRGatherer from '../base-gatherer.js';

class DevtoolsLog extends FRGatherer {
  static symbol = Symbol('DevtoolsLog');

  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    symbol: DevtoolsLog.symbol,
    supportedModes: ['timespan', 'navigation'],
  };

  constructor() {
    super();

    this._messageLog = new DevtoolsMessageLog(/^(Page|Network|Target|Runtime)\./);

    /** @param {LH.Protocol.RawEventMessage} e */
    this._onProtocolMessage = e => this._messageLog.record(e);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   */
  async startSensitiveInstrumentation({driver}) {
    this._messageLog.reset();
    this._messageLog.beginRecording();

    driver.targetManager.on('protocolevent', this._onProtocolMessage);
    await driver.defaultSession.sendCommand('Page.enable');
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   */
  async stopSensitiveInstrumentation({driver}) {
    this._messageLog.endRecording();
    driver.targetManager.off('protocolevent', this._onProtocolMessage);
  }

  /**
   * @return {Promise<LH.Artifacts['DevtoolsLog']>}
   */
  async getArtifact() {
    return this._messageLog.messages;
  }
}


/**
 * This class saves all protocol messages whose method match a particular
 * regex filter. Used when saving assets for later analysis by another tool such as
 * Webpagetest.
 */
class DevtoolsMessageLog {
  /**
   * @param {RegExp=} regexFilter
   */
  constructor(regexFilter) {
    this._filter = regexFilter;

    /** @type {LH.DevtoolsLog} */
    this._messages = [];
    this._isRecording = false;
  }

  /**
   * @return {LH.DevtoolsLog}
   */
  get messages() {
    return this._messages;
  }

  reset() {
    this._messages = [];
  }

  beginRecording() {
    this._isRecording = true;
  }

  endRecording() {
    this._isRecording = false;
  }

  /**
   * Records a message if method matches filter and recording has been started.
   * @param {LH.Protocol.RawEventMessage} message
   */
  record(message) {
    // We're not recording, skip the rest of the checks.
    if (!this._isRecording) return;
    // The event was likely an internal puppeteer method that uses Symbols.
    if (typeof message.method !== 'string') return;
    // The event didn't pass our filter, do not record it.
    if (this._filter && !this._filter.test(message.method)) return;

    // We passed all the checks, record the message.
    this._messages.push(message);
  }
}

export default DevtoolsLog;
export {DevtoolsMessageLog};
