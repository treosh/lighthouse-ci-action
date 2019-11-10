/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// eslint-disable-next-line spaced-comment
/// <reference types="chrome" />
'use strict';

const Connection = require('./connection.js');
const log = require('lighthouse-logger');

/* globals chrome */

class ExtensionConnection extends Connection {
  constructor() {
    super();
    this._tabId = null;

    this._onEvent = this._onEvent.bind(this);
    this._onUnexpectedDetach = this._onUnexpectedDetach.bind(this);
  }

  /**
   * @param {chrome.debugger.Debuggee} source
   * @param {string} method
   * @param {object=} params
   * @private
   */
  _onEvent(source, method, params) {
    // log events received
    log.log('<=', method, params);

    // Warning: type cast, assuming that debugger API is giving us a valid protocol event.
    // Must be cast together since types of `params` and `method` come as a pair.
    const eventMessage = /** @type {LH.Protocol.RawEventMessage} */({method, params});
    this.emitProtocolEvent(eventMessage);
  }

  /**
   * @param {chrome.debugger.Debuggee} source
   * @param {string} detachReason
   * @return {never}
   * @private
   */
  _onUnexpectedDetach(source, detachReason) {
    this._detachCleanup();
    throw new Error('Lighthouse detached from browser: ' + detachReason);
  }

  /**
   * @private
   */
  _detachCleanup() {
    this._tabId = null;
    chrome.debugger.onEvent.removeListener(this._onEvent);
    chrome.debugger.onDetach.removeListener(this._onUnexpectedDetach);
    this.dispose();
  }

  /**
   * @override
   * @return {Promise<void>}
   */
  connect() {
    if (this._tabId !== null) {
      return Promise.resolve();
    }

    return this._getCurrentTabId()
      .then(tabId => {
        this._tabId = tabId;
        chrome.debugger.onEvent.addListener(this._onEvent);
        chrome.debugger.onDetach.addListener(this._onUnexpectedDetach);

        return new Promise((resolve, reject) => {
          chrome.debugger.attach({tabId}, '1.1', () => {
            if (chrome.runtime.lastError) {
              return reject(new Error(chrome.runtime.lastError.message));
            }
            resolve();
          });
        });
      });
  }

  /**
   * @override
   * @return {Promise<void>}
   */
  disconnect() {
    if (this._tabId === null) {
      log.warn('ExtensionConnection', 'disconnect() was called without an established connection.');
      return Promise.resolve();
    }

    const tabId = this._tabId;
    return new Promise((resolve, reject) => {
      chrome.debugger.detach({tabId}, () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        // Reload the target page to restore its state.
        chrome.tabs.reload(tabId);
        resolve();
      });
    }).then(_ => this._detachCleanup());
  }

  /**
   * Call protocol methods.
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} paramArgs,
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...paramArgs) {
    // Reify params since we need it as a property so can't just spread again.
    const params = paramArgs.length ? paramArgs[0] : undefined;

    return new Promise((resolve, reject) => {
      log.formatProtocol('method => browser', {method, params}, 'verbose');
      if (!this._tabId) {
        log.error('ExtensionConnection', 'No tabId set for sendCommand');
        return reject(new Error('No tabId set for sendCommand'));
      }

      chrome.debugger.sendCommand({tabId: this._tabId}, method, params || {}, result => {
        if (chrome.runtime.lastError) {
          // The error from the extension has a `message` property that is the
          // stringified version of the actual protocol error object.
          const message = chrome.runtime.lastError.message || '';
          let errorMessage;
          try {
            errorMessage = JSON.parse(message).message;
          } catch (e) {}
          errorMessage = errorMessage || message || 'Unknown debugger protocol error.';

          log.formatProtocol('method <= browser ERR', {method}, 'error');
          return reject(new Error(`Protocol error (${method}): ${errorMessage}`));
        }

        log.formatProtocol('method <= browser OK', {method, params: result}, 'verbose');
        resolve(result);
      });
    });
  }

  /**
   * @return {Promise<chrome.tabs.Tab>}
   * @private
   */
  _queryCurrentTab() {
    return new Promise((resolve, reject) => {
      const queryOpts = {
        active: true,
        currentWindow: true,
      };

      chrome.tabs.query(queryOpts, (tabs => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        const errMessage = 'Couldn\'t resolve current tab. Check your URL, reload, and try again.';
        if (tabs.length === 0) {
          return reject(new Error(errMessage));
        }
        if (tabs.length > 1) {
          log.warn('ExtensionConnection', '_queryCurrentTab returned multiple tabs');
        }

        const firstUrledTab = tabs.find(tab => !!tab.url);
        if (!firstUrledTab) {
          const tabIds = tabs.map(tab => tab.id).join(', ');
          const message = errMessage + ` Found ${tabs.length} tab(s) with id(s) [${tabIds}].`;
          return reject(new Error(message));
        }

        resolve(firstUrledTab);
      }));
    });
  }

  /**
   * @return {Promise<number>}
   * @private
   */
  _getCurrentTabId() {
    return this._queryCurrentTab().then(tab => {
      if (tab.id === undefined) {
        throw new Error('Unable to resolve current tab ID. Check the tab, reload, and try again.');
      }

      return tab.id;
    });
  }

  /**
   * Used by extension-entry to kick off the run on the current page
   * @return {Promise<string>}
   */
  getCurrentTabURL() {
    return this._queryCurrentTab().then(tab => {
      if (!tab.url) {
        log.error('ExtensionConnection', 'getCurrentTabURL returned empty string', tab);
        throw new Error('getCurrentTabURL returned empty string');
      }
      return tab.url;
    });
  }
}

module.exports = ExtensionConnection;
