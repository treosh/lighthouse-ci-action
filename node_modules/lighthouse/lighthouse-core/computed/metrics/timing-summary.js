/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const TraceOfTab = require('../trace-of-tab.js');
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
     * @param {ImmutableObject<LH.Config.Settings>} settings
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
     */
  static async summarize(trace, devtoolsLog, settings, context) {
    const metricComputationData = {trace, devtoolsLog, settings};
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

    const traceOfTab = await TraceOfTab.request(trace, context);
    const speedline = await Speedline.request(trace, context);
    const firstContentfulPaint = await FirstContentfulPaint.request(metricComputationData, context);
    const firstContentfulPaintAllFrames = await requestOrUndefined(FirstContentfulPaintAllFrames, metricComputationData); // eslint-disable-line max-len
    const firstMeaningfulPaint = await FirstMeaningfulPaint.request(metricComputationData, context);
    const largestContentfulPaint = await requestOrUndefined(LargestContentfulPaint, metricComputationData); // eslint-disable-line max-len
    const largestContentfulPaintAllFrames = await requestOrUndefined(LargestContentfulPaintAllFrames, metricComputationData); // eslint-disable-line max-len
    const interactive = await requestOrUndefined(Interactive, metricComputationData);
    const cumulativeLayoutShiftValues = await requestOrUndefined(CumulativeLayoutShift, trace);
    const maxPotentialFID = await requestOrUndefined(MaxPotentialFID, metricComputationData);
    const speedIndex = await requestOrUndefined(SpeedIndex, metricComputationData);
    const totalBlockingTime = await TotalBlockingTime.request(metricComputationData, context); // eslint-disable-line max-len

    const {
      cumulativeLayoutShift,
      cumulativeLayoutShiftMainFrame,
      totalCumulativeLayoutShift,
    } = cumulativeLayoutShiftValues || {};

    /** @type {LH.Artifacts.TimingSummary} */
    const metrics = {
      // Include the simulated/observed performance metrics
      firstContentfulPaint: firstContentfulPaint.timing,
      firstContentfulPaintTs: firstContentfulPaint.timestamp,
      firstContentfulPaintAllFrames: firstContentfulPaintAllFrames && firstContentfulPaintAllFrames.timing, // eslint-disable-line max-len
      firstContentfulPaintAllFramesTs: firstContentfulPaintAllFrames && firstContentfulPaintAllFrames.timestamp, // eslint-disable-line max-len
      firstMeaningfulPaint: firstMeaningfulPaint.timing,
      firstMeaningfulPaintTs: firstMeaningfulPaint.timestamp,
      largestContentfulPaint: largestContentfulPaint && largestContentfulPaint.timing,
      largestContentfulPaintTs: largestContentfulPaint && largestContentfulPaint.timestamp,
      largestContentfulPaintAllFrames: largestContentfulPaintAllFrames && largestContentfulPaintAllFrames.timing, // eslint-disable-line max-len
      largestContentfulPaintAllFramesTs: largestContentfulPaintAllFrames && largestContentfulPaintAllFrames.timestamp, // eslint-disable-line max-len
      interactive: interactive && interactive.timing,
      interactiveTs: interactive && interactive.timestamp,
      speedIndex: speedIndex && speedIndex.timing,
      speedIndexTs: speedIndex && speedIndex.timestamp,
      totalBlockingTime: totalBlockingTime.timing,
      maxPotentialFID: maxPotentialFID && maxPotentialFID.timing,
      cumulativeLayoutShift,
      cumulativeLayoutShiftMainFrame,
      totalCumulativeLayoutShift,

      // Include all timestamps of interest from trace of tab
      observedTimeOrigin: traceOfTab.timings.timeOrigin,
      observedTimeOriginTs: traceOfTab.timestamps.timeOrigin,
      // For now, navigationStart is always timeOrigin.
      // These properties might be undefined in a future major version, but preserve them for now.
      observedNavigationStart: traceOfTab.timings.timeOrigin,
      observedNavigationStartTs: traceOfTab.timestamps.timeOrigin,
      observedFirstPaint: traceOfTab.timings.firstPaint,
      observedFirstPaintTs: traceOfTab.timestamps.firstPaint,
      observedFirstContentfulPaint: traceOfTab.timings.firstContentfulPaint,
      observedFirstContentfulPaintTs: traceOfTab.timestamps.firstContentfulPaint,
      observedFirstContentfulPaintAllFrames: traceOfTab.timings.firstContentfulPaintAllFrames,
      observedFirstContentfulPaintAllFramesTs: traceOfTab.timestamps.firstContentfulPaintAllFrames,
      observedFirstMeaningfulPaint: traceOfTab.timings.firstMeaningfulPaint,
      observedFirstMeaningfulPaintTs: traceOfTab.timestamps.firstMeaningfulPaint,
      observedLargestContentfulPaint: traceOfTab.timings.largestContentfulPaint,
      observedLargestContentfulPaintTs: traceOfTab.timestamps.largestContentfulPaint,
      observedLargestContentfulPaintAllFrames: traceOfTab.timings.largestContentfulPaintAllFrames,
      observedLargestContentfulPaintAllFramesTs: traceOfTab.timestamps.largestContentfulPaintAllFrames, // eslint-disable-line max-len
      observedTraceEnd: traceOfTab.timings.traceEnd,
      observedTraceEndTs: traceOfTab.timestamps.traceEnd,
      observedLoad: traceOfTab.timings.load,
      observedLoadTs: traceOfTab.timestamps.load,
      observedDomContentLoaded: traceOfTab.timings.domContentLoaded,
      observedDomContentLoadedTs: traceOfTab.timestamps.domContentLoaded,
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
    /** @type {Record<string,boolean>} */
    const debugInfo = {lcpInvalidated: traceOfTab.lcpInvalidated};

    return {metrics, debugInfo};
  }
  /**
   * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog, settings: ImmutableObject<LH.Config.Settings>}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
   */
  static async compute_(data, context) {
    return TimingSummary.summarize(data.trace, data.devtoolsLog, data.settings, context);
  }
}

module.exports = makeComputedArtifact(TimingSummary);
