/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview This class tracks multiple targets (the page itself and its OOPIFs) and allows consumers to
 * listen for protocol events before each target is resumed.
 */

import EventEmitter from 'events';

import log from 'lighthouse-logger';

import {ProtocolSession} from '../session.js';

/**
 * @typedef {{
 *   target: LH.Crdp.Target.TargetInfo,
 *   cdpSession: LH.Puppeteer.CDPSession,
 *   session: LH.Gatherer.FRProtocolSession,
 *   protocolListener: (event: unknown) => void,
 * }} TargetWithSession
 */

// Add protocol event types to EventEmitter.
/** @typedef {{'protocolevent': [LH.Protocol.RawEventMessage]}} ProtocolEventMap */
/** @typedef {LH.Protocol.StrictEventEmitterClass<ProtocolEventMap>} ProtocolEventMessageEmitter */
const ProtocolEventEmitter = /** @type {ProtocolEventMessageEmitter} */ (EventEmitter);

/**
 * Tracks targets (the page itself, its iframes, their iframes, etc) as they
 * appear and allows listeners to the flattened protocol events from all targets.
 */
class TargetManager extends ProtocolEventEmitter {
  /** @param {LH.Puppeteer.CDPSession} cdpSession */
  constructor(cdpSession) {
    super();

    this._enabled = false;
    this._rootCdpSession = cdpSession;

    /**
     * A map of target id to target/session information. Used to ensure unique
     * attached targets.
     * @type {Map<string, TargetWithSession>}
     */
    this._targetIdToTargets = new Map();

    this._onSessionAttached = this._onSessionAttached.bind(this);
    this._onFrameNavigated = this._onFrameNavigated.bind(this);
  }

  /**
   * @param {LH.Crdp.Page.FrameNavigatedEvent} frameNavigatedEvent
   */
  async _onFrameNavigated(frameNavigatedEvent) {
    // Child frames are handled in `_onSessionAttached`.
    if (frameNavigatedEvent.frame.parentId) return;
    if (!this._enabled) return;

    // It's not entirely clear when this is necessary, but when the page switches processes on
    // navigating from about:blank to the `requestedUrl`, resetting `setAutoAttach` has been
    // necessary in the past.
    try {
      await this._rootCdpSession.send('Target.setAutoAttach', {
        autoAttach: true,
        flatten: true,
        waitForDebuggerOnStart: true,
      });
    } catch (err) {
      // The page can be closed at the end of the run before this CDP function returns.
      // In these cases, just ignore the error since we won't need the page anyway.
      if (this._enabled) throw err;
    }
  }

  /**
   * @param {string} sessionId
   * @return {LH.Gatherer.FRProtocolSession}
   */
  _findSession(sessionId) {
    for (const {session, cdpSession} of this._targetIdToTargets.values()) {
      if (cdpSession.id() === sessionId) return session;
    }

    throw new Error(`session ${sessionId} not found`);
  }

  /**
   * Returns the root session.
   * @return {LH.Gatherer.FRProtocolSession}
   */
  rootSession() {
    const rootSessionId = this._rootCdpSession.id();
    return this._findSession(rootSessionId);
  }

  /**
   * @param {LH.Puppeteer.CDPSession} cdpSession
   */
  async _onSessionAttached(cdpSession) {
    const newSession = new ProtocolSession(cdpSession);

    try {
      const target = await newSession.sendCommand('Target.getTargetInfo').catch(() => null);
      const targetType = target?.targetInfo?.type;
      const hasValidTargetType = targetType === 'page' || targetType === 'iframe';
      // TODO: should detach from target in this case?
      // See pptr: https://github.com/puppeteer/puppeteer/blob/733cbecf487c71483bee8350e37030edb24bc021/src/common/Page.ts#L495-L526
      if (!target || !hasValidTargetType) return;

      // No need to continue if target has already been seen.
      const targetId = target.targetInfo.targetId;
      if (this._targetIdToTargets.has(targetId)) return;

      newSession.setTargetInfo(target.targetInfo);
      const targetName = target.targetInfo.url || target.targetInfo.targetId;
      log.verbose('target-manager', `target ${targetName} attached`);

      const trueProtocolListener = this._getProtocolEventListener(newSession.id());
      /** @type {(event: unknown) => void} */
      // @ts-expect-error - pptr currently typed only for single arg emits.
      const protocolListener = trueProtocolListener;
      cdpSession.on('*', protocolListener);
      cdpSession.on('sessionattached', this._onSessionAttached);

      const targetWithSession = {
        target: target.targetInfo,
        cdpSession,
        session: newSession,
        protocolListener,
      };
      this._targetIdToTargets.set(targetId, targetWithSession);

      // We want to receive information about network requests from iframes, so enable the Network domain.
      await newSession.sendCommand('Network.enable');
      // We also want to receive information about subtargets of subtargets, so make sure we autoattach recursively.
      await newSession.sendCommand('Target.setAutoAttach', {
        autoAttach: true,
        flatten: true,
        waitForDebuggerOnStart: true,
      });
    } catch (err) {
      // Sometimes targets can be closed before we even have a chance to listen to their network activity.
      if (/Target closed/.test(err.message)) return;

      throw err;
    } finally {
      // Resume the target if it was paused, but if it's unnecessary, we don't care about the error.
      await newSession.sendCommand('Runtime.runIfWaitingForDebugger').catch(() => {});
    }
  }

  /**
   * Returns a listener for all protocol events from session, and augments the
   * event with the sessionId.
   * @param {string} sessionId
   */
  _getProtocolEventListener(sessionId) {
    /**
     * @template {keyof LH.Protocol.RawEventMessageRecord} EventName
     * @param {EventName} method
     * @param {LH.Protocol.RawEventMessageRecord[EventName]['params']} params
     */
    const onProtocolEvent = (method, params) => {
      // Cast because tsc 4.7 still can't quite track the dependent parameters.
      const payload = /** @type {LH.Protocol.RawEventMessage} */ ({method, params, sessionId});
      this.emit('protocolevent', payload);
    };

    return onProtocolEvent;
  }

  /**
   * @return {Promise<void>}
   */
  async enable() {
    if (this._enabled) return;

    this._enabled = true;
    this._targetIdToTargets = new Map();

    this._rootCdpSession.on('Page.frameNavigated', this._onFrameNavigated);

    await this._rootCdpSession.send('Page.enable');

    // Start with the already attached root session.
    await this._onSessionAttached(this._rootCdpSession);
  }

  /**
   * @return {Promise<void>}
   */
  async disable() {
    this._rootCdpSession.off('Page.frameNavigated', this._onFrameNavigated);

    for (const {cdpSession, protocolListener} of this._targetIdToTargets.values()) {
      cdpSession.off('*', protocolListener);
      cdpSession.off('sessionattached', this._onSessionAttached);
    }

    this._enabled = false;
    this._targetIdToTargets = new Map();
  }
}

export {TargetManager};
