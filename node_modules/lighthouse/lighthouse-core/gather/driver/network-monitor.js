/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview This class wires up the procotol to a network recorder and provides overall
 * status inspection state.
 */

const log = require('lighthouse-logger');
const {EventEmitter} = require('events');
const NetworkRecorder = require('../../lib/network-recorder.js');
const NetworkRequest = require('../../lib/network-request.js');
const URL = require('../../lib/url-shim.js');
const TargetManager = require('./target-manager.js');

/** @typedef {import('../../lib/network-recorder.js').NetworkRecorderEvent} NetworkRecorderEvent */
/** @typedef {'network-2-idle'|'network-critical-idle'|'networkidle'|'networkbusy'|'network-critical-busy'|'network-2-busy'} NetworkMonitorEvent_ */
/** @typedef {NetworkRecorderEvent|NetworkMonitorEvent_} NetworkMonitorEvent */
/** @typedef {Record<NetworkMonitorEvent_, []> & Record<NetworkRecorderEvent, [NetworkRequest]> & {protocolmessage: [LH.Protocol.RawEventMessage]}} NetworkMonitorEventMap */
/** @typedef {LH.Protocol.StrictEventEmitter<NetworkMonitorEventMap>} NetworkMonitorEmitter */

/** @implements {NetworkMonitorEmitter} */
class NetworkMonitor {
  /** @type {NetworkRecorder|undefined} */
  _networkRecorder = undefined;
  /** @type {TargetManager|undefined} */
  _targetManager = undefined;
  /** @type {Array<LH.Crdp.Page.Frame>} */
  _frameNavigations = [];

  /** @param {LH.Gatherer.FRProtocolSession} session */
  constructor(session) {
    this._session = session;

    this._onTargetAttached = this._onTargetAttached.bind(this);

    /** @type {Map<string, LH.Gatherer.FRProtocolSession>} */
    this._sessions = new Map();

    /** @param {LH.Crdp.Page.FrameNavigatedEvent} event */
    this._onFrameNavigated = event => this._frameNavigations.push(event.frame);

    /** @param {LH.Protocol.RawEventMessage} event */
    this._onProtocolMessage = event => {
      this.emit('protocolmessage', event);
      if (!this._networkRecorder) return;
      this._networkRecorder.dispatch(event);
    };

    // Attach the event emitter types to this class.
    const emitter = /** @type {NetworkMonitorEmitter} */ (new EventEmitter());
    /** @type {typeof emitter['emit']} */
    this.emit = emitter.emit.bind(emitter);
    /** @type {typeof emitter['on']} */
    this.on = emitter.on.bind(emitter);
    /** @type {typeof emitter['once']} */
    this.once = emitter.once.bind(emitter);
    /** @type {typeof emitter['off']} */
    this.off = emitter.off.bind(emitter);
    /** @type {typeof emitter['addListener']} */
    this.addListener = emitter.addListener.bind(emitter);
    /** @type {typeof emitter['removeListener']} */
    this.removeListener = emitter.removeListener.bind(emitter);
    /** @type {typeof emitter['removeAllListeners']} */
    this.removeAllListeners = emitter.removeAllListeners.bind(emitter);
  }

  /**
   * @param {{target: {targetId: string}, session: LH.Gatherer.FRProtocolSession}} session
   */
  async _onTargetAttached({session, target}) {
    const targetId = target.targetId;

    this._sessions.set(targetId, session);
    session.addProtocolMessageListener(this._onProtocolMessage);

    await session.sendCommand('Network.enable');
  }

  /**
   * @return {Promise<void>}
   */
  async enable() {
    if (this._targetManager) return;

    this._frameNavigations = [];
    this._sessions = new Map();
    this._networkRecorder = new NetworkRecorder();
    this._targetManager = new TargetManager(this._session);

    /**
     * Reemit the same network recorder events.
     * @param {NetworkRecorderEvent} event
     * @return {(r: NetworkRequest) => void}
     */
    const reEmit = event => r => {
      this.emit(event, r);
      this._emitNetworkStatus();
    };

    this._networkRecorder.on('requeststarted', reEmit('requeststarted'));
    this._networkRecorder.on('requestloaded', reEmit('requestloaded'));

    this._session.on('Page.frameNavigated', this._onFrameNavigated);
    this._targetManager.addTargetAttachedListener(this._onTargetAttached);

    await this._session.sendCommand('Page.enable');
    await this._targetManager.enable();
  }

  /**
   * @return {Promise<void>}
   */
  async disable() {
    if (!this._targetManager) return;

    this._session.off('Page.frameNavigated', this._onFrameNavigated);
    this._targetManager.removeTargetAttachedListener(this._onTargetAttached);

    for (const session of this._sessions.values()) {
      session.removeProtocolMessageListener(this._onProtocolMessage);
    }

    await this._targetManager.disable();

    this._frameNavigations = [];
    this._networkRecorder = undefined;
    this._targetManager = undefined;
    this._sessions = new Map();
  }

  /** @return {Promise<{requestedUrl?: string, finalUrl?: string}>} */
  async getNavigationUrls() {
    const frameNavigations = this._frameNavigations;
    if (!frameNavigations.length) return {};

    const resourceTreeResponse = await this._session.sendCommand('Page.getResourceTree');
    const mainFrameId = resourceTreeResponse.frameTree.frame.id;
    const mainFrameNavigations = frameNavigations.filter(frame => frame.id === mainFrameId);
    if (!mainFrameNavigations.length) log.warn('NetworkMonitor', 'No detected navigations');

    return {
      requestedUrl: mainFrameNavigations[0]?.url,
      finalUrl: mainFrameNavigations[mainFrameNavigations.length - 1]?.url,
    };
  }

  /**
   * @return {Array<NetworkRequest>}
   */
  getInflightRequests() {
    if (!this._networkRecorder) return [];
    return this._networkRecorder.getRawRecords().filter(request => !request.finished);
  }

  /**
   * Returns whether the network is completely idle (i.e. there are 0 inflight network requests).
   */
  isIdle() {
    return this._isActiveIdlePeriod(0);
  }

  /**
   * Returns whether any important resources for the page are in progress.
   * Above-the-fold images and XHRs should be included.
   * Tracking pixels, low priority images, and cross frame requests should be excluded.
   * @return {boolean}
   */
  isCriticalIdle() {
    if (!this._networkRecorder) return false;
    const requests = this._networkRecorder.getRawRecords();
    const rootFrameRequest = requests.find(r => r.resourceType === 'Document');
    const rootFrameId = rootFrameRequest?.frameId;

    return this._isActiveIdlePeriod(
      0,
      request =>
        request.frameId === rootFrameId &&
        (request.priority === 'VeryHigh' || request.priority === 'High')
    );
  }

  /**
   * Returns whether the network is semi-idle (i.e. there are 2 or fewer inflight network requests).
   */
  is2Idle() {
    return this._isActiveIdlePeriod(2);
  }

  /**
   * Returns whether the number of currently inflight requests is less than or
   * equal to the number of allowed concurrent requests.
   * @param {number} allowedRequests
   * @param {(request: NetworkRequest) => boolean} [requestFilter]
   * @return {boolean}
   */
  _isActiveIdlePeriod(allowedRequests, requestFilter) {
    if (!this._networkRecorder) return false;
    const requests = this._networkRecorder.getRawRecords();
    let inflightRequests = 0;

    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      if (request.finished) continue;
      if (requestFilter && !requestFilter(request)) continue;
      if (NetworkRequest.isNonNetworkRequest(request)) continue;
      inflightRequests++;
    }

    return inflightRequests <= allowedRequests;
  }

  /**
   * Emits the appropriate network status event.
   */
  _emitNetworkStatus() {
    const zeroQuiet = this.isIdle();
    const twoQuiet = this.is2Idle();
    const criticalQuiet = this.isCriticalIdle();

    this.emit(zeroQuiet ? 'networkidle' : 'networkbusy');
    this.emit(twoQuiet ? 'network-2-idle' : 'network-2-busy');
    this.emit(criticalQuiet ? 'network-critical-idle' : 'network-critical-busy');

    if (twoQuiet && zeroQuiet) log.verbose('NetworkRecorder', 'network fully-quiet');
    else if (twoQuiet && !zeroQuiet) log.verbose('NetworkRecorder', 'network semi-quiet');
    else log.verbose('NetworkRecorder', 'network busy');
  }

  /**
   * Finds all time periods where the number of inflight requests is less than or equal to the
   * number of allowed concurrent requests.
   * @param {Array<LH.Artifacts.NetworkRequest>} requests
   * @param {number} allowedConcurrentRequests
   * @param {number=} endTime
   * @return {Array<{start: number, end: number}>}
   */
  static findNetworkQuietPeriods(requests, allowedConcurrentRequests, endTime = Infinity) {
    // First collect the timestamps of when requests start and end
    /** @type {Array<{time: number, isStart: boolean}>} */
    let timeBoundaries = [];
    requests.forEach(request => {
      if (URL.isNonNetworkProtocol(request.protocol)) return;
      if (request.protocol === 'ws' || request.protocol === 'wss') return;

      // convert the network timestamp to ms
      timeBoundaries.push({time: request.startTime * 1000, isStart: true});
      if (request.finished) {
        timeBoundaries.push({time: request.endTime * 1000, isStart: false});
      }
    });

    timeBoundaries = timeBoundaries
      .filter(boundary => boundary.time <= endTime)
      .sort((a, b) => a.time - b.time);

    let numInflightRequests = 0;
    let quietPeriodStart = 0;
    /** @type {Array<{start: number, end: number}>} */
    const quietPeriods = [];
    timeBoundaries.forEach(boundary => {
      if (boundary.isStart) {
        // we've just started a new request. are we exiting a quiet period?
        if (numInflightRequests === allowedConcurrentRequests) {
          quietPeriods.push({start: quietPeriodStart, end: boundary.time});
        }
        numInflightRequests++;
      } else {
        numInflightRequests--;
        // we've just completed a request. are we entering a quiet period?
        if (numInflightRequests === allowedConcurrentRequests) {
          quietPeriodStart = boundary.time;
        }
      }
    });

    // Check we ended in a quiet period
    if (numInflightRequests <= allowedConcurrentRequests) {
      quietPeriods.push({start: quietPeriodStart, end: endTime});
    }

    return quietPeriods.filter(period => period.start !== period.end);
  }
}

module.exports = NetworkMonitor;
