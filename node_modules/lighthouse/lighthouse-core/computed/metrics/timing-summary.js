/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const ProcessedTrace = require('../processed-trace.js');
const ProcessedNavigation = require('../processed-navigation.js');
const Speedline = require('../speedline.js');
const FirstContentfulPaint = require('./first-contentful-paint.js');
const FirstContentfulPaintAllFrames = require('./first-contentful-paint-all-frames.js');
const FirstMeaningfulPaint = require('./first-meaningful-paint.js');
const LargestContentfulPaint = require('./largest-contentful-paint.js');
const LargestContentfulPaintAllFrames = require('./largest-contentful-paint-all-frames.js');
const Interactive = require('./interactive.js');
const CumulativeLayoutShift = require('./cumulative-layout-shift.js');
const SpeedIndex = require('./speed-index.js');
const MaxPotentialFID = require('./max-potential-fid.js');
const TotalBlockingTime = require('./total-blocking-time.js');
const makeComputedArtifact = require('../computed-artifact.js');

class TimingSummary {
  /**
     * @param {LH.Trace} trace
     * @param {LH.DevtoolsLog} devtoolsLog
     * @param {LH.Artifacts['GatherContext']} gatherContext
     * @param {ImmutableObject<LH.Config.Settings>} settings
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
     */
  static async summarize(trace, devtoolsLog, gatherContext, settings, context) {
    const metricComputationData = {trace, devtoolsLog, gatherContext, settings};
    /**
     * @template TArtifacts
     * @template TReturn
     * @param {{request: (artifact: TArtifacts, context: LH.Artifacts.ComputedContext) => Promise<TReturn>}} Artifact
     * @param {TArtifacts} artifact
     * @return {Promise<TReturn|undefined>}
     */
    const requestOrUndefined = (Artifact, artifact) => {
      return Artifact.request(artifact, context).catch(_ => undefined);
    };

    /* eslint-disable max-len */

    const processedTrace = await ProcessedTrace.request(trace, context);
    const processedNavigation = await requestOrUndefined(ProcessedNavigation, processedTrace);
    const speedline = await Speedline.request(trace, context);
    const firstContentfulPaint = await requestOrUndefined(FirstContentfulPaint, metricComputationData);
    const firstContentfulPaintAllFrames = await requestOrUndefined(FirstContentfulPaintAllFrames, metricComputationData);
    const firstMeaningfulPaint = await requestOrUndefined(FirstMeaningfulPaint, metricComputationData);
    const largestContentfulPaint = await requestOrUndefined(LargestContentfulPaint, metricComputationData);
    const largestContentfulPaintAllFrames = await requestOrUndefined(LargestContentfulPaintAllFrames, metricComputationData);
    const interactive = await requestOrUndefined(Interactive, metricComputationData);
    const cumulativeLayoutShiftValues = await requestOrUndefined(CumulativeLayoutShift, trace);
    const maxPotentialFID = await requestOrUndefined(MaxPotentialFID, metricComputationData);
    const speedIndex = await requestOrUndefined(SpeedIndex, metricComputationData);
    const totalBlockingTime = await requestOrUndefined(TotalBlockingTime, metricComputationData);

    const {
      cumulativeLayoutShift,
      cumulativeLayoutShiftMainFrame,
      totalCumulativeLayoutShift,
    } = cumulativeLayoutShiftValues || {};

    /** @type {LH.Artifacts.TimingSummary} */
    const metrics = {
      // Include the simulated/observed performance metrics
      firstContentfulPaint: firstContentfulPaint?.timing,
      firstContentfulPaintTs: firstContentfulPaint?.timestamp,
      firstContentfulPaintAllFrames: firstContentfulPaintAllFrames?.timing,
      firstContentfulPaintAllFramesTs: firstContentfulPaintAllFrames?.timestamp,
      firstMeaningfulPaint: firstMeaningfulPaint?.timing,
      firstMeaningfulPaintTs: firstMeaningfulPaint?.timestamp,
      largestContentfulPaint: largestContentfulPaint?.timing,
      largestContentfulPaintTs: largestContentfulPaint?.timestamp,
      largestContentfulPaintAllFrames: largestContentfulPaintAllFrames?.timing,
      largestContentfulPaintAllFramesTs: largestContentfulPaintAllFrames?.timestamp,
      interactive: interactive?.timing,
      interactiveTs: interactive?.timestamp,
      speedIndex: speedIndex?.timing,
      speedIndexTs: speedIndex?.timestamp,
      totalBlockingTime: totalBlockingTime?.timing,
      maxPotentialFID: maxPotentialFID?.timing,
      cumulativeLayoutShift,
      cumulativeLayoutShiftMainFrame,
      totalCumulativeLayoutShift,

      // Include all timestamps of interest from trace of tab
      observedTimeOrigin: processedTrace.timings.timeOrigin,
      observedTimeOriginTs: processedTrace.timestamps.timeOrigin,
      // For now, navigationStart is always timeOrigin.
      observedNavigationStart: processedNavigation?.timings.timeOrigin,
      observedNavigationStartTs: processedNavigation?.timestamps.timeOrigin,
      observedFirstPaint: processedNavigation?.timings.firstPaint,
      observedFirstPaintTs: processedNavigation?.timestamps.firstPaint,
      observedFirstContentfulPaint: processedNavigation?.timings.firstContentfulPaint,
      observedFirstContentfulPaintTs: processedNavigation?.timestamps.firstContentfulPaint,
      observedFirstContentfulPaintAllFrames: processedNavigation?.timings.firstContentfulPaintAllFrames,
      observedFirstContentfulPaintAllFramesTs: processedNavigation?.timestamps.firstContentfulPaintAllFrames,
      observedFirstMeaningfulPaint: processedNavigation?.timings.firstMeaningfulPaint,
      observedFirstMeaningfulPaintTs: processedNavigation?.timestamps.firstMeaningfulPaint,
      observedLargestContentfulPaint: processedNavigation?.timings.largestContentfulPaint,
      observedLargestContentfulPaintTs: processedNavigation?.timestamps.largestContentfulPaint,
      observedLargestContentfulPaintAllFrames: processedNavigation?.timings.largestContentfulPaintAllFrames,
      observedLargestContentfulPaintAllFramesTs: processedNavigation?.timestamps.largestContentfulPaintAllFrames,
      observedTraceEnd: processedTrace.timings.traceEnd,
      observedTraceEndTs: processedTrace.timestamps.traceEnd,
      observedLoad: processedNavigation?.timings.load,
      observedLoadTs: processedNavigation?.timestamps.load,
      observedDomContentLoaded: processedNavigation?.timings.domContentLoaded,
      observedDomContentLoadedTs: processedNavigation?.timestamps.domContentLoaded,
      observedCumulativeLayoutShift: cumulativeLayoutShift,
      observedCumulativeLayoutShiftMainFrame: cumulativeLayoutShiftMainFrame,
      observedTotalCumulativeLayoutShift: totalCumulativeLayoutShift,

      // Include some visual metrics from speedline
      observedFirstVisualChange: speedline.first,
      observedFirstVisualChangeTs: (speedline.first + speedline.beginning) * 1000,
      observedLastVisualChange: speedline.complete,
      observedLastVisualChangeTs: (speedline.complete + speedline.beginning) * 1000,
      observedSpeedIndex: speedline.speedIndex,
      observedSpeedIndexTs: (speedline.speedIndex + speedline.beginning) * 1000,
    };

    /* eslint-enable max-len */

    /** @type {Record<string,boolean>} */
    const debugInfo = {
      lcpInvalidated: !!processedNavigation?.lcpInvalidated,
    };

    return {metrics, debugInfo};
  }
  /**
   * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog, gatherContext: LH.Artifacts['GatherContext']; settings: ImmutableObject<LH.Config.Settings>}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
   */
  static async compute_(data, context) {
    return TimingSummary.summarize(data.trace, data.devtoolsLog, data.gatherContext, data.settings,
      context);
  }
}

module.exports = makeComputedArtifact(
  TimingSummary,
  ['devtoolsLog', 'gatherContext', 'settings', 'trace']
);
