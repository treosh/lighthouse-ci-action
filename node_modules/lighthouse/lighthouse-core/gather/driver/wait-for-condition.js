/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const LHError = require('../../lib/lh-error.js');
const ExecutionContext = require('./execution-context.js');
const pageFunctions = require('../../lib/page-functions.js');

/** @typedef {import('../../lib/network-recorder.js')} NetworkRecorder */
/** @typedef {import('../../lib/network-recorder.js').NetworkRecorderEvent} NetworkRecorderEvent */
/** @typedef {{promise: Promise<void>, cancel: function(): void}} CancellableWait */

/**
 * @typedef WaitOptions
 * @prop {number} pauseAfterFcpMs
 * @prop {number} pauseAfterLoadMs
 * @prop {number} networkQuietThresholdMs
 * @prop {number} cpuQuietThresholdMs
 * @prop {number} maxWaitForLoadedMs
 * @prop {number|undefined} maxWaitForFcpMs
 * @prop {{waitForFcp: typeof waitForFcp, waitForLoadEvent: typeof waitForLoadEvent, waitForNetworkIdle: typeof waitForNetworkIdle, waitForCPUIdle: typeof waitForCPUIdle}} [_waitForTestOverrides]
 */

/**
 * Returns a promise that resolves immediately.
 * Used for placeholder conditions that we don't want to start waiting for just yet, but still want
 * to satisfy the same interface.
 * @return {{promise: Promise<void>, cancel: function(): void}}
 */
function waitForNothing() {
  return {promise: Promise.resolve(), cancel() {}};
}

/**
 * Returns a promise that resolve when a frame has been navigated.
 * Used for detecting that our about:blank reset has been completed.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {CancellableWait}
 */
function waitForFrameNavigated(session) {
  /** @type {(() => void)} */
  let cancel = () => {
    throw new Error('waitForFrameNavigated.cancel() called before it was defined');
  };

  const promise = new Promise((resolve, reject) => {
    session.once('Page.frameNavigated', resolve);
    cancel = () => {
      session.off('Page.frameNavigated', resolve);
      reject(new Error('Wait for navigated cancelled'));
    };
  });

  return {promise, cancel};
}

/**
 * Returns a promise that resolve when a frame has a FCP.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {number} pauseAfterFcpMs
 * @param {number} maxWaitForFcpMs
 * @return {CancellableWait}
 */
function waitForFcp(session, pauseAfterFcpMs, maxWaitForFcpMs) {
  /** @type {(() => void)} */
  let cancel = () => {
    throw new Error('waitForFcp.cancel() called before it was defined');
  };

  /** @type {Promise<void>} */
  const promise = new Promise((resolve, reject) => {
    const maxWaitTimeout = setTimeout(() => {
      reject(new LHError(LHError.errors.NO_FCP));
    }, maxWaitForFcpMs);
    /** @type {NodeJS.Timeout|undefined} */
    let loadTimeout;

    /** @param {LH.Crdp.Page.LifecycleEventEvent} e */
    const lifecycleListener = e => {
      if (e.name === 'firstContentfulPaint') {
        loadTimeout = setTimeout(() => {
          resolve();
          cancel();
        }, pauseAfterFcpMs);
      }
    };

    session.on('Page.lifecycleEvent', lifecycleListener);

    let canceled = false;
    cancel = () => {
      if (canceled) return;
      canceled = true;
      session.off('Page.lifecycleEvent', lifecycleListener);
      maxWaitTimeout && clearTimeout(maxWaitTimeout);
      loadTimeout && clearTimeout(loadTimeout);
      reject(new Error('Wait for FCP canceled'));
    };
  });

  return {
    promise,
    cancel,
  };
}

/**
 * Returns a promise that resolves when the network has been idle (after DCL) for
 * `networkQuietThresholdMs` ms and a method to cancel internal network listeners/timeout.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {NetworkRecorder} networkMonitor
 * @param {{networkQuietThresholdMs: number, busyEvent: NetworkRecorderEvent, idleEvent: NetworkRecorderEvent, isIdle(recorder: NetworkRecorder): boolean}} networkQuietOptions
 * @return {CancellableWait}
 */
function waitForNetworkIdle(session, networkMonitor, networkQuietOptions) {
  let hasDCLFired = false;
  /** @type {NodeJS.Timer|undefined} */
  let idleTimeout;
  /** @type {(() => void)} */
  let cancel = () => {
    throw new Error('waitForNetworkIdle.cancel() called before it was defined');
  };

  const {networkQuietThresholdMs, busyEvent, idleEvent, isIdle} = networkQuietOptions;

  /** @type {Promise<void>} */
  const promise = new Promise((resolve, reject) => {
    const onIdle = () => {
      // eslint-disable-next-line no-use-before-define
      networkMonitor.once(busyEvent, onBusy);
      idleTimeout = setTimeout(() => {
        cancel();
        resolve();
      }, networkQuietThresholdMs);
    };

    const onBusy = () => {
      networkMonitor.once(idleEvent, onIdle);
      idleTimeout && clearTimeout(idleTimeout);
    };

    const domContentLoadedListener = () => {
      hasDCLFired = true;
      if (isIdle(networkMonitor)) {
        onIdle();
      } else {
        onBusy();
      }
    };

    // We frequently need to debug why LH is still waiting for the page.
    // This listener is added to all network events to verbosely log what URLs we're waiting on.
    const logStatus = () => {
      if (!hasDCLFired) {
        log.verbose('waitFor', 'Waiting on DomContentLoaded');
        return;
      }

      const inflightRecords = networkMonitor.getInflightRecords();
      // If there are more than 20 inflight requests, load is still in full swing.
      // Wait until it calms down a bit to be a little less spammy.
      if (inflightRecords.length < 20) {
        for (const record of inflightRecords) {
          log.verbose('waitFor', `Waiting on ${record.url.slice(0, 120)} to finish`);
        }
      }
    };

    networkMonitor.on('requeststarted', logStatus);
    networkMonitor.on('requestloaded', logStatus);
    networkMonitor.on(busyEvent, logStatus);

    session.once('Page.domContentEventFired', domContentLoadedListener);
    let canceled = false;
    cancel = () => {
      if (canceled) return;
      canceled = true;
      idleTimeout && clearTimeout(idleTimeout);
      session.off('Page.domContentEventFired', domContentLoadedListener);
      networkMonitor.removeListener(busyEvent, onBusy);
      networkMonitor.removeListener(idleEvent, onIdle);
      networkMonitor.removeListener('requeststarted', logStatus);
      networkMonitor.removeListener('requestloaded', logStatus);
      networkMonitor.removeListener(busyEvent, logStatus);
    };
  });

  return {
    promise,
    cancel,
  };
}

/**
 * Resolves when there have been no long tasks for at least waitForCPUQuiet ms.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {number} waitForCPUQuiet
 * @return {CancellableWait}
 */
function waitForCPUIdle(session, waitForCPUQuiet) {
  if (!waitForCPUQuiet) {
    return {
      promise: Promise.resolve(),
      cancel: () => undefined,
    };
  }

  /** @type {NodeJS.Timer|undefined} */
  let lastTimeout;
  let canceled = false;

  const checkForQuietExpression = `(${pageFunctions.checkTimeSinceLastLongTaskString})()`;
  /**
   * @param {ExecutionContext} executionContext
   * @param {() => void} resolve
   * @return {Promise<void>}
   */
  async function checkForQuiet(executionContext, resolve) {
    if (canceled) return;
    const timeSinceLongTask = await executionContext.evaluateAsync(checkForQuietExpression);
    if (canceled) return;

    if (typeof timeSinceLongTask === 'number') {
      if (timeSinceLongTask >= waitForCPUQuiet) {
        log.verbose('waitFor', `CPU has been idle for ${timeSinceLongTask} ms`);
        resolve();
      } else {
        log.verbose('waitFor', `CPU has been idle for ${timeSinceLongTask} ms`);
        const timeToWait = waitForCPUQuiet - timeSinceLongTask;
        lastTimeout = setTimeout(() => checkForQuiet(executionContext, resolve), timeToWait);
      }
    }
  }

  /** @type {(() => void)} */
  let cancel = () => {
    throw new Error('waitForCPUIdle.cancel() called before it was defined');
  };

  /** @type {Promise<void>} */
  const promise = new Promise((resolve, reject) => {
    checkForQuiet(new ExecutionContext(session), resolve).catch(reject);
    cancel = () => {
      if (canceled) return;
      canceled = true;
      if (lastTimeout) clearTimeout(lastTimeout);
      reject(new Error('Wait for CPU idle canceled'));
    };
  });

  return {
    promise,
    cancel,
  };
}

/**
 * Return a promise that resolves `pauseAfterLoadMs` after the load event
 * fires and a method to cancel internal listeners and timeout.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {number} pauseAfterLoadMs
 * @return {CancellableWait}
 */
function waitForLoadEvent(session, pauseAfterLoadMs) {
  /** @type {(() => void)} */
  let cancel = () => {
    throw new Error('waitForLoadEvent.cancel() called before it was defined');
  };

  const promise = new Promise((resolve, reject) => {
    /** @type {NodeJS.Timer|undefined} */
    let loadTimeout;
    const loadListener = function() {
      loadTimeout = setTimeout(resolve, pauseAfterLoadMs);
    };
    session.once('Page.loadEventFired', loadListener);

    let canceled = false;
    cancel = () => {
      if (canceled) return;
      canceled = true;
      session.off('Page.loadEventFired', loadListener);
      loadTimeout && clearTimeout(loadTimeout);
    };
  });

  return {
    promise,
    cancel,
  };
}


/**
 * Returns whether the page appears to be hung.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<boolean>}
 */
async function isPageHung(session) {
  try {
    session.setNextProtocolTimeout(1000);
    await session.sendCommand('Runtime.evaluate', {
      expression: '"ping"',
      returnByValue: true,
      timeout: 1000,
    });

    return false;
  } catch (err) {
    return true;
  }
}

/** @type {Required<WaitOptions>['_waitForTestOverrides']} */
const DEFAULT_WAIT_FUNCTIONS = {waitForFcp, waitForLoadEvent, waitForCPUIdle, waitForNetworkIdle};

/**
 * Returns a promise that resolves when:
 * - All of the following conditions have been met:
 *    - page has no security issues
 *    - pauseAfterLoadMs milliseconds have passed since the load event.
 *    - networkQuietThresholdMs milliseconds have passed since the last network request that exceeded
 *      2 inflight requests (network-2-quiet has been reached).
 *    - cpuQuietThresholdMs have passed since the last long task after network-2-quiet.
 * - maxWaitForLoadedMs milliseconds have passed.
 * See https://github.com/GoogleChrome/lighthouse/issues/627 for more.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {NetworkRecorder} networkMonitor
 * @param {WaitOptions} options
 * @return {Promise<{timedOut: boolean}>}
 */
async function waitForFullyLoaded(session, networkMonitor, options) {
  const {pauseAfterFcpMs, pauseAfterLoadMs, networkQuietThresholdMs,
    cpuQuietThresholdMs, maxWaitForLoadedMs, maxWaitForFcpMs} = options;
  const {waitForFcp, waitForLoadEvent, waitForNetworkIdle, waitForCPUIdle} =
    options._waitForTestOverrides || DEFAULT_WAIT_FUNCTIONS;
  /** @type {NodeJS.Timer|undefined} */
  let maxTimeoutHandle;

  // Listener for FCP. Resolves pauseAfterFcpMs ms after first FCP event.
  const resolveOnFcp = maxWaitForFcpMs ?
    waitForFcp(session, pauseAfterFcpMs, maxWaitForFcpMs) :
    waitForNothing();
  // Listener for onload. Resolves pauseAfterLoadMs ms after load.
  const resolveOnLoadEvent = waitForLoadEvent(session, pauseAfterLoadMs);
  // General network listener. Resolves when the network has been 2-idle for networkQuietThresholdMs.
  const resolveOnNetworkIdle = waitForNetworkIdle(session, networkMonitor, {
    networkQuietThresholdMs,
    busyEvent: 'network-2-busy',
    idleEvent: 'network-2-idle',
    isIdle: recorder => recorder.is2Idle(),
  });
  // Critical network listener. Resolves when the network has had 0 critical requests for networkQuietThresholdMs.
  const resolveOnCriticalNetworkIdle = waitForNetworkIdle(session, networkMonitor, {
    networkQuietThresholdMs,
    busyEvent: 'network-critical-busy',
    idleEvent: 'network-critical-idle',
    isIdle: recorder => recorder.isCriticalIdle(),
  });
  // CPU listener. Resolves when the CPU has been idle for cpuQuietThresholdMs after network idle.
  let resolveOnCPUIdle = waitForNothing();

  // Wait for all initial load promises. Resolves on cleanup function the clears load
  // timeout timer.
  /** @type {Promise<() => Promise<{timedOut: boolean}>>} */
  const loadPromise = Promise.all([
    resolveOnFcp.promise,
    resolveOnLoadEvent.promise,
    resolveOnNetworkIdle.promise,
    resolveOnCriticalNetworkIdle.promise,
  ]).then(() => {
    resolveOnCPUIdle = waitForCPUIdle(session, cpuQuietThresholdMs);
    return resolveOnCPUIdle.promise;
  }).then(() => {
    /** @return {Promise<{timedOut: boolean}>} */
    const cleanupFn = async function() {
      log.verbose('waitFor', 'loadEventFired and network considered idle');
      return {timedOut: false};
    };

    return cleanupFn;
  }).catch(err => {
    // Throw the error in the cleanupFn so we still cleanup all our handlers.
    return function() {
      throw err;
    };
  });

  // Last resort timeout. Resolves maxWaitForLoadedMs ms from now on
  // cleanup function that removes loadEvent and network idle listeners.
  /** @type {Promise<() => Promise<{timedOut: boolean}>>} */
  const maxTimeoutPromise = new Promise((resolve, reject) => {
    maxTimeoutHandle = setTimeout(resolve, maxWaitForLoadedMs);
  }).then(_ => {
    return async () => {
      log.warn('waitFor', 'Timed out waiting for page load. Checking if page is hung...');
      if (await isPageHung(session)) {
        log.warn('waitFor', 'Page appears to be hung, killing JavaScript...');
        await session.sendCommand('Emulation.setScriptExecutionDisabled', {value: true});
        await session.sendCommand('Runtime.terminateExecution');
        throw new LHError(LHError.errors.PAGE_HUNG);
      }

      return {timedOut: true};
    };
  });

  // Wait for load or timeout and run the cleanup function the winner returns.
  const cleanupFn = await Promise.race([
    loadPromise,
    maxTimeoutPromise,
  ]);

  maxTimeoutHandle && clearTimeout(maxTimeoutHandle);
  resolveOnFcp.cancel();
  resolveOnLoadEvent.cancel();
  resolveOnNetworkIdle.cancel();
  resolveOnCPUIdle.cancel();

  return cleanupFn();
}

module.exports = {
  waitForNothing,
  waitForFrameNavigated,
  waitForFcp,
  waitForLoadEvent,
  waitForNetworkIdle,
  waitForCPUIdle,
  waitForFullyLoaded,
};
