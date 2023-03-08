/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {generateFlowReportHtml} = require('../../report/generator/report-generator.js');
const {snapshotGather} = require('./gather/snapshot-runner.js');
const {startTimespanGather} = require('./gather/timespan-runner.js');
const {navigationGather} = require('./gather/navigation-runner.js');
const Runner = require('../runner.js');
const {initializeConfig} = require('./config/config.js');

/** @typedef {Parameters<snapshotGather>[0]} FrOptions */
/** @typedef {Omit<FrOptions, 'page'> & {name?: string}} UserFlowOptions */
/** @typedef {Omit<FrOptions, 'page'> & {stepName?: string}} StepOptions */
/** @typedef {WeakMap<LH.UserFlow.GatherStep, LH.Gatherer.FRGatherResult['runnerOptions']>} GatherStepRunnerOptions */

class UserFlow {
  /**
   * @param {FrOptions['page']} page
   * @param {UserFlowOptions=} options
   */
  constructor(page, options) {
    /** @type {FrOptions} */
    this.options = {page, ...options};
    /** @type {string|undefined} */
    this.name = options?.name;
    /** @type {LH.UserFlow.GatherStep[]} */
    this._gatherSteps = [];
    /** @type {GatherStepRunnerOptions} */
    this._gatherStepRunnerOptions = new WeakMap();
  }

  /**
   * @param {string} longUrl
   * @returns {string}
   */
  _shortenUrl(longUrl) {
    const url = new URL(longUrl);
    return `${url.hostname}${url.pathname}`;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {string}
   */
  _getDefaultStepName(artifacts) {
    const shortUrl = this._shortenUrl(artifacts.URL.finalUrl);
    switch (artifacts.GatherContext.gatherMode) {
      case 'navigation':
        return `Navigation report (${shortUrl})`;
      case 'timespan':
        return `Timespan report (${shortUrl})`;
      case 'snapshot':
        return `Snapshot report (${shortUrl})`;
    }
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  _getNextNavigationOptions(stepOptions) {
    const options = {...this.options, ...stepOptions};
    const configContext = {...options.configContext};
    const settingsOverrides = {...configContext.settingsOverrides};

    if (configContext.skipAboutBlank === undefined) {
      configContext.skipAboutBlank = true;
    }

    // On repeat navigations, we want to disable storage reset by default (i.e. it's not a cold load).
    const isSubsequentNavigation = this._gatherSteps
      .some(step => step.artifacts.GatherContext.gatherMode === 'navigation');
    if (isSubsequentNavigation) {
      if (settingsOverrides.disableStorageReset === undefined) {
        settingsOverrides.disableStorageReset = true;
      }
    }

    configContext.settingsOverrides = settingsOverrides;
    options.configContext = configContext;

    return options;
  }

  /**
   *
   * @param {LH.Gatherer.FRGatherResult} gatherResult
   * @param {StepOptions} options
   */
  _addGatherStep(gatherResult, options) {
    const providedName = options?.stepName;
    const gatherStep = {
      artifacts: gatherResult.artifacts,
      name: providedName || this._getDefaultStepName(gatherResult.artifacts),
      config: options.config,
      configContext: options.configContext,
    };
    this._gatherSteps.push(gatherStep);
    this._gatherStepRunnerOptions.set(gatherStep, gatherResult.runnerOptions);
  }

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor, stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = this._getNextNavigationOptions(stepOptions);
    const gatherResult = await navigationGather(requestor, options);

    this._addGatherStep(gatherResult, options);

    return gatherResult;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan(stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const timespan = await startTimespanGather(options);
    this.currentTimespan = {timespan, options};
  }

  async endTimespan() {
    if (!this.currentTimespan) throw new Error('No timespan in progress');

    const {timespan, options} = this.currentTimespan;
    const gatherResult = await timespan.endTimespanGather();
    this.currentTimespan = undefined;

    this._addGatherStep(gatherResult, options);

    return gatherResult;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot(stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const gatherResult = await snapshotGather(options);

    this._addGatherStep(gatherResult, options);

    return gatherResult;
  }

  /**
   * @returns {Promise<LH.FlowResult>}
   */
  async createFlowResult() {
    return auditGatherSteps(this._gatherSteps, {
      name: this.name,
      config: this.options.config,
      gatherStepRunnerOptions: this._gatherStepRunnerOptions,
    });
  }

  /**
   * @return {Promise<string>}
   */
  async generateReport() {
    const flowResult = await this.createFlowResult();
    return generateFlowReportHtml(flowResult);
  }

  /**
   * @return {LH.UserFlow.FlowArtifacts}
   */
  createArtifactsJson() {
    return {
      gatherSteps: this._gatherSteps,
      name: this.name,
    };
  }
}

/**
 * @param {Array<LH.UserFlow.GatherStep>} gatherSteps
 * @param {{name?: string, config?: LH.Config.Json, gatherStepRunnerOptions?: GatherStepRunnerOptions}} options
 */
async function auditGatherSteps(gatherSteps, options) {
  if (!gatherSteps.length) {
    throw new Error('Need at least one step before getting the result');
  }

  /** @type {LH.FlowResult['steps']} */
  const steps = [];
  for (const gatherStep of gatherSteps) {
    const {artifacts, name, configContext} = gatherStep;

    let runnerOptions = options.gatherStepRunnerOptions?.get(gatherStep);

    // If the gather step is not active, we must recreate the runner options.
    if (!runnerOptions) {
      // Step specific configs take precedence over a config for the entire flow.
      const configJson = gatherStep.config || options.config;
      const {gatherMode} = artifacts.GatherContext;
      const {config} = initializeConfig(configJson, {...configContext, gatherMode});
      runnerOptions = {
        config,
        computedCache: new Map(),
      };
    }

    const result = await Runner.audit(artifacts, runnerOptions);
    if (!result) throw new Error(`Step "${name}" did not return a result`);
    steps.push({lhr: result.lhr, name});
  }

  const url = new URL(gatherSteps[0].artifacts.URL.finalUrl);
  const flowName = options.name || `User flow (${url.hostname})`;
  return {steps, name: flowName};
}


module.exports = {
  UserFlow,
  auditGatherSteps,
};
