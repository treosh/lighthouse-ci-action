/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @fileoverview This file is no longer used internally, but remains here for backcompat with plugins. */

const log = require('lighthouse-logger');
const makeComputedArtifact = require('./computed-artifact.js');
const ProcessedTrace = require('./processed-trace.js');
const ProcessedNavigation = require('./processed-navigation.js');

class TraceOfTab {
  /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<any>}
    */
  static async compute_(trace, context) {
    const processedTrace = await ProcessedTrace.request(trace, context);
    const processedNavigation = await ProcessedNavigation.request(processedTrace, context);
    return {...processedTrace, ...processedNavigation};
  }
}

log.warn(`trace-of-tab`, `trace-of-tab is deprecated, use processed-trace / processed-navigation instead`); // eslint-disable-line max-len
module.exports = makeComputedArtifact(TraceOfTab, null);

