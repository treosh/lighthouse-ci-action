/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const LHError = require('../../lib/lh-error.js');
const SessionEmitMonkeypatch = Symbol('monkeypatch');

// Controls how long to wait for a response after sending a DevTools protocol command.
const DEFAULT_PROTOCOL_TIMEOUT = 30000;

/** @implements {LH.Gatherer.FRProtocolSession} */
class ProtocolSession {
  /**
   * @param {import('puppeteer').CDPSession} session
   */
  constructor(session) {
    this._session = session;
    /** @type {LH.Crdp.Target.TargetInfo|undefined} */
    this._targetInfo = undefined;
    /** @type {number|undefined} */
    this._nextProtocolTimeout = undefined;
    /** @type {WeakMap<any, any>} */
    this._callbackMap = new WeakMap();

    // FIXME: Monkeypatch puppeteer to be able to listen to *all* protocol events.
    // This patched method will now emit a copy of every event on `*`.
    const originalEmit = session.emit;
    // @ts-expect-error - Test for the monkeypatch.
    if (originalEmit[SessionEmitMonkeypatch]) return;
    session.emit = (method, ...args) => {
      // OOPIF sessions need to emit their sessionId so downstream processors can recognize
      // the target the event came from.
      const sessionId = this._targetInfo && this._targetInfo.type === 'iframe' ?
        this._targetInfo.targetId : undefined;
      originalEmit.call(session, '*', {method, params: args[0], sessionId});
      return originalEmit.call(session, method, ...args);
    };
    // @ts-expect-error - It's monkeypatching 🤷‍♂️.
    session.emit[SessionEmitMonkeypatch] = true;
  }

  /** @param {LH.Crdp.Target.TargetInfo} targetInfo */
  setTargetInfo(targetInfo) {
    this._targetInfo = targetInfo;
  }

  /**
   * @return {boolean}
   */
  hasNextProtocolTimeout() {
    return this._nextProtocolTimeout !== undefined;
  }

  /**
   * @return {number}
   */
  getNextProtocolTimeout() {
    return this._nextProtocolTimeout || DEFAULT_PROTOCOL_TIMEOUT;
  }

  /**
   * @param {number} ms
   */
  setNextProtocolTimeout(ms) {
    this._nextProtocolTimeout = ms;
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
   * Bind to the puppeteer `sessionattached` listener and return an LH ProtocolSession.
   * @param {(session: ProtocolSession) => void} callback
   */
  addSessionAttachedListener(callback) {
    /** @param {import('puppeteer').CDPSession} session */
    const listener = session => callback(new ProtocolSession(session));
    this._callbackMap.set(callback, listener);
    this._getConnection().on('sessionattached', listener);
  }

  /**
   * Unbind to the puppeteer `sessionattached` listener.
   * @param {(session: ProtocolSession) => void} callback
   */
  removeSessionAttachedListener(callback) {
    const listener = this._callbackMap.get(callback);
    if (!listener) return;
    this._getConnection().off('sessionattached', listener);
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
    const timeoutMs = this.getNextProtocolTimeout();
    this._nextProtocolTimeout = undefined;

    /** @type {NodeJS.Timer|undefined} */
    let timeout;
    const timeoutPromise = new Promise((resolve, reject) => {
      if (timeoutMs === Infinity) return;

      timeout = setTimeout(reject, timeoutMs, new LHError(LHError.errors.PROTOCOL_TIMEOUT, {
        protocolMethod: method,
      }));
    });

    const resultPromise = this._session.send(method, ...params);
    const resultWithTimeoutPromise = Promise.race([resultPromise, timeoutPromise]);

    return resultWithTimeoutPromise.finally(() => {
      if (timeout) clearTimeout(timeout);
    });
  }

  /**
   * Disposes of a session so that it can no longer talk to Chrome.
   * @return {Promise<void>}
   */
  async dispose() {
    this._session.removeAllListeners();
    await this._session.detach();
  }

  _getConnection() {
    const connection = this._session.connection();
    if (!connection) throw new Error('Connection has been closed.');
    return connection;
  }
}

module.exports = ProtocolSession;
