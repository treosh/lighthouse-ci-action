/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* global getNodeDetails */

/**
 * @fileoverview
 * This gatherer identifies elements that contribrute to metrics in the trace (LCP, CLS, etc.).
 * We take the backend nodeId from the trace and use it to find the corresponding element in the DOM.
 */

import BaseGatherer from '../base-gatherer.js';
import {resolveNodeIdToObjectId} from '../driver/dom.js';
import {pageFunctions} from '../../lib/page-functions.js';
import {Sentry} from '../../lib/sentry.js';
import Trace from './trace.js';
import {ProcessedTrace} from '../../computed/processed-trace.js';
import {ProcessedNavigation} from '../../computed/processed-navigation.js';
import {LighthouseError} from '../../lib/lh-error.js';
import {Responsiveness} from '../../computed/metrics/responsiveness.js';
import {CumulativeLayoutShift} from '../../computed/metrics/cumulative-layout-shift.js';
import {ExecutionContext} from '../driver/execution-context.js';

/** @typedef {{nodeId: number, animations?: {name?: string, failureReasonsMask?: number, unsupportedProperties?: string[]}[], type?: string}} TraceElementData */

const MAX_LAYOUT_SHIFT_ELEMENTS = 15;

/**
 * @this {HTMLElement}
 */
/* c8 ignore start */
function getNodeDetailsData() {
  const elem = this.nodeType === document.ELEMENT_NODE ? this : this.parentElement; // eslint-disable-line no-undef
  let traceElement;
  if (elem) {
    // @ts-expect-error - getNodeDetails put into scope via stringification
    traceElement = {node: getNodeDetails(elem)};
  }
  return traceElement;
}
/* c8 ignore stop */

class TraceElements extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta<'Trace'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {Trace: Trace.symbol},
  };

  /** @type {Map<string, string>} */
  animationIdToName = new Map();

  constructor() {
    super();
    this._onAnimationStarted = this._onAnimationStarted.bind(this);
  }

  /** @param {LH.Crdp.Animation.AnimationStartedEvent} args */
  _onAnimationStarted({animation: {id, name}}) {
    if (name) this.animationIdToName.set(id, name);
  }

  /**
   * This function finds the top (up to 15) elements that contribute to the CLS score of the page.
   *
   * @param {LH.Trace} trace
   * @param {LH.Gatherer.Context} context
   * @return {Promise<Array<TraceElementData>>}
   */
  static async getTopLayoutShiftElements(trace, context) {
    const {impactByNodeId} = await CumulativeLayoutShift.request(trace, context);

    return [...impactByNodeId.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_LAYOUT_SHIFT_ELEMENTS)
      .map(([nodeId]) => ({nodeId}));
  }

  /**
   * @param {LH.Trace} trace
   * @param {LH.Gatherer.Context} context
   * @return {Promise<TraceElementData|undefined>}
   */
  static async getResponsivenessElement(trace, context) {
    const {settings} = context;
    try {
      const responsivenessEvent = await Responsiveness.request({trace, settings}, context);
      if (!responsivenessEvent || responsivenessEvent.name === 'FallbackTiming') return;
      return {nodeId: responsivenessEvent.args.data.nodeId};
    } catch {
      // Don't let responsiveness errors sink the rest of the gatherer.
      return;
    }
  }

  /**
   * Find the node ids of elements which are animated using the Animation trace events.
   * @param {Array<LH.TraceEvent>} mainThreadEvents
   * @return {Promise<Array<TraceElementData>>}
   */
  async getAnimatedElements(mainThreadEvents) {
    /** @type {Map<string, {begin: LH.TraceEvent | undefined, status: LH.TraceEvent | undefined}>} */
    const animationPairs = new Map();
    for (const event of mainThreadEvents) {
      if (event.name !== 'Animation') continue;

      if (!event.id2 || !event.id2.local) continue;
      const local = event.id2.local;

      const pair = animationPairs.get(local) || {begin: undefined, status: undefined};
      if (event.ph === 'b') {
        pair.begin = event;
      } else if (
        event.ph === 'n' &&
          event.args.data &&
          event.args.data.compositeFailed !== undefined) {
        pair.status = event;
      }
      animationPairs.set(local, pair);
    }

    /** @type {Map<number, Set<{animationId: string, failureReasonsMask?: number, unsupportedProperties?: string[]}>>} */
    const elementAnimations = new Map();
    for (const {begin, status} of animationPairs.values()) {
      const nodeId = begin?.args?.data?.nodeId;
      const animationId = begin?.args?.data?.id;
      const failureReasonsMask = status?.args?.data?.compositeFailed;
      const unsupportedProperties = status?.args?.data?.unsupportedProperties;
      if (!nodeId || !animationId) continue;

      const animationIds = elementAnimations.get(nodeId) || new Set();
      animationIds.add({animationId, failureReasonsMask, unsupportedProperties});
      elementAnimations.set(nodeId, animationIds);
    }

    /** @type {Array<TraceElementData>} */
    const animatedElementData = [];
    for (const [nodeId, animationIds] of elementAnimations) {
      const animations = [];
      for (const {animationId, failureReasonsMask, unsupportedProperties} of animationIds) {
        const animationName = this.animationIdToName.get(animationId);
        animations.push({name: animationName, failureReasonsMask, unsupportedProperties});
      }
      animatedElementData.push({nodeId, animations});
    }
    return animatedElementData;
  }

  /**
   * @param {LH.Trace} trace
   * @param {LH.Gatherer.Context} context
   * @return {Promise<{nodeId: number, type: string} | undefined>}
   */
  static async getLcpElement(trace, context) {
    let processedNavigation;
    try {
      processedNavigation = await ProcessedNavigation.request(trace, context);
    } catch (err) {
      // If we were running in timespan mode and there was no paint, treat LCP as missing.
      if (context.gatherMode === 'timespan' && err.code === LighthouseError.errors.NO_FCP.code) {
        return;
      }

      throw err;
    }

    // Use main-frame-only LCP to match the metric value.
    const lcpData = processedNavigation.largestContentfulPaintEvt?.args?.data;
    // These should exist, but trace types are loose.
    if (lcpData?.nodeId === undefined || !lcpData.type) return;

    return {
      nodeId: lcpData.nodeId,
      type: lcpData.type,
    };
  }

  /**
   * @param {LH.Gatherer.Context} context
   */
  async startInstrumentation(context) {
    await context.driver.defaultSession.sendCommand('Animation.enable');
    context.driver.defaultSession.on('Animation.animationStarted', this._onAnimationStarted);
  }

  /**
   * @param {LH.Gatherer.Context} context
   */
  async stopInstrumentation(context) {
    context.driver.defaultSession.off('Animation.animationStarted', this._onAnimationStarted);
    await context.driver.defaultSession.sendCommand('Animation.disable');
  }

  /**
   * @param {LH.Gatherer.Context<'Trace'>} context
   * @return {Promise<LH.Artifacts.TraceElement[]>}
   */
  async getArtifact(context) {
    const session = context.driver.defaultSession;

    const trace = context.dependencies.Trace;
    if (!trace) {
      throw new Error('Trace is missing!');
    }

    const processedTrace = await ProcessedTrace.request(trace, context);
    const {mainThreadEvents} = processedTrace;

    const lcpNodeData = await TraceElements.getLcpElement(trace, context);
    const clsNodeData = await TraceElements.getTopLayoutShiftElements(trace, context);
    const animatedElementData = await this.getAnimatedElements(mainThreadEvents);
    const responsivenessElementData = await TraceElements.getResponsivenessElement(trace, context);

    /** @type {Map<string, TraceElementData[]>} */
    const backendNodeDataMap = new Map([
      ['largest-contentful-paint', lcpNodeData ? [lcpNodeData] : []],
      ['layout-shift', clsNodeData],
      ['animation', animatedElementData],
      ['responsiveness', responsivenessElementData ? [responsivenessElementData] : []],
    ]);

    const traceElements = [];
    for (const [traceEventType, backendNodeData] of backendNodeDataMap) {
      for (let i = 0; i < backendNodeData.length; i++) {
        const backendNodeId = backendNodeData[i].nodeId;
        let response;
        try {
          const objectId = await resolveNodeIdToObjectId(session, backendNodeId);
          if (!objectId) continue;

          const deps = ExecutionContext.serializeDeps([
            pageFunctions.getNodeDetails,
            getNodeDetailsData,
          ]);
          response = await session.sendCommand('Runtime.callFunctionOn', {
            objectId,
            functionDeclaration: `function () {
              ${deps}
              return getNodeDetailsData.call(this);
            }`,
            returnByValue: true,
            awaitPromise: true,
          });
        } catch (err) {
          Sentry.captureException(err, {
            tags: {gatherer: 'TraceElements'},
            level: 'error',
          });
          continue;
        }

        if (response?.result?.value) {
          traceElements.push({
            traceEventType,
            ...response.result.value,
            animations: backendNodeData[i].animations,
            nodeId: backendNodeId,
            type: backendNodeData[i].type,
          });
        }
      }
    }

    return traceElements;
  }
}

export default TraceElements;
