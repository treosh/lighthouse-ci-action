/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {EventEmitter} from 'events';

import log from 'lighthouse-logger';

import * as LH from '../../../types/lh.js';
import {Fetcher} from '../../gather/fetcher.js';
import {ExecutionContext} from '../../gather/driver/execution-context.js';
import {LighthouseError} from '../../lib/lh-error.js';
import {fetchResponseBodyFromCache} from '../../gather/driver/network.js';
import {DevtoolsMessageLog} from '../../gather/gatherers/devtools-log.js';
import TraceGatherer from '../../gather/gatherers/trace.js';
import {getBrowserVersion} from '../../gather/driver/environment.js';
import {enableAsyncStacks} from '../../gather/driver/prepare.js';

// Controls how long to wait for a response after sending a DevTools protocol command.
const DEFAULT_PROTOCOL_TIMEOUT = 30000;

/**
 * @typedef {LH.Protocol.StrictEventEmitter<LH.CrdpEvents>} CrdpEventEmitter
 */

/**
 * @implements {LH.Gatherer.FRTransitionalDriver}
 */
class Driver {
  /**
   * @pri_vate (This should be private, but that makes our tests harder).
   * An event emitter that enforces mapping between Crdp event names and payload types.
   */
  _eventEmitter = /** @type {CrdpEventEmitter} */ (new EventEmitter());

  /**
   * @private
   * Used to save network and lifecycle protocol traffic. Just Page and Network are needed.
   */
  _devtoolsLog = new DevtoolsMessageLog(/^(Page|Network|Target|Runtime)\./);

  /**
   * @private
   * @type {Map<string, number>}
   */
  _domainEnabledCounts = new Map();

  /**
   * @type {number}
   * @private
   */
  _nextProtocolTimeout = DEFAULT_PROTOCOL_TIMEOUT;

  online = true;

  // eslint-disable-next-line no-invalid-this
  executionContext = new ExecutionContext(this);

  // eslint-disable-next-line no-invalid-this
  defaultSession = this;

  // eslint-disable-next-line no-invalid-this
  fetcher = new Fetcher(this.defaultSession);

  /**
   * @param {import('./connections/connection.js').Connection} connection
   */
  constructor(connection) {
    this._connection = connection;

    this.on('Target.attachedToTarget', event => {
      this._handleTargetAttached(event).catch(this._handleEventError);
    });

    this.on('Page.frameNavigated', event => {
      // We're only interested in setting autoattach on the root via this method.
      // `_handleTargetAttached` takes care of the recursive piece.
      if (event.frame.parentId) return;

      // Enable auto-attaching to subtargets so we receive iframe information.
      this.sendCommand('Target.setAutoAttach', {
        flatten: true,
        autoAttach: true,
        // Pause targets on startup so we don't miss anything
        waitForDebuggerOnStart: true,
      }).catch(this._handleEventError);
    });

    connection.on('protocolevent', this._handleProtocolEvent.bind(this));

    /** @private @deprecated Only available for plugin backcompat. */
    this.evaluate = this.executionContext.evaluate.bind(this.executionContext);
    /** @private @deprecated Only available for plugin backcompat. */
    this.evaluateAsync = this.executionContext.evaluateAsync.bind(this.executionContext);

    // A shim for sufficient coverage of targetManager functionality. Exposes the target
    // management that legacy driver already handles (see this._handleTargetAttached).
    this.targetManager = {
      rootSession: () => {
        return this.defaultSession;
      },
      /**
       * Bind to *any* protocol event.
       * @param {'protocolevent'} event
       * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
       */
      on: (event, callback) => {
        this._connection.on('protocolevent', callback);
      },
      /**
       * Unbind to *any* protocol event.
       * @param {'protocolevent'} event
       * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
       */
      off: (event, callback) => {
        this._connection.off('protocolevent', callback);
      },
    };
  }

  /** @deprecated - Not available on Fraggle Rock driver. */
  static get traceCategories() {
    return TraceGatherer.getDefaultTraceCategories();
  }

  /**
   * @return {Promise<LH.Crdp.Browser.GetVersionResponse & {milestone: number}>}
   */
  async getBrowserVersion() {
    return getBrowserVersion(this);
  }

  /**
   * @return {Promise<void>}
   */
  async connect() {
    const status = {msg: 'Connecting to browser', id: 'lh:init:connect'};
    log.time(status);
    await this._connection.connect();
    log.timeEnd(status);
  }

  /**
   * @return {Promise<void>}
   */
  disconnect() {
    return this._connection.disconnect();
  }

  /** @return {Promise<void>} */
  dispose() {
    return this.disconnect();
  }

  /**
   * Get the browser WebSocket endpoint for devtools protocol clients like Puppeteer.
   * Only works with WebSocket connection, not extension or devtools.
   * @return {Promise<string>}
   */
  wsEndpoint() {
    return this._connection.wsEndpoint();
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  on(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }

    // log event listeners being bound
    log.formatProtocol('listen for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.on(eventName, cb);
  }

  /**
   * Bind a one-time listener for protocol events. Listener is removed once it
   * has been called.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  once(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }
    // log event listeners being bound
    log.formatProtocol('listen once for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.once(eventName, cb);
  }

  /**
   * Unbind event listener.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {Function} cb
   */
  off(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to remove an event listener.');
    }

    this._eventEmitter.removeListener(eventName, cb);
  }

  /** @param {LH.Crdp.Target.TargetInfo} targetInfo */
  setTargetInfo(targetInfo) { // eslint-disable-line no-unused-vars
    // OOPIF handling in legacy driver is implicit.
  }

  /**
   * Debounce enabling or disabling domains to prevent driver users from
   * stomping on each other. Maintains an internal count of the times a domain
   * has been enabled. Returns false if the command would have no effect (domain
   * is already enabled or disabled), or if command would interfere with another
   * user of that domain (e.g. two gatherers have enabled a domain, both need to
   * disable it for it to be disabled). Returns true otherwise.
   * @param {string} domain
   * @param {string|undefined} sessionId
   * @param {boolean} enable
   * @return {boolean}
   * @private
   */
  _shouldToggleDomain(domain, sessionId, enable) {
    const key = domain + (sessionId || '');
    const enabledCount = this._domainEnabledCounts.get(key) || 0;
    const newCount = enabledCount + (enable ? 1 : -1);
    this._domainEnabledCounts.set(key, Math.max(0, newCount));

    // Switching to enabled or disabled, respectively.
    if ((enable && newCount === 1) || (!enable && newCount === 0)) {
      log.verbose('Driver', `${domain}.${enable ? 'enable' : 'disable'}`);
      return true;
    } else {
      if (newCount < 0) {
        log.error('Driver', `Attempted to disable domain '${domain}' when already disabled.`);
      }
      return false;
    }
  }

  /**
   * @return {boolean}
   */
  hasNextProtocolTimeout() {
    return this._nextProtocolTimeout !== DEFAULT_PROTOCOL_TIMEOUT;
  }

  /**
   * @return {number}
   */
  getNextProtocolTimeout() {
    return this._nextProtocolTimeout;
  }

  /**
   * timeout is used for the next call to 'sendCommand'.
   * NOTE: This can eventually be replaced when TypeScript
   * resolves https://github.com/Microsoft/TypeScript/issues/5453.
   * @param {number} timeout
   */
  setNextProtocolTimeout(timeout) {
    this._nextProtocolTimeout = timeout;
  }

  /**
   * @param {LH.Protocol.RawEventMessage} event
   */
  _handleProtocolEvent(event) {
    this._devtoolsLog.record(event);

    // @ts-expect-error TODO(bckenny): tsc can't type event.params correctly yet,
    // typing as property of union instead of narrowing from union of
    // properties. See https://github.com/Microsoft/TypeScript/pull/22348.
    this._eventEmitter.emit(event.method, event.params);
  }

  /**
   * @param {Error} error
   */
  _handleEventError(error) {
    log.error('Driver', 'Unhandled event error', error.message);
  }

  /**
   * @param {LH.Crdp.Target.AttachedToTargetEvent} event
   */
  async _handleTargetAttached(event) {
    // We're only interested in network requests from iframes for now as those are "part of the page".
    // If it's not an iframe, just resume it and move on.
    if (event.targetInfo.type !== 'iframe') {
      // We suspended the target when we auto-attached, so make sure it goes back to being normal.
      await this.sendCommandToSession('Runtime.runIfWaitingForDebugger', event.sessionId);
      return;
    }

    // Note: This is only reached for _out of process_ iframes (OOPIFs).
    // If the iframe is in the same process as its embedding document, that means they
    // share the same target.

    // A target won't acknowledge/respond to protocol methods (or, at least for Network.enable)
    // until it is resumed. But also we're paranoid about sending Network.enable _slightly_ too late,
    // so we issue that method first. Therefore, we don't await on this serially, but await all at once.
    await Promise.all([
      // Events from subtargets will be stringified and sent back on `Target.receivedMessageFromTarget`.
      // We want to receive information about network requests from iframes, so enable the Network domain.
      this.sendCommandToSession('Network.enable', event.sessionId),
      // We also want to receive information about subtargets of subtargets, so make sure we autoattach recursively.
      this.sendCommandToSession('Target.setAutoAttach', event.sessionId, {
        autoAttach: true,
        flatten: true,
        // Pause targets on startup so we don't miss anything
        waitForDebuggerOnStart: true,
      }),
      // We suspended the target when we auto-attached, so make sure it goes back to being normal.
      this.sendCommandToSession('Runtime.runIfWaitingForDebugger', event.sessionId),
    ]);
  }

  /**
   * Call protocol methods, with a timeout.
   * To configure the timeout for the next call, use 'setNextProtocolTimeout'.
   * If 'sessionId' is undefined, the message is sent to the main session.
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {string|undefined} sessionId
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommandToSession(method, sessionId, ...params) {
    const timeout = this._nextProtocolTimeout;
    this._nextProtocolTimeout = DEFAULT_PROTOCOL_TIMEOUT;

    /** @type {NodeJS.Timer|undefined} */
    let asyncTimeout;
    const timeoutPromise = new Promise((resolve, reject) => {
      if (timeout === Infinity) return;
      // eslint-disable-next-line max-len
      asyncTimeout = setTimeout(reject, timeout, new LighthouseError(LighthouseError.errors.PROTOCOL_TIMEOUT, {
        protocolMethod: method,
      }));
    });

    return Promise.race([
      this._innerSendCommand(method, sessionId, ...params),
      timeoutPromise,
    ]).finally(() => {
      asyncTimeout && clearTimeout(asyncTimeout);
    });
  }

  /**
   * Alias for 'sendCommandToSession(method, undefined, ...params)'
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...params) {
    return this.sendCommandToSession(method, undefined, ...params);
  }

  /**
   * Call protocol methods.
   * @private
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {string|undefined} sessionId
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  _innerSendCommand(method, sessionId, ...params) {
    const domainCommand = /^(\w+)\.(enable|disable)$/.exec(method);
    if (domainCommand) {
      const enable = domainCommand[2] === 'enable';
      if (!this._shouldToggleDomain(domainCommand[1], sessionId, enable)) {
        return Promise.resolve();
      }
    }
    return this._connection.sendCommand(method, sessionId, ...params);
  }

  /**
   * Returns whether a domain is currently enabled.
   * @param {string} domain
   * @return {boolean}
   */
  isDomainEnabled(domain) {
    // Defined, non-zero elements of the domains map are enabled.
    return !!this._domainEnabledCounts.get(domain);
  }

  /**
   * Return the body of the response with the given ID. Rejects if getting the
   * body times out.
   * @param {string} requestId
   * @param {number} [timeout]
   * @return {Promise<string>}
   */
  async getRequestContent(requestId, timeout = 1000) {
    return fetchResponseBodyFromCache(this.defaultSession, requestId, timeout);
  }

  /**
   * @param {{additionalTraceCategories?: string|null}=} settings
   * @return {Promise<void>}
   */
  async beginTrace(settings) {
    const additionalCategories = (settings?.additionalTraceCategories &&
        settings.additionalTraceCategories.split(',')) || [];
    const traceCategories = TraceGatherer.getDefaultTraceCategories().concat(additionalCategories);

    const uniqueCategories = Array.from(new Set(traceCategories));

    // Check any domains that could interfere with or add overhead to the trace.
    if (this.isDomainEnabled('CSS')) {
      throw new Error('CSS domain enabled when starting trace');
    }
    if (this.isDomainEnabled('DOM')) {
      throw new Error('DOM domain enabled when starting trace');
    }

    // Enable Page domain to wait for Page.loadEventFired
    return this.sendCommand('Page.enable')
      .then(_ => this.sendCommand('Tracing.start', {
        categories: uniqueCategories.join(','),
        options: 'sampling-frequency=10000', // 1000 is default and too slow.
      }));
  }

  /**
   * @return {Promise<LH.Trace>}
   */
  endTrace() {
    return TraceGatherer.endTraceAndCollectEvents(this.defaultSession);
  }

  /**
   * Begin recording devtools protocol messages.
   */
  async beginDevtoolsLog() {
    this._disableAsyncStacks = await enableAsyncStacks(this);
    this._devtoolsLog.reset();
    this._devtoolsLog.beginRecording();
  }

  /**
   * Stop recording to devtoolsLog and return log contents.
   * @return {Promise<LH.DevtoolsLog>}
   */
  async endDevtoolsLog() {
    this._devtoolsLog.endRecording();
    await this._disableAsyncStacks?.();
    return this._devtoolsLog.messages;
  }

  async url() {
    const {frameTree} = await this.sendCommand('Page.getFrameTree');
    return `${frameTree.frame.url}${frameTree.frame.urlFragment || ''}`;
  }
}

export {Driver};
