/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

const BLOCKING_TIME_THRESHOLD = 50;

/**
 * @param {Array<{start: number, end: number, duration: number}>} topLevelEvents
 * @param {number} startTimeMs
 * @param {number} endTimeMs
 * @return {number}
 */
function calculateSumOfBlockingTime(topLevelEvents, startTimeMs, endTimeMs) {
  if (endTimeMs <= startTimeMs) return 0;

  const threshold = BLOCKING_TIME_THRESHOLD;
  let sumBlockingTime = 0;
  for (const event of topLevelEvents) {
    // Early exit for small tasks, which should far outnumber long tasks.
    if (event.duration < threshold) continue;

    // We only want to consider tasks that fall in our time range (FCP and TTI for navigations).
    // FCP is picked as the lower bound because there is little risk of user input happening
    // before FCP so Long Queuing Qelay regions do not harm user experience. Developers should be
    // optimizing to reach FCP as fast as possible without having to worry about task lengths.
    if (event.end < startTimeMs) continue;

    // TTI is picked as the upper bound because we want a well defined end point for page load.
    if (event.start > endTimeMs) continue;

    // We first perform the clipping, and then calculate Blocking Region. So if we have a 150ms
    // task [0, 150] and FCP happens midway at 50ms, we first clip the task to [50, 150], and then
    // calculate the Blocking Region to be [100, 150]. The rational here is that tasks before FCP
    // are unimportant, so we care whether the main thread is busy more than 50ms at a time only
    // after FCP.
    const clippedStart = Math.max(event.start, startTimeMs);
    const clippedEnd = Math.min(event.end, endTimeMs);
    const clippedDuration = clippedEnd - clippedStart;
    if (clippedDuration < threshold) continue;

    // The duration of the task beyond 50ms at the beginning is considered the Blocking Region.
    // Example:
    //   [              250ms Task                   ]
    //   | First 50ms |   Blocking Region (200ms)    |
    sumBlockingTime += clippedDuration - threshold;
  }

  return sumBlockingTime;
}

export {
  BLOCKING_TIME_THRESHOLD,
  calculateSumOfBlockingTime,
};
