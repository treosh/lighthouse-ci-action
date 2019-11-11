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
   * @param {Pick<LH.TraceEvent, 'ph'|'ts'>} [endEvent]
   * @return {TaskNode}
   */
  static _createNewTaskNode(event, endEvent) {
    const isCompleteEvent = event.ph === 'X' && !endEvent;
    const isStartEndEventPair = event.ph === 'B' && endEvent && endEvent.ph === 'E';
    if (!isCompleteEvent && !isStartEndEventPair) {
      throw new Error('Invalid parameters for _createNewTaskNode');
    }

    const startTime = event.ts;
    const endTime = endEvent ? endEvent.ts : event.ts + Number(event.dur || 0);

    const newTask = {
      event,
      startTime,
      endTime,
      duration: endTime - startTime,

      // These properties will be filled in later
      parent: undefined,
      children: [],
      attributableURLs: [],
      group: taskGroups.other,
      selfTime: NaN,
    };

    return newTask;
  }

  /**
   *
   * @param {TaskNode} currentTask
   * @param {number} stopTs
   * @param {PriorTaskData} priorTaskData
   * @param {Array<LH.TraceEvent>} reverseEventsQueue
   */
  static _assignAllTimersUntilTs(
      currentTask,
      stopTs,
      priorTaskData,
      reverseEventsQueue
  ) {
    while (reverseEventsQueue.length) {
      const nextTimerInstallEvent = reverseEventsQueue.pop();
      // We're out of events to look at; we're done.
      if (!nextTimerInstallEvent) break;

      // Timer event is after our current task; push it back on for next time, and we're done.
      if (nextTimerInstallEvent.ts > stopTs) {
        reverseEventsQueue.push(nextTimerInstallEvent);
        break;
      }

      // Timer event is before the current task, just skip it.
      if (nextTimerInstallEvent.ts < currentTask.startTime) {
        continue;
      }

      // We're right where we need to be, point the timerId to our `currentTask`
      /** @type {string} */
      // @ts-ignore - timerId exists on `TimerInstall` events.
      const timerId = nextTimerInstallEvent.args.data.timerId;
      priorTaskData.timers.set(timerId, currentTask);
    }
  }

  /**
   * This function takes the start and end events from a thread and creates tasks from them.
   * We do this by iterating through the start and end event arrays simultaneously. For each start
   * event we attempt to find its end event.
   *
   * Because of this matching of start/end events and the need to be mutating our end events queue,
   * we reverse the array to more efficiently `.pop()` them off rather than `.shift()` them off.
   * While it's true the worst case runtime here is O(n^2), ~99.999% of the time the reverse loop is O(1)
   * because the overwhelmingly common case is that end event for a given start event is simply the very next event in our queue.
   *
   * @param {LH.TraceEvent[]} taskStartEvents
   * @param {LH.TraceEvent[]} taskEndEvents
   * @param {number} traceEndTs
   * @return {TaskNode[]}
   */
  static _createTasksFromStartAndEndEvents(taskStartEvents, taskEndEvents, traceEndTs) {
    /** @type {TaskNode[]} */
    const tasks = [];
    // Create a reversed copy of the array to avoid copying the rest of the queue on every mutation.
    // i.e. pop() is O(1) while shift() is O(n), we take the earliest ts element off the queue *a lot*
    // so we'll optimize for having the earliest timestamp events at the end of the array.
    const taskEndEventsReverseQueue = taskEndEvents.slice().reverse();

    for (let i = 0; i < taskStartEvents.length; i++) {
      const taskStartEvent = taskStartEvents[i];
      if (taskStartEvent.ph === 'X') {
        // Task is a complete X event, we have all the information we need already.
        tasks.push(MainThreadTasks._createNewTaskNode(taskStartEvent));
        continue;
      }

      // Task is a B/E event pair, we need to find the matching E event.
      let matchedEventIndex = -1;
      let matchingNestedEventCount = 0;
      let matchingNestedEventIndex = i + 1;

      // We loop through the reversed end events queue from back to front because we still want to
      // see end events in increasing timestamp order.
      // While worst case we will loop through all events, the overwhelmingly common case is that
      // the immediate next event is our event of interest which makes this loop typically O(1).
      for (let j = taskEndEventsReverseQueue.length - 1; j >= 0; j--) {
        const endEvent = taskEndEventsReverseQueue[j];
        // We are considering an end event, so we'll count how many nested events we saw along the way.
        for (; matchingNestedEventIndex < taskStartEvents.length; matchingNestedEventIndex++) {
          if (taskStartEvents[matchingNestedEventIndex].ts >= endEvent.ts) break;

          if (taskStartEvents[matchingNestedEventIndex].name === taskStartEvent.name) {
            matchingNestedEventCount++;
          }
        }

        // The event doesn't have a matching name, skip it.
        if (endEvent.name !== taskStartEvent.name) continue;
        // The event has a timestamp that is too early, skip it.
        if (endEvent.ts < taskStartEvent.ts) continue;

        // The event matches our name and happened after start, the last thing to check is if it was for a nested event.
        if (matchingNestedEventCount > 0) {
          // If it was for a nested event, decrement our counter and move on.
          matchingNestedEventCount--;
          continue;
        }

        // If it wasn't, we found our matching E event! Mark the index and stop the loop.
        matchedEventIndex = j;
        break;
      }

      /** @type {Pick<LH.TraceEvent, 'ph'|'ts'>} */
      let taskEndEvent;
      if (matchedEventIndex === -1) {
        // If we couldn't find an end event, we'll assume it's the end of the trace.
        // If this creates invalid parent/child relationships it will be caught in the next step.
        taskEndEvent = {ph: 'E', ts: traceEndTs};
      } else if (matchedEventIndex === taskEndEventsReverseQueue.length - 1) {
        // Use .pop() in the common case where the immediately next event is needed.
        // It's ~25x faster, https://jsperf.com/pop-vs-splice.
        taskEndEvent = /** @type {LH.TraceEvent} */ (taskEndEventsReverseQueue.pop());
      } else {
        taskEndEvent = taskEndEventsReverseQueue.splice(matchedEventIndex, 1)[0];
      }

      tasks.push(MainThreadTasks._createNewTaskNode(taskStartEvent, taskEndEvent));
    }

    if (taskEndEventsReverseQueue.length) {
      throw new Error(
        `Fatal trace logic error - ${taskEndEventsReverseQueue.length} unmatched end events`
      );
    }

    return tasks;
  }

  /**
   * This function iterates through the tasks to set the `.parent`/`.children` properties of tasks
   * according to their implied nesting structure. If any of these relationships seem impossible based on
   * the timestamps, this method will throw.
   *
   * @param {TaskNode[]} sortedTasks
   * @param {LH.TraceEvent[]} timerInstallEvents
   * @param {PriorTaskData} priorTaskData
   */
  static _createTaskRelationships(sortedTasks, timerInstallEvents, priorTaskData) {
    /** @type {TaskNode|undefined} */
    let currentTask;
    // Create a reversed copy of the array to avoid copying the rest of the queue on every mutation.
    const timerInstallEventsReverseQueue = timerInstallEvents.slice().reverse();

    for (let i = 0; i < sortedTasks.length; i++) {
      const nextTask = sortedTasks[i];

      // This inner loop updates what our `currentTask` is at `nextTask.startTime - ε`.
      // While `nextTask` starts after our `currentTask`, close out the task, popup to the parent, and repeat.
      // If at the end `currentTask` is undefined, then `nextTask` is a toplevel task.
      // Otherwise, `nextTask` is a child of `currentTask`.
      while (
        currentTask &&
        Number.isFinite(currentTask.endTime) &&
        currentTask.endTime <= nextTask.startTime
      ) {
        MainThreadTasks._assignAllTimersUntilTs(
          currentTask,
          currentTask.endTime,
          priorTaskData,
          timerInstallEventsReverseQueue
        );
        currentTask = currentTask.parent;
      }

      // If there's a `currentTask`, `nextTask` must be a child.
      // Set the `.parent`/`.children` relationships and timer bookkeeping accordingly.
      if (currentTask) {
        if (nextTask.endTime > currentTask.endTime) {
          const timeDelta = nextTask.endTime - currentTask.endTime;
          // The child task is taking longer than the parent task, which should be impossible.
          //    If it's less than 1ms, we'll let it slide by increasing the duration of the parent.
          //    If it's more, throw an error.
          if (timeDelta < 1000) {
            currentTask.endTime = nextTask.endTime;
            currentTask.duration += timeDelta;
          } else {
            // If we fell into this error, it's usually because of one of three reasons.
            //    - We were missing an E event for a child task and we assumed the child ended at the end of the trace.
            //    - There was slop in the opposite direction (child started 1ms before parent) and the child was assumed to be parent instead.
            //    - The child timestamp ended more than 1ms after tha parent.
            // These have more complicated fixes, so handling separately https://github.com/GoogleChrome/lighthouse/pull/9491#discussion_r327331204.
            throw new Error('Fatal trace logic error - child cannot end after parent');
          }
        }

        nextTask.parent = currentTask;
        currentTask.children.push(nextTask);
        MainThreadTasks._assignAllTimersUntilTs(
          currentTask,
          nextTask.startTime,
          priorTaskData,
          timerInstallEventsReverseQueue
        );
      }

      currentTask = nextTask;
    }

    if (currentTask) {
      MainThreadTasks._assignAllTimersUntilTs(
        currentTask,
        currentTask.endTime,
        priorTaskData,
        timerInstallEventsReverseQueue
      );
    }
  }

  /**
   * This function takes the raw trace events sorted in increasing timestamp order and outputs connected task nodes.
   * To create the task heirarchy we make several passes over the events.
   *
   *    1. Create three arrays of X/B events, E events, and TimerInstall events.
   *    2. Create tasks for each X/B event, throwing if a matching E event cannot be found for a given B.
   *    3. Sort the tasks by ↑ startTime, ↓ duration.
   *    4. Match each task to its parent, throwing if there is any invalid overlap between tasks.
   *
   * @param {LH.TraceEvent[]} mainThreadEvents
   * @param {PriorTaskData} priorTaskData
   * @param {number} traceEndTs
   * @return {TaskNode[]}
   */
  static _createTasksFromEvents(mainThreadEvents, priorTaskData, traceEndTs) {
    /** @type {Array<LH.TraceEvent>} */
    const taskStartEvents = [];
    /** @type {Array<LH.TraceEvent>} */
    const taskEndEvents = [];
    /** @type {Array<LH.TraceEvent>} */
    const timerInstallEvents = [];

    // Phase 1 - Create three arrays of X/B events, E events, and TimerInstall events.
    for (const event of mainThreadEvents) {
      if (event.ph === 'X' || event.ph === 'B') taskStartEvents.push(event);
      if (event.ph === 'E') taskEndEvents.push(event);
      if (event.name === 'TimerInstall') timerInstallEvents.push(event);
    }

    // Phase 2 - Create tasks for each taskStartEvent.
    const tasks = MainThreadTasks._createTasksFromStartAndEndEvents(
      taskStartEvents,
      taskEndEvents,
      traceEndTs
    );

    // Phase 3 - Sort the tasks by increasing startTime, decreasing duration.
    const sortedTasks = tasks.sort(
      (taskA, taskB) => taskA.startTime - taskB.startTime || taskB.duration - taskA.duration
    );

    // Phase 4 - Match each task to its parent.
    MainThreadTasks._createTaskRelationships(sortedTasks, timerInstallEvents, priorTaskData);

    return sortedTasks;
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
      MainThreadTasks._computeRecursiveAttributableURLs(child, attributableURLs, priorTaskData)
    );
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
   * @param {LH.TraceEvent[]} mainThreadEvents
   * @param {number} traceEndTs
   * @return {TaskNode[]}
   */
  static getMainThreadTasks(mainThreadEvents, traceEndTs) {
    const timers = new Map();
    const priorTaskData = {timers};
    const tasks = MainThreadTasks._createTasksFromEvents(
      mainThreadEvents,
      priorTaskData,
      traceEndTs
    );

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
