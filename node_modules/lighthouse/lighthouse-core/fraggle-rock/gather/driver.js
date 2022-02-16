/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const ProtocolSession = require('./session.js');
const ExecutionContext = require('../../gather/driver/execution-context.js');
const Fetcher = require('../../gather/fetcher.js');

/** @return {*} */
const throwNotConnectedFn = () => {
  throw new Error('Session not connected');
};

/** @type {LH.Gatherer.FRProtocolSession} */
const defaultSession = {
  setTargetInfo: throwNotConnectedFn,
  hasNextProtocolTimeout: throwNotConnectedFn,
  getNextProtocolTimeout: throwNotConnectedFn,
  setNextProtocolTimeout: throwNotConnectedFn,
  on: throwNotConnectedFn,
  once: throwNotConnectedFn,
  off: throwNotConnectedFn,
  addProtocolMessageListener: throwNotConnectedFn,
  removeProtocolMessageListener: throwNotConnectedFn,
  addSessionAttachedListener: throwNotConnectedFn,
  removeSessionAttachedListener: throwNotConnectedFn,
  sendCommand: throwNotConnectedFn,
  dispose: throwNotConnectedFn,
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
    /** @type {Fetcher|undefined} */
    this._fetcher = undefined;

    this.defaultSession = defaultSession;
  }

  /** @return {LH.Gatherer.FRTransitionalDriver['executionContext']} */
  get executionContext() {
    if (!this._executionContext) return throwNotConnectedFn();
    return this._executionContext;
  }

  /** @return {Fetcher} */
  get fetcher() {
    if (!this._fetcher) return throwNotConnectedFn();
    return this._fetcher;
  }

  /** @return {Promise<string>} */
  async url() {
    return this._page.url();
  }

  /** @return {Promise<void>} */
  async connect() {
    if (this._session) return;
    const status = {msg: 'Connecting to browser', id: 'lh:driver:connect'};
    log.time(status);
    const session = await this._page.target().createCDPSession();
    this._session = this.defaultSession = new ProtocolSession(session);
    this._executionContext = new ExecutionContext(this._session);
    this._fetcher = new Fetcher(this._session, this._executionContext);
    log.timeEnd(status);
  }

  /** @return {Promise<void>} */
  async disconnect() {
    if (!this._session) return;
    await this._session.dispose();
  }
}

module.exports = Driver;
