/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import log from 'lighthouse-logger';

import {ExecutionContext} from './driver/execution-context.js';
import {TargetManager} from './driver/target-manager.js';
import {Fetcher} from './fetcher.js';

/** @return {*} */
const throwNotConnectedFn = () => {
  throw new Error('Session not connected');
};

/** @type {LH.Gatherer.FRProtocolSession} */
const throwingSession = {
  setTargetInfo: throwNotConnectedFn,
  hasNextProtocolTimeout: throwNotConnectedFn,
  getNextProtocolTimeout: throwNotConnectedFn,
  setNextProtocolTimeout: throwNotConnectedFn,
  on: throwNotConnectedFn,
  once: throwNotConnectedFn,
  off: throwNotConnectedFn,
  sendCommand: throwNotConnectedFn,
  dispose: throwNotConnectedFn,
};

/** @implements {LH.Gatherer.FRTransitionalDriver} */
class Driver {
  /**
   * @param {LH.Puppeteer.Page} page
   */
  constructor(page) {
    this._page = page;
    /** @type {TargetManager|undefined} */
    this._targetManager = undefined;
    /** @type {ExecutionContext|undefined} */
    this._executionContext = undefined;
    /** @type {Fetcher|undefined} */
    this._fetcher = undefined;

    this.defaultSession = throwingSession;
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

  get targetManager() {
    if (!this._targetManager) return throwNotConnectedFn();
    return this._targetManager;
  }

  /** @return {Promise<string>} */
  async url() {
    return this._page.url();
  }

  /** @return {Promise<void>} */
  async connect() {
    if (this.defaultSession !== throwingSession) return;
    const status = {msg: 'Connecting to browser', id: 'lh:driver:connect'};
    log.time(status);
    const cdpSession = await this._page.target().createCDPSession();
    this._targetManager = new TargetManager(cdpSession);
    await this._targetManager.enable();
    this.defaultSession = this._targetManager.rootSession();
    this._executionContext = new ExecutionContext(this.defaultSession);
    this._fetcher = new Fetcher(this.defaultSession);
    log.timeEnd(status);
  }

  /** @return {Promise<void>} */
  async disconnect() {
    if (this.defaultSession === throwingSession) return;
    await this._targetManager?.disable();
    await this.defaultSession.dispose();
  }
}

export {Driver};
