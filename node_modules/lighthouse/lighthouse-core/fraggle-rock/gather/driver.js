/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const ProtocolSession = require('./session.js');
const ExecutionContext = require('../../gather/driver/execution-context.js');

const throwNotConnectedFn = () => {
  throw new Error('Session not connected');
};

/** @type {LH.Gatherer.FRProtocolSession} */
const defaultSession = {
  hasNextProtocolTimeout: throwNotConnectedFn,
  getNextProtocolTimeout: throwNotConnectedFn,
  setNextProtocolTimeout: throwNotConnectedFn,
  on: throwNotConnectedFn,
  once: throwNotConnectedFn,
  off: throwNotConnectedFn,
  sendCommand: throwNotConnectedFn,
};

/** @implements {LH.Gatherer.FRTransitionalDriver} */
class Driver {
  /**
   * @param {import('puppeteer').Page} page
   */
  constructor(page) {
    this._page = page;
    /** @type {LH.Gatherer.FRProtocolSession|undefined} */
    this._session = undefined;
    /** @type {ExecutionContext|undefined} */
    this._executionContext = undefined;

    this.defaultSession = defaultSession;
  }

  /** @return {Promise<void>} */
  async connect() {
    if (this._session) return;
    const session = await this._page.target().createCDPSession();
    this._session = this.defaultSession = new ProtocolSession(session);
    this._executionContext = new ExecutionContext(this._session);
  }

  /**
   * @param {string} expression
   * @param {{useIsolation?: boolean}} [options]
   * @return {Promise<*>}
   */
  async evaluateAsync(expression, options) {
    if (!this._executionContext) throw new Error('Driver not connected to page');
    return this._executionContext.evaluateAsync(expression, options);
  }
}

module.exports = Driver;
