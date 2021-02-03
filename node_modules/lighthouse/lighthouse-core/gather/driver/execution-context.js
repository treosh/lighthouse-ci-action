/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const pageFunctions = require('../../lib/page-functions.js');

class ExecutionContext {
  /** @param {LH.Gatherer.FRProtocolSession} session */
  constructor(session) {
    this._session = session;

    /** @type {number|undefined} */
    this._executionContextId = undefined;

    // We use isolated execution contexts for `evaluateAsync` that can be destroyed through navigation
    // and other page actions. Cleanup our relevant bookkeeping as we see those events.
    session.on('Page.frameNavigated', () => this.clearContextId());
    session.on('Runtime.executionContextDestroyed', event => {
      if (event.executionContextId === this._executionContextId) {
        this.clearContextId();
      }
    });
  }

  /**
   * Returns the isolated context ID currently in use.
   */
  getContextId() {
    return this._executionContextId;
  }

  /**
   * Clears the remembered context ID. Use this method when we have knowledge that the runtime context
   * we were using has been destroyed by the browser and is no longer available.
   */
  clearContextId() {
    this._executionContextId = undefined;
  }

  /**
   * Returns the cached isolated execution context ID or creates a new execution context for the main
   * frame. The cached execution context is cleared on every gotoURL invocation, so a new one will
   * always be created on the first call on a new page.
   * @return {Promise<number>}
   */
  async _getOrCreateIsolatedContextId() {
    if (typeof this._executionContextId === 'number') return this._executionContextId;

    const resourceTreeResponse = await this._session.sendCommand('Page.getResourceTree');
    const mainFrameId = resourceTreeResponse.frameTree.frame.id;

    const isolatedWorldResponse = await this._session.sendCommand('Page.createIsolatedWorld', {
      frameId: mainFrameId,
      worldName: 'lighthouse_isolated_context',
    });

    this._executionContextId = isolatedWorldResponse.executionContextId;
    return isolatedWorldResponse.executionContextId;
  }


  /**
   * Evaluate an expression in the given execution context; an undefined contextId implies the main
   * page without isolation.
   * @param {string} expression
   * @param {number|undefined} contextId
   * @return {Promise<*>}
   */
  async _evaluateInContext(expression, contextId) {
    // Use a higher than default timeout if the user hasn't specified a specific timeout.
    // Otherwise, use whatever was requested.
    const timeout = this._session.hasNextProtocolTimeout() ?
      this._session.getNextProtocolTimeout() :
      60000;

    const evaluationParams = {
      // We need to explicitly wrap the raw expression for several purposes:
      // 1. Ensure that the expression will be a native Promise and not a polyfill/non-Promise.
      // 2. Ensure that errors in the expression are captured by the Promise.
      // 3. Ensure that errors captured in the Promise are converted into plain-old JS Objects
      //    so that they can be serialized properly b/c JSON.stringify(new Error('foo')) === '{}'
      expression: `(function wrapInNativePromise() {
        const __nativePromise = globalThis.__nativePromise || Promise;
        const URL = globalThis.__nativeURL || globalThis.URL;
        globalThis.__lighthouseExecutionContextId = ${contextId};
        return new __nativePromise(function (resolve) {
          return __nativePromise.resolve()
            .then(_ => ${expression})
            .catch(${pageFunctions.wrapRuntimeEvalErrorInBrowserString})
            .then(resolve);
        });
      }())`,
      includeCommandLineAPI: true,
      awaitPromise: true,
      returnByValue: true,
      timeout,
      contextId,
    };

    this._session.setNextProtocolTimeout(timeout);
    const response = await this._session.sendCommand('Runtime.evaluate', evaluationParams);
    if (response.exceptionDetails) {
      // An error occurred before we could even create a Promise, should be *very* rare.
      // Also occurs when the expression is not valid JavaScript.
      const errorMessage = response.exceptionDetails.exception ?
        response.exceptionDetails.exception.description :
        response.exceptionDetails.text;
      return Promise.reject(new Error(`Evaluation exception: ${errorMessage}`));
    }
    // Protocol should always return a 'result' object, but it is sometimes undefined.  See #6026.
    if (response.result === undefined) {
      return Promise.reject(
        new Error('Runtime.evaluate response did not contain a "result" object'));
    }
    const value = response.result.value;
    if (value && value.__failedInBrowser) {
      return Promise.reject(Object.assign(new Error(), value));
    } else {
      return value;
    }
  }

  /**
   * Evaluate an expression in the context of the current page. If useIsolation is true, the expression
   * will be evaluated in a content script that has access to the page's DOM but whose JavaScript state
   * is completely separate.
   * Returns a promise that resolves on the expression's value.
   * @param {string} expression
   * @param {{useIsolation?: boolean}=} options
   * @return {Promise<*>}
   */
  async evaluateAsync(expression, options = {}) {
    const contextId = options.useIsolation ? await this._getOrCreateIsolatedContextId() : undefined;

    try {
      // `await` is not redundant here because we want to `catch` the async errors
      return await this._evaluateInContext(expression, contextId);
    } catch (err) {
      // If we were using isolation and the context disappeared on us, retry one more time.
      if (contextId && err.message.includes('Cannot find context')) {
        this.clearContextId();
        const freshContextId = await this._getOrCreateIsolatedContextId();
        return this._evaluateInContext(expression, freshContextId);
      }

      throw err;
    }
  }

  /**
   * Evaluate a function in the context of the current page.
   * If `useIsolation` is true, the function will be evaluated in a content script that has
   * access to the page's DOM but whose JavaScript state is completely separate.
   * Returns a promise that resolves on a value of `mainFn`'s return type.
   * @template {any[]} T, R
   * @param {((...args: T) => R)} mainFn The main function to call.
   * @param {{args: T, useIsolation?: boolean, deps?: Array<Function|string>}} options `args` should
   *   match the args of `mainFn`, and can be any serializable value. `deps` are functions that must be
   *   defined for `mainFn` to work.
   * @return {Promise<R>}
   */
  evaluate(mainFn, options) {
    const argsSerialized = options.args.map(arg => JSON.stringify(arg)).join(',');
    const depsSerialized = options.deps ? options.deps.join('\n') : '';
    const expression = `(() => {
      ${depsSerialized}
      ${mainFn}
      return ${mainFn.name}(${argsSerialized});
    })()`;
    return this.evaluateAsync(expression, options);
  }
}

module.exports = ExecutionContext;
