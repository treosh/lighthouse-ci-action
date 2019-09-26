/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('./computed-artifact.js');
const NetworkNode = require('../lib/dependency-graph/network-node.js');
const CPUNode = require('../lib/dependency-graph/cpu-node.js');
const NetworkAnalyzer = require('../lib/dependency-graph/simulator/network-analyzer.js');
const TracingProcessor = require('../lib/tracehouse/trace-processor.js');
const NetworkRequest = require('../lib/network-request.js');
const TraceOfTab = require('./trace-of-tab.js');
const NetworkRecords = require('./network-records.js');

/** @typedef {import('../lib/dependency-graph/base-node.js').Node} Node */

// Tasks smaller than 10 ms have minimal impact on simulation
const MINIMUM_TASK_DURATION_OF_INTEREST = 10;
// TODO: video files tend to be enormous and throw off all graph traversals, move this ignore
//    into estimation logic when we use the dependency graph for other purposes.
const IGNORED_MIME_TYPES_REGEX = /^video/;

class PageDependencyGraph {
  /**
   * @param {LH.Artifacts.NetworkRequest} record
   * @return {Array<string>}
   */
  static getNetworkInitiators(record) {
    if (!record.initiator) return [];
    if (record.initiator.url) return [record.initiator.url];
    if (record.initiator.type === 'script') {
      // Script initiators have the stack of callFrames from all functions that led to this request.
      // If async stacks are enabled, then the stack will also have the parent functions that asynchronously
      // led to this request chained in the `parent` property.
      /** @type {Set<string>} */
      const scriptURLs = new Set();
      let stack = record.initiator.stack;
      while (stack) {
        const callFrames = stack.callFrames || [];
        for (const frame of callFrames) {
          if (frame.url) scriptURLs.add(frame.url);
        }

        stack = stack.parent;
      }

      return Array.from(scriptURLs);
    }

    return [];
  }

  /**
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {NetworkNodeOutput}
   */
  static getNetworkNodeOutput(networkRecords) {
    /** @type {Array<NetworkNode>} */
    const nodes = [];
    const idToNodeMap = new Map();
    const urlToNodeMap = new Map();

    networkRecords.forEach(record => {
      if (IGNORED_MIME_TYPES_REGEX.test(record.mimeType)) return;

      // Network record requestIds can be duplicated for an unknown reason
      // Suffix all subsequent records with `:duplicate` until it's unique
      // NOTE: This should never happen with modern NetworkRequest library, but old fixtures
      // might still have this issue.
      while (idToNodeMap.has(record.requestId)) {
        record.requestId += ':duplicate';
      }

      const node = new NetworkNode(record);
      nodes.push(node);

      const list = urlToNodeMap.get(record.url) || [];
      list.push(node);

      idToNodeMap.set(record.requestId, node);
      urlToNodeMap.set(record.url, list);
    });

    return {nodes, idToNodeMap, urlToNodeMap};
  }

  /**
   * @param {LH.Artifacts.TraceOfTab} traceOfTab
   * @return {Array<CPUNode>}
   */
  static getCPUNodes(traceOfTab) {
    /** @type {Array<CPUNode>} */
    const nodes = [];
    let i = 0;

    TracingProcessor.assertHasToplevelEvents(traceOfTab.mainThreadEvents);

    const minimumEvtDur = MINIMUM_TASK_DURATION_OF_INTEREST * 1000;
    while (i < traceOfTab.mainThreadEvents.length) {
      const evt = traceOfTab.mainThreadEvents[i];

      // Skip all trace events that aren't schedulable tasks with sizable duration
      if (
        !TracingProcessor.isScheduleableTask(evt) ||
        !evt.dur ||
        evt.dur < minimumEvtDur
      ) {
        i++;
        continue;
      }

      // Capture all events that occurred within the task
      /** @type {Array<LH.TraceEvent>} */
      const children = [];
      i++; // Start examining events after this one
      for (
        const endTime = evt.ts + evt.dur;
        i < traceOfTab.mainThreadEvents.length && traceOfTab.mainThreadEvents[i].ts < endTime;
        i++
      ) {
        children.push(traceOfTab.mainThreadEvents[i]);
      }

      nodes.push(new CPUNode(evt, children));
    }

    return nodes;
  }

  /**
   * @param {Node} rootNode
   * @param {NetworkNodeOutput} networkNodeOutput
   */
  static linkNetworkNodes(rootNode, networkNodeOutput) {
    networkNodeOutput.nodes.forEach(node => {
      const initiators = PageDependencyGraph.getNetworkInitiators(node.record);
      if (initiators.length) {
        initiators.forEach(initiator => {
          const parentCandidates = networkNodeOutput.urlToNodeMap.get(initiator) || [rootNode];
          // Only add the initiator relationship if the initiator is unambiguous
          const parent = parentCandidates.length === 1 ? parentCandidates[0] : rootNode;
          node.addDependency(parent);
        });
      } else if (node !== rootNode) {
        rootNode.addDependent(node);
      }

      if (!node.record.redirects) return;

      const redirects = [...node.record.redirects, node.record];
      for (let i = 1; i < redirects.length; i++) {
        const redirectNode = networkNodeOutput.idToNodeMap.get(redirects[i - 1].requestId);
        const actualNode = networkNodeOutput.idToNodeMap.get(redirects[i].requestId);
        if (actualNode && redirectNode) {
          actualNode.addDependency(redirectNode);
        }
      }
    });
  }

  /**
   * @param {Node} rootNode
   * @param {NetworkNodeOutput} networkNodeOutput
   * @param {Array<CPUNode>} cpuNodes
   */
  static linkCPUNodes(rootNode, networkNodeOutput, cpuNodes) {
    /** @param {CPUNode} cpuNode @param {string} reqId */
    function addDependentNetworkRequest(cpuNode, reqId) {
      const networkNode = networkNodeOutput.idToNodeMap.get(reqId);
      if (!networkNode ||
          // Ignore all non-XHRs
          networkNode.record.resourceType !== NetworkRequest.TYPES.XHR ||
          // Ignore all network nodes that started before this CPU task started
          // A network request that started earlier could not possibly have been started by this task
          networkNode.startTime <= cpuNode.startTime) return;
      cpuNode.addDependent(networkNode);
    }

    /** @param {CPUNode} cpuNode @param {string} url */
    function addDependencyOnUrl(cpuNode, url) {
      if (!url) return;
      // Allow network requests that end up to 100ms before the task started
      // Some script evaluations can start before the script finishes downloading
      const minimumAllowableTimeSinceNetworkNodeEnd = -100 * 1000;
      const candidates = networkNodeOutput.urlToNodeMap.get(url) || [];

      let minCandidate = null;
      let minDistance = Infinity;
      // Find the closest request that finished before this CPU task started
      for (const candidate of candidates) {
        // Explicitly ignore all requests that started after this CPU node
        // A network request that started after this task started cannot possibly be a dependency
        if (cpuNode.startTime <= candidate.startTime) return;

        const distance = cpuNode.startTime - candidate.endTime;
        if (distance >= minimumAllowableTimeSinceNetworkNodeEnd && distance < minDistance) {
          minCandidate = candidate;
          minDistance = distance;
        }
      }

      if (!minCandidate) return;
      cpuNode.addDependency(minCandidate);
    }

    /** @type {Map<string, CPUNode>} */
    const timers = new Map();
    for (const node of cpuNodes) {
      for (const evt of node.childEvents) {
        if (!evt.args.data) continue;

        const argsUrl = evt.args.data.url;
        const stackTraceUrls = (evt.args.data.stackTrace || []).map(l => l.url).filter(Boolean);

        switch (evt.name) {
          case 'TimerInstall':
            // @ts-ignore - 'TimerInstall' event means timerId exists.
            timers.set(evt.args.data.timerId, node);
            stackTraceUrls.forEach(url => addDependencyOnUrl(node, url));
            break;
          case 'TimerFire': {
            // @ts-ignore - 'TimerFire' event means timerId exists.
            const installer = timers.get(evt.args.data.timerId);
            if (!installer) break;
            installer.addDependent(node);
            break;
          }

          case 'InvalidateLayout':
          case 'ScheduleStyleRecalculation':
            stackTraceUrls.forEach(url => addDependencyOnUrl(node, url));
            break;

          case 'EvaluateScript':
            // @ts-ignore - 'EvaluateScript' event means argsUrl is defined.
            addDependencyOnUrl(node, argsUrl);
            stackTraceUrls.forEach(url => addDependencyOnUrl(node, url));
            break;

          case 'XHRReadyStateChange':
            // Only create the dependency if the request was completed
            // @ts-ignore - 'XHRReadyStateChange' event means readyState is defined.
            if (evt.args.data.readyState !== 4) break;

            // @ts-ignore - 'XHRReadyStateChange' event means argsUrl is defined.
            addDependencyOnUrl(node, argsUrl);
            stackTraceUrls.forEach(url => addDependencyOnUrl(node, url));
            break;

          case 'FunctionCall':
          case 'v8.compile':
            // @ts-ignore - events mean argsUrl is defined.
            addDependencyOnUrl(node, argsUrl);
            break;

          case 'ParseAuthorStyleSheet':
            // @ts-ignore - 'ParseAuthorStyleSheet' event means styleSheetUrl is defined.
            addDependencyOnUrl(node, evt.args.data.styleSheetUrl);
            break;

          case 'ResourceSendRequest':
            // @ts-ignore - 'ResourceSendRequest' event means requestId is defined.
            addDependentNetworkRequest(node, evt.args.data.requestId);
            stackTraceUrls.forEach(url => addDependencyOnUrl(node, url));
            break;
        }
      }

      if (node.getNumberOfDependencies() === 0) {
        node.addDependency(rootNode);
      }
    }
  }

  /**
   * @param {LH.Artifacts.TraceOfTab} traceOfTab
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Node}
   */
  static createGraph(traceOfTab, networkRecords) {
    const networkNodeOutput = PageDependencyGraph.getNetworkNodeOutput(networkRecords);
    const cpuNodes = PageDependencyGraph.getCPUNodes(traceOfTab);

    // The root request is the earliest network request, using position in networkRecords array to break ties.
    const rootRequest = networkRecords.reduce((min, r) => (r.startTime < min.startTime ? r : min));
    const rootNode = networkNodeOutput.idToNodeMap.get(rootRequest.requestId);
    // The main document request is the earliest network request *of type document*.
    // This will be different from the root request when there are server redirects.
    const mainDocumentRequest = NetworkAnalyzer.findMainDocument(networkRecords);
    const mainDocumentNode = networkNodeOutput.idToNodeMap.get(mainDocumentRequest.requestId);

    if (!rootNode || !mainDocumentNode) {
      // Should always be found.
      throw new Error(`${rootNode ? 'mainDocument' : 'root'}Node not found.`);
    }

    if (mainDocumentNode !== rootNode &&
        (!mainDocumentNode.record.redirects ||
        !mainDocumentNode.record.redirects.includes(rootNode.record))) {
      throw new Error('Root node was not in redirect chain of mainDocument');
    }

    PageDependencyGraph.linkNetworkNodes(rootNode, networkNodeOutput);
    PageDependencyGraph.linkCPUNodes(rootNode, networkNodeOutput, cpuNodes);
    mainDocumentNode.setIsMainDocument(true);

    if (NetworkNode.hasCycle(rootNode)) {
      throw new Error('Invalid dependency graph created, cycle detected');
    }

    return rootNode;
  }

  /**
   *
   * @param {Node} rootNode
   */
  static printGraph(rootNode, widthInCharacters = 100) {
    /** @param {string} str @param {number} target */
    function padRight(str, target, padChar = ' ') {
      return str + padChar.repeat(Math.max(target - str.length, 0));
    }

    /** @type {Array<Node>} */
    const nodes = [];
    rootNode.traverse(node => nodes.push(node));
    nodes.sort((a, b) => a.startTime - b.startTime);

    const min = nodes[0].startTime;
    const max = nodes.reduce((max, node) => Math.max(max, node.endTime), 0);

    const totalTime = max - min;
    const timePerCharacter = totalTime / widthInCharacters;
    nodes.forEach(node => {
      const offset = Math.round((node.startTime - min) / timePerCharacter);
      const length = Math.ceil((node.endTime - node.startTime) / timePerCharacter);
      const bar = padRight('', offset) + padRight('', length, '=');

      // @ts-ignore -- disambiguate displayName from across possible Node types.
      const displayName = node.record ? node.record.url : node.type;
      // eslint-disable-next-line
      console.log(padRight(bar, widthInCharacters), `| ${displayName.slice(0, 30)}`);
    });
  }

  /**
   * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog}} data
   * @param {LH.Audit.Context} context
   * @return {Promise<Node>}
   */
  static async compute_(data, context) {
    const trace = data.trace;
    const devtoolsLog = data.devtoolsLog;
    const [traceOfTab, networkRecords] = await Promise.all([
      TraceOfTab.request(trace, context),
      NetworkRecords.request(devtoolsLog, context),
    ]);

    return PageDependencyGraph.createGraph(traceOfTab, networkRecords);
  }
}

module.exports = makeComputedArtifact(PageDependencyGraph);

/**
 * @typedef {Object} NetworkNodeOutput
 * @property {Array<NetworkNode>} nodes
 * @property {Map<string, NetworkNode>} idToNodeMap
 * @property {Map<string, Array<NetworkNode>>} urlToNodeMap
 */
