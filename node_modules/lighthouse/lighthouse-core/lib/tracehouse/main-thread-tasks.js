/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {taskGroups, taskNameToGroup} = require('./task-groups.js');

/**
 * @fileoverview
 *
 * This artifact converts the array of raw trace events into an array of hierarchical
 * tasks for easier consumption and bottom-up analysis.
 *
 * Events are easily produced but difficult to consume. They're a mixture of start/end markers, "complete" events, etc.
 * @see https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview
 *
 * LH's TaskNode is an artifact that fills in the gaps a trace event leaves behind.
 * i.e. when did it end? which events are children/parents of this one?
 *
 * Each task will have its group/classification, start time, end time,
 * duration, and self time computed. Each task will potentially have a parent, children, and an
 * attributableURL for the script that was executing/forced this execution.
 */

/** @typedef {import('./task-groups.js').TaskGroup} TaskGroup */

/**
 * @typedef TaskNode
 * @prop {LH.TraceEvent} event
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {number} startTime
 * @prop {number} endTime
 * @prop {number} duration
 * @prop {number} selfTime
 * @prop {string[]} attributableURLs
 * @prop {TaskGroup} group
 */

/** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */

class MainThreadTasks {
  /**
   * @param {LH.TraceEvent} event
   * @param {TaskNode} [parent]
   * @return {TaskNode}
   */
  static _createNewTaskNode(event, parent) {
    const newTask = {
      event,
      startTime: event.ts,
      endTime: event.ph === 'X' ? event.ts + Number(event.dur || 0) : NaN,
      parent: parent,
      children: [],

      // These properties will be filled in later
      attributableURLs: [],
      group: taskGroups.other,
      duration: NaN,
      selfTime: NaN,
    };

    if (parent) {
      parent.children.push(newTask);
    }

    return newTask;
  }

  /**
   * @param {LH.TraceEvent[]} mainThreadEvents
   * @param {PriorTaskData} priorTaskData
   * @param {number} traceEndTs
   * @return {TaskNode[]}
   */
  static _createTasksFromEvents(mainThreadEvents, priorTaskData, traceEndTs) {
    /** @type {TaskNode[]} */
    const tasks = [];
    /** @type {TaskNode|undefined} */
    let currentTask;

    for (const event of mainThreadEvents) {
      // Save the timer data, TimerInstall events are instant events `ph === 'I'` so process them first.
      if (event.name === 'TimerInstall' && currentTask) {
        /** @type {string} */
        // @ts-ignore - timerId exists when name is TimerInstall
        const timerId = event.args.data.timerId;
        priorTaskData.timers.set(timerId, currentTask);
      }

      // Only look at X (Complete), B (Begin), and E (End) events as they have most data
      if (event.ph !== 'X' && event.ph !== 'B' && event.ph !== 'E') continue;

      // Update currentTask based on the elapsed time.
      // The next event may be after currentTask has ended.
      while (
        currentTask &&
        Number.isFinite(currentTask.endTime) &&
        currentTask.endTime <= event.ts
      ) {
        currentTask = currentTask.parent;
      }

      // If we don't have a current task, start a new one.
      if (!currentTask) {
        // We can't start a task with an end event
        if (event.ph === 'E') {
          throw new Error('Fatal trace logic error - unexpected end event');
        }

        currentTask = MainThreadTasks._createNewTaskNode(event);
        tasks.push(currentTask);

        continue;
      }

      if (event.ph === 'X' || event.ph === 'B') {
        // We're starting a nested event, create it as a child and make it the currentTask
        const newTask = MainThreadTasks._createNewTaskNode(event, currentTask);
        tasks.push(newTask);
        currentTask = newTask;
      } else {
        if (currentTask.event.ph !== 'B') {
          throw new Error(
            `Fatal trace logic error - expected start event, got ${currentTask.event.ph}`);
        }

        // We're ending an event, update the end time and the currentTask to its parent
        currentTask.endTime = event.ts;
        currentTask = currentTask.parent;
      }
    }

    // Starting from the last and bottom-most task, we finish any tasks that didn't end yet.
    while (currentTask && !Number.isFinite(currentTask.endTime)) {
      // The last event didn't finish before tracing stopped, use traceEnd timestamp instead.
      currentTask.endTime = traceEndTs;
      currentTask = currentTask.parent;
    }

    // At this point we expect all tasks to have a finite startTime and endTime.
    return tasks;
  }

  /**
   * @param {TaskNode} task
   * @param {TaskNode|undefined} parent
   * @return {number}
   */
  static _computeRecursiveSelfTime(task, parent) {
    if (parent && task.endTime > parent.endTime) {
      throw new Error('Fatal trace logic error - child cannot end after parent');
    }

    const childTime = task.children
      .map(child => MainThreadTasks._computeRecursiveSelfTime(child, task))
      .reduce((sum, child) => sum + child, 0);
    task.duration = task.endTime - task.startTime;
    task.selfTime = task.duration - childTime;
    return task.duration;
  }

  /**
   * @param {TaskNode} task
   * @param {string[]} parentURLs
   * @param {PriorTaskData} priorTaskData
   */
  static _computeRecursiveAttributableURLs(task, parentURLs, priorTaskData) {
    const argsData = task.event.args.data || {};
    const stackFrameURLs = (argsData.stackTrace || []).map(entry => entry.url);

    /** @type {Array<string|undefined>} */
    let taskURLs = [];
    switch (task.event.name) {
      /**
       * Some trace events reference a specific script URL that triggered them.
       * Use this URL as the higher precedence attributable URL.
       * @see https://cs.chromium.org/chromium/src/third_party/blink/renderer/devtools/front_end/timeline/TimelineUIUtils.js?type=cs&q=_initEventStyles+-f:out+f:devtools&sq=package:chromium&g=0&l=678-744
       */
      case 'v8.compile':
      case 'EvaluateScript':
      case 'FunctionCall':
        taskURLs = [argsData.url].concat(stackFrameURLs);
        break;
      case 'v8.compileModule':
        taskURLs = [task.event.args.fileName].concat(stackFrameURLs);
        break;
      case 'TimerFire': {
        /** @type {string} */
        // @ts-ignore - timerId exists when name is TimerFire
        const timerId = task.event.args.data.timerId;
        const timerInstallerTaskNode = priorTaskData.timers.get(timerId);
        if (!timerInstallerTaskNode) break;
        taskURLs = timerInstallerTaskNode.attributableURLs.concat(stackFrameURLs);
        break;
      }
      default:
        taskURLs = stackFrameURLs;
        break;
    }

    /** @type {string[]} */
    const attributableURLs = Array.from(parentURLs);
    for (const url of taskURLs) {
      // Don't add empty URLs
      if (!url) continue;
      // Don't add consecutive, duplicate URLs
      if (attributableURLs[attributableURLs.length - 1] === url) continue;
      attributableURLs.push(url);
    }

    task.attributableURLs = attributableURLs;
    task.children.forEach(child =>
      MainThreadTasks._computeRecursiveAttributableURLs(child, attributableURLs, priorTaskData));
  }

  /**
   * @param {TaskNode} task
   * @param {TaskGroup} [parentGroup]
   */
  static _computeRecursiveTaskGroup(task, parentGroup) {
    const group = taskNameToGroup[task.event.name];
    task.group = group || parentGroup || taskGroups.other;
    task.children.forEach(child => MainThreadTasks._computeRecursiveTaskGroup(child, task.group));
  }

  /**
   * @param {LH.TraceEvent[]} traceEvents
   * @param {number} traceEndTs
   * @return {TaskNode[]}
   */
  static getMainThreadTasks(traceEvents, traceEndTs) {
    const timers = new Map();
    const priorTaskData = {timers};
    const tasks = MainThreadTasks._createTasksFromEvents(traceEvents, priorTaskData, traceEndTs);

    // Compute the recursive properties we couldn't compute earlier, starting at the toplevel tasks
    for (const task of tasks) {
      if (task.parent) continue;

      MainThreadTasks._computeRecursiveSelfTime(task, undefined);
      MainThreadTasks._computeRecursiveAttributableURLs(task, [], priorTaskData);
      MainThreadTasks._computeRecursiveTaskGroup(task);
    }

    // Rebase all the times to be relative to start of trace in ms
    const firstTs = (tasks[0] || {startTime: 0}).startTime;
    for (const task of tasks) {
      task.startTime = (task.startTime - firstTs) / 1000;
      task.endTime = (task.endTime - firstTs) / 1000;
      task.duration /= 1000;
      task.selfTime /= 1000;

      // sanity check that we have selfTime which captures all other timing data
      if (!Number.isFinite(task.selfTime)) {
        throw new Error('Invalid task timing data');
      }
    }

    return tasks;
  }
}

module.exports = MainThreadTasks;
