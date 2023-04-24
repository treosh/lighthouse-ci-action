/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Audit} from './audit.js';
import {NetworkRecords} from '../computed/network-records.js';
import * as i18n from '../lib/i18n/i18n.js';
import {MainThreadTasks} from '../computed/main-thread-tasks.js';
import {PageDependencyGraph} from '../computed/page-dependency-graph.js';
import {LoadSimulator} from '../computed/load-simulator.js';
import {getJavaScriptURLs, getAttributableURLForTask} from '../lib/tracehouse/task-summary.js';

/** We don't always have timing data for short tasks, if we're missing timing data. Treat it as though it were 0ms. */
const DEFAULT_TIMING = {startTime: 0, endTime: 0, duration: 0};

const UIStrings = {
  /** Title of a diagnostic LH audit that provides details on the longest running tasks that occur when the page loads. */
  title: 'Avoid long main-thread tasks',
  /** Description of a diagnostic LH audit that shows the user the longest running tasks that occur when the page loads. */
  description: 'Lists the longest tasks on the main thread, ' +
    'useful for identifying worst contributors to input delay. ' +
    '[Learn how to avoid long main-thread tasks](https://web.dev/long-tasks-devtools/)',
  /** [ICU Syntax] Label identifying the number of long-running CPU tasks that occurred while loading a web page. */
  displayValue: `{itemCount, plural,
  =1 {# long task found}
  other {# long tasks found}
  }`,
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class LongTasks extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'long-tasks',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      requiredArtifacts: ['traces', 'devtoolsLogs', 'URL'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const settings = context.settings || {};
    const URL = artifacts.URL;
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const tasks = await MainThreadTasks.request(trace, context);
    const devtoolsLog = artifacts.devtoolsLogs[LongTasks.DEFAULT_PASS];
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);

    /** @type {Map<LH.TraceEvent, LH.Gatherer.Simulation.NodeTiming>} */
    const taskTimingsByEvent = new Map();

    if (settings.throttlingMethod === 'simulate') {
      const simulatorOptions = {devtoolsLog, settings: context.settings};
      const pageGraph = await PageDependencyGraph.request({trace, devtoolsLog, URL}, context);
      const simulator = await LoadSimulator.request(simulatorOptions, context);
      const simulation = await simulator.simulate(pageGraph, {label: 'long-tasks-diagnostic'});
      for (const [node, timing] of simulation.nodeTimings.entries()) {
        if (node.type !== 'cpu') continue;
        taskTimingsByEvent.set(node.event, timing);
      }
    } else {
      for (const task of tasks) {
        if (task.unbounded || task.parent) continue;
        taskTimingsByEvent.set(task.event, task);
      }
    }

    const jsURLs = getJavaScriptURLs(networkRecords);
    // Only consider up to 20 long, top-level (no parent) tasks that have an explicit endTime
    const longtasks = tasks
      .map(t => {
        const timing = taskTimingsByEvent.get(t.event) || DEFAULT_TIMING;
        return {...t, duration: timing.duration, startTime: timing.startTime};
      })
      .filter(t => t.duration >= 50 && !t.unbounded && !t.parent)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 20);

    // TODO(beytoven): Add start time that matches with the simulated throttling
    const results = longtasks.map(task => ({
      url: getAttributableURLForTask(task, jsURLs),
      duration: task.duration,
      startTime: task.startTime,
    }));

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      /* eslint-disable max-len */
      {key: 'url', valueType: 'url', label: str_(i18n.UIStrings.columnURL)},
      {key: 'startTime', valueType: 'ms', granularity: 1, label: str_(i18n.UIStrings.columnStartTime)},
      {key: 'duration', valueType: 'ms', granularity: 1, label: str_(i18n.UIStrings.columnDuration)},
      /* eslint-enable max-len */
    ];

    const tableDetails = Audit.makeTableDetails(headings, results,
      {sortedBy: ['duration'], skipSumming: ['startTime']});

    let displayValue;
    if (results.length > 0) {
      displayValue = str_(UIStrings.displayValue, {itemCount: results.length});
    }

    return {
      score: results.length === 0 ? 1 : 0,
      notApplicable: results.length === 0,
      details: tableDetails,
      displayValue,
    };
  }
}

export default LongTasks;
export {UIStrings};
