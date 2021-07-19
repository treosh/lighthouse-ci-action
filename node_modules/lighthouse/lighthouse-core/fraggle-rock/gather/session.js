/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const SessionEmitMonkeypatch = Symbol('monkeypatch');

/** @implements {LH.Gatherer.FRProtocolSession} */
class ProtocolSession {
  /**
   * @param {import('puppeteer').CDPSession} session
   */
  constructor(session) {
    this._session = session;

    // FIXME: Monkeypatch puppeteer to be able to listen to *all* protocol events.
    // This patched method will now emit a copy of every event on `*`.
    const originalEmit = session.emit;
    // @ts-expect-error - Test for the monkeypatch.
    if (originalEmit[SessionEmitMonkeypatch]) return;
    session.emit = (method, ...args) => {
      originalEmit.call(session, '*', {method, params: args[0]});
      return originalEmit.call(session, method, ...args);
    };
    // @ts-expect-error - It's monkeypatching 🤷‍♂️.
    session.emit[SessionEmitMonkeypatch] = true;
  }

  /**
   * @return {boolean}
   */
  hasNextProtocolTimeout() {
    return false;
  }

  /**
   * @return {number}
   */
  getNextProtocolTimeout() {
    return Number.MAX_SAFE_INTEGER;
  }

  /**
   * @param {number} ms
   */
  setNextProtocolTimeout(ms) { // eslint-disable-line no-unused-vars
    // TODO(FR-COMPAT): support protocol timeout
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} callback
   */
  on(eventName, callback) {
    this._session.on(eventName, /** @type {*} */ (callback));
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} callback
   */
  once(eventName, callback) {
    this._session.once(eventName, /** @type {*} */ (callback));
  }

  /**
   * Bind to our custom event that fires for *any* protocol event.
   * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
   */
  addProtocolMessageListener(callback) {
    this._session.on('*', /** @type {*} */ (callback));
  }

  /**
   * Unbind to our custom event that fires for *any* protocol event.
   * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
   */
  removeProtocolMessageListener(callback) {
    this._session.off('*', /** @type {*} */ (callback));
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} callback
   */
  off(eventName, callback) {
    this._session.off(eventName, /** @type {*} */ (callback));
  }

  /**
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...params) {
    return this._session.send(method, ...params);
  }
}

module.exports = ProtocolSession;
