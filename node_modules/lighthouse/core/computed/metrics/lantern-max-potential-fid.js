/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {makeComputedArtifact} from '../computed-artifact.js';
import {LanternMetric} from './lantern-metric.js';
import {BaseNode} from '../../lib/dependency-graph/base-node.js';
import {LanternFirstContentfulPaint} from './lantern-first-contentful-paint.js';

/** @typedef {import('../../lib/dependency-graph/base-node.js').Node} Node */

class LanternMaxPotentialFID extends LanternMetric {
  /**
   * @return {LH.Gatherer.Simulation.MetricCoefficients}
   */
  static get COEFFICIENTS() {
    return {
      intercept: 0,
      optimistic: 0.5,
      pessimistic: 0.5,
    };
  }

  /**
   * @param {Node} dependencyGraph
   * @return {Node}
   */
  static getOptimisticGraph(dependencyGraph) {
    return dependencyGraph;
  }

  /**
   * @param {Node} dependencyGraph
   * @return {Node}
   */
  static getPessimisticGraph(dependencyGraph) {
    return dependencyGraph;
  }

  /**
   * @param {LH.Gatherer.Simulation.Result} simulation
   * @param {import('./lantern-metric.js').Extras} extras
   * @return {LH.Gatherer.Simulation.Result}
   */
  static getEstimateFromSimulation(simulation, extras) {
    if (!extras.fcpResult) throw new Error('missing fcpResult');

    // Intentionally use the opposite FCP estimate, a more pessimistic FCP means that more tasks
    // are excluded from the FID computation, so a higher FCP means lower FID for same work.
    const fcpTimeInMs = extras.optimistic
      ? extras.fcpResult.pessimisticEstimate.timeInMs
      : extras.fcpResult.optimisticEstimate.timeInMs;

    const timings = LanternMaxPotentialFID.getTimingsAfterFCP(
      simulation.nodeTimings,
      fcpTimeInMs
    );

    return {
      timeInMs: Math.max(...timings.map(timing => timing.duration), 16),
      nodeTimings: simulation.nodeTimings,
    };
  }

  /**
   * @param {LH.Artifacts.MetricComputationDataInput} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.LanternMetric>}
   */
  static async compute_(data, context) {
    const fcpResult = await LanternFirstContentfulPaint.request(data, context);
    return super.computeMetricWithGraphs(data, context, {fcpResult});
  }

  /**
   * @param {LH.Gatherer.Simulation.Result['nodeTimings']} nodeTimings
   * @param {number} fcpTimeInMs
   * @return {Array<{duration: number}>}
   */
  static getTimingsAfterFCP(nodeTimings, fcpTimeInMs) {
    return Array.from(nodeTimings.entries())
      .filter(([node, timing]) => node.type === BaseNode.TYPES.CPU && timing.endTime > fcpTimeInMs)
      .map(([_, timing]) => timing);
  }
}

const LanternMaxPotentialFIDComputed = makeComputedArtifact(
  LanternMaxPotentialFID,
  ['devtoolsLog', 'gatherContext', 'settings', 'simulator', 'trace', 'URL']
);
export {LanternMaxPotentialFIDComputed as LanternMaxPotentialFID};
