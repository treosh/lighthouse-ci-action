/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {ProcessedTrace} from '../processed-trace.js';
import {ProcessedNavigation} from '../processed-navigation.js';
import {Speedline} from '../speedline.js';
import {FirstContentfulPaint} from './first-contentful-paint.js';
import {FirstContentfulPaintAllFrames} from './first-contentful-paint-all-frames.js';
import {FirstMeaningfulPaint} from './first-meaningful-paint.js';
import {LargestContentfulPaint} from './largest-contentful-paint.js';
import {LargestContentfulPaintAllFrames} from './largest-contentful-paint-all-frames.js';
import {Interactive} from './interactive.js';
import {CumulativeLayoutShift} from './cumulative-layout-shift.js';
import {SpeedIndex} from './speed-index.js';
import {MaxPotentialFID} from './max-potential-fid.js';
import {TotalBlockingTime} from './total-blocking-time.js';
import {makeComputedArtifact} from '../computed-artifact.js';

class TimingSummary {
  /**
     * @param {LH.Trace} trace
     * @param {LH.DevtoolsLog} devtoolsLog
     * @param {LH.Artifacts['GatherContext']} gatherContext
     * @param {LH.Util.ImmutableObject<LH.Config.Settings>} settings
     * @param {LH.Artifacts['URL']} URL
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
     */
  static async summarize(trace, devtoolsLog, gatherContext, settings, URL, context) {
    const metricComputationData = {trace, devtoolsLog, gatherContext, settings, URL};
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
    const processedNavigation = await requestOrUndefined(ProcessedNavigation, trace);
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

      // Include all timestamps of interest from the processed trace
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
   * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog, gatherContext: LH.Artifacts['GatherContext']; settings: LH.Util.ImmutableObject<LH.Config.Settings>, URL: LH.Artifacts['URL']}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<{metrics: LH.Artifacts.TimingSummary, debugInfo: Record<string,boolean>}>}
   */
  static async compute_(data, context) {
    return TimingSummary.summarize(
      data.trace,
      data.devtoolsLog,
      data.gatherContext,
      data.settings,
      data.URL,
      context
    );
  }
}

const TimingSummaryComputed = makeComputedArtifact(
  TimingSummary,
  ['devtoolsLog', 'gatherContext', 'settings', 'trace', 'URL']
);
export {TimingSummaryComputed as TimingSummary};
