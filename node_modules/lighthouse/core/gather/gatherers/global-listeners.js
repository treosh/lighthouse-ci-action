/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview
 * A gatherer to collect information about the event listeners registered on the
 * global object. For now, the scope is narrowed to events that occur on and
 * around page unload, but this can be expanded in the future.
 */

import log from 'lighthouse-logger';

import BaseGatherer from '../base-gatherer.js';

class GlobalListeners extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'timespan', 'navigation'],
  };

  /**
   * @param {LH.Crdp.DOMDebugger.EventListener} listener
   * @return {listener is {type: 'pagehide'|'unload'|'visibilitychange'} & LH.Crdp.DOMDebugger.EventListener}
   */
  static _filterForAllowlistedTypes(listener) {
    return listener.type === 'pagehide' ||
      listener.type === 'unload' ||
      listener.type === 'visibilitychange';
  }

  /**
   * @param { LH.Artifacts.GlobalListener } listener
   * @return { string }
   */
  getListenerIndentifier(listener) {
    return `${listener.type}:${listener.scriptId}:${listener.columnNumber}:${listener.lineNumber}`;
  }

  /**
   * @param { LH.Artifacts['GlobalListeners'] } listeners
   * @return { LH.Artifacts['GlobalListeners'] }
   */
  dedupeListeners(listeners) {
    const seenListeners = new Set();
    return listeners.filter(listener => {
      const id = this.getListenerIndentifier(listener);
      if (!seenListeners.has(id)) {
        seenListeners.add(id);
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * @param {LH.Gatherer.Context} passContext
   * @return {Promise<LH.Artifacts['GlobalListeners']>}
   */
  async getArtifact(passContext) {
    const session = passContext.driver.defaultSession;

    /** @type {Array<LH.Artifacts.GlobalListener>} */
    const listeners = [];

    for (const executionContext of passContext.driver.targetManager.mainFrameExecutionContexts()) {
      // Get a RemoteObject handle to `window`.
      let objectId;
      try {
        const {result} = await session.sendCommand('Runtime.evaluate', {
          expression: 'window',
          returnByValue: false,
          uniqueContextId: executionContext.uniqueId,
        });
        if (!result.objectId) {
          throw new Error('Error fetching information about the global object');
        }
        objectId = result.objectId;
      } catch (err) {
        // Execution context is no longer valid, but don't let that fail the gatherer.
        log.warn('Execution context is no longer valid', executionContext, err);
        continue;
      }

      // And get all its listeners of interest.
      const response = await session.sendCommand('DOMDebugger.getEventListeners', {objectId});
      for (const listener of response.listeners) {
        if (GlobalListeners._filterForAllowlistedTypes(listener)) {
          const {type, scriptId, lineNumber, columnNumber} = listener;
          listeners.push({
            type,
            scriptId,
            lineNumber,
            columnNumber,
          });
        }
      }
    }

    // Dedupe listeners with same underlying data.
    return this.dedupeListeners(listeners);
  }
}

export default GlobalListeners;
