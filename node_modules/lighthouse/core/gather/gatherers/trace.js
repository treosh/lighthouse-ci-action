/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview
 * This gatherer collects all network and page devtools protocol traffic during the timespan/navigation.
 * This protocol log can be used to recreate the network records using lib/network-recorder.js.
 */

import FRGatherer from '../base-gatherer.js';
import {TraceProcessor} from '../../lib/tracehouse/trace-processor.js';

class Trace extends FRGatherer {
  /** @type {LH.Trace} */
  _trace = {traceEvents: []};

  static getDefaultTraceCategories() {
    return [
      // Exclude default categories. We'll be selective to minimize trace size
      '-*',

      // Used instead of 'toplevel' in Chrome 71+
      'disabled-by-default-lighthouse',

      // Used for Cumulative Layout Shift metric
      'loading',

      // All compile/execute events are captured by parent events in devtools.timeline..
      // But the v8 category provides some nice context for only <0.5% of the trace size
      'v8',
      // Same situation here. This category is there for RunMicrotasks only, but with other teams
      // accidentally excluding microtasks, we don't want to assume a parent event will always exist
      'v8.execute',

      // For extracting UserTiming marks/measures
      'blink.user_timing',

      // Not mandatory but not used much
      'blink.console',

      // Most of the events we need are from these two categories
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',

      // Up to 450 (https://goo.gl/rBfhn4) JPGs added to the trace
      'disabled-by-default-devtools.screenshot',

      // This doesn't add its own events, but adds a `stackTrace` property to devtools.timeline events
      'disabled-by-default-devtools.timeline.stack',

      // Additional categories used by devtools. Not used by Lighthouse, but included to facilitate
      // loading traces from Lighthouse into the Performance panel.
      'disabled-by-default-devtools.timeline.frame',
      'latencyInfo',

      // A bug introduced in M92 causes these categories to crash targets on Linux.
      // See https://github.com/GoogleChrome/lighthouse/issues/12835 for full investigation.
      // 'disabled-by-default-v8.cpu_profiler',
    ];
  }

  /**
   * @param {LH.Gatherer.FRProtocolSession} session
   * @return {Promise<LH.Trace>}
   */
  static async endTraceAndCollectEvents(session) {
    /** @type {Array<LH.TraceEvent>} */
    const traceEvents = [];

    /**
     * Listener for when dataCollected events fire for each trace chunk
     * @param {LH.Crdp.Tracing.DataCollectedEvent} data
     */
    const dataListener = function(data) {
      traceEvents.push(...data.value);
    };
    session.on('Tracing.dataCollected', dataListener);

    return new Promise((resolve, reject) => {
      session.once('Tracing.tracingComplete', _ => {
        session.off('Tracing.dataCollected', dataListener);
        resolve({traceEvents});
      });

      session.sendCommand('Tracing.end').catch(reject);
    });
  }

  static symbol = Symbol('Trace');

  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    symbol: Trace.symbol,
    supportedModes: ['timespan', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   */
  async startSensitiveInstrumentation({driver, gatherMode, settings}) {
    const traceCategories = Trace.getDefaultTraceCategories()
      .concat(settings.additionalTraceCategories || []);
    await driver.defaultSession.sendCommand('Page.enable');
    await driver.defaultSession.sendCommand('Tracing.start', {
      categories: traceCategories.join(','),
      options: 'sampling-frequency=10000', // 1000 is default and too slow.
    });

    if (gatherMode === 'timespan') {
      await driver.defaultSession.sendCommand('Tracing.recordClockSyncMarker',
        {syncId: TraceProcessor.TIMESPAN_MARKER_ID});
    }
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   */
  async stopSensitiveInstrumentation({driver}) {
    this._trace = await Trace.endTraceAndCollectEvents(driver.defaultSession);
  }

  getArtifact() {
    return this._trace;
  }
}

export default Trace;
