/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Gathers all entries logged to the console, including console API calls,
 * exceptions, and browser reports (on violations, interventions, deprecations, etc.).
 */

'use strict';

const Gatherer = require('./gatherer.js');

/**
 * @param {LH.Crdp.Runtime.RemoteObject} obj
 * @return {string}
 */
function remoteObjectToString(obj) {
  if (typeof obj.value !== 'undefined' || obj.type === 'undefined') {
    return String(obj.value);
  }
  if (typeof obj.description === 'string' && obj.description !== obj.className) {
    return obj.description;
  }
  const type = obj.subtype || obj.type;
  const className = obj.className || 'Object';
  // Simulate calling String() on the object.
  return `[${type} ${className}]`;
}

class ConsoleMessages extends Gatherer {
  constructor() {
    super();
    /** @type {LH.Artifacts.ConsoleMessage[]} */
    this._logEntries = [];

    this._onConsoleAPICalled = this.onConsoleAPICalled.bind(this);
    this._onExceptionThrown = this.onExceptionThrown.bind(this);
    this._onLogEntryAdded = this.onLogEntry.bind(this);
  }

  /**
   * Handles events for when a script invokes a console API.
   * @param {LH.Crdp.Runtime.ConsoleAPICalledEvent} event
   */
  onConsoleAPICalled(event) {
    const {type} = event;
    if (type !== 'warning' && type !== 'error') {
      // Only gather warnings and errors for brevity.
      return;
    }
    /** @type {LH.Crdp.Runtime.RemoteObject[]} */
    const args = event.args || [];
    const text = args.map(remoteObjectToString).join(' ');
    if (!text && !event.stackTrace) {
      // No useful information from Chrome. Skip.
      return;
    }
    const {url, lineNumber, columnNumber} =
      event.stackTrace && event.stackTrace.callFrames[0] || {};
    /** @type {LH.Artifacts.ConsoleMessage} */
    const consoleMessage = {
      eventType: 'consoleAPI',
      source: type === 'warning' ? 'console.warn' : 'console.error',
      level: type,
      text,
      stackTrace: event.stackTrace,
      timestamp: event.timestamp,
      url,
      lineNumber,
      columnNumber,
    };
    this._logEntries.push(consoleMessage);
  }

  /**
   * Handles exception thrown events.
   * @param {LH.Crdp.Runtime.ExceptionThrownEvent} event
   */
  onExceptionThrown(event) {
    const text = event.exceptionDetails.exception ?
          event.exceptionDetails.exception.description : event.exceptionDetails.text;
    if (!text) {
      return;
    }
    /** @type {LH.Artifacts.ConsoleMessage} */
    const consoleMessage = {
      eventType: 'exception',
      source: 'exception',
      level: 'error',
      text,
      stackTrace: event.exceptionDetails.stackTrace,
      timestamp: event.timestamp,
      url: event.exceptionDetails.url,
      lineNumber: event.exceptionDetails.lineNumber,
      columnNumber: event.exceptionDetails.columnNumber,
    };
    this._logEntries.push(consoleMessage);
  }

  /**
   * Handles browser reports logged to the console, including interventions,
   * deprecations, violations, and more.
   * @param {LH.Crdp.Log.EntryAddedEvent} event
   */
  onLogEntry(event) {
    const {source, level, text, stackTrace, timestamp, url, lineNumber} = event.entry;
    this._logEntries.push({
      eventType: 'protocolLog',
      source,
      level,
      text,
      stackTrace,
      timestamp,
      url,
      lineNumber,
    });
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   */
  async beforePass(passContext) {
    const driver = passContext.driver;

    driver.on('Log.entryAdded', this._onLogEntryAdded);
    await driver.sendCommand('Log.enable');
    await driver.sendCommand('Log.startViolationsReport', {
      config: [{name: 'discouragedAPIUse', threshold: -1}],
    });

    driver.on('Runtime.consoleAPICalled', this._onConsoleAPICalled);
    driver.on('Runtime.exceptionThrown', this._onExceptionThrown);
    await driver.sendCommand('Runtime.enable');
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['ConsoleMessages']>}
   */
  async afterPass({driver}) {
    await driver.sendCommand('Log.stopViolationsReport');
    await driver.off('Log.entryAdded', this._onLogEntryAdded);
    await driver.sendCommand('Log.disable');
    await driver.off('Runtime.consoleAPICalled', this._onConsoleAPICalled);
    await driver.off('Runtime.exceptionThrown', this._onExceptionThrown);
    await driver.sendCommand('Runtime.disable');
    return this._logEntries;
  }
}

module.exports = ConsoleMessages;
