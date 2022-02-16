/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {generateFlowReportHtml} = require('../../report/generator/report-generator.js');
const {snapshot} = require('./gather/snapshot-runner.js');
const {startTimespan} = require('./gather/timespan-runner.js');
const {navigation} = require('./gather/navigation-runner.js');

/** @typedef {Parameters<snapshot>[0]} FrOptions */
/** @typedef {Omit<FrOptions, 'page'> & {name?: string}} UserFlowOptions */
/** @typedef {Omit<FrOptions, 'page'> & {stepName?: string}} StepOptions */

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
    /** @type {LH.FlowResult.Step[]} */
    this.steps = [];
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
   * @param {LH.Result} lhr
   * @return {string}
   */
  _getDefaultStepName(lhr) {
    const shortUrl = this._shortenUrl(lhr.finalUrl);
    switch (lhr.gatherMode) {
      case 'navigation':
        return `Navigation report (${shortUrl})`;
      case 'timespan':
        return `Timespan report (${shortUrl})`;
      case 'snapshot':
        return `Snapshot report (${shortUrl})`;
    }
  }

  /**
   * @param {string} url
   * @param {StepOptions=} stepOptions
   */
  _getNextNavigationOptions(url, stepOptions) {
    const options = {url, ...this.options, ...stepOptions};
    const configContext = {...options.configContext};
    const settingsOverrides = {...configContext.settingsOverrides};

    if (configContext.skipAboutBlank === undefined) {
      configContext.skipAboutBlank = true;
    }

    // On repeat navigations, we want to disable storage reset by default (i.e. it's not a cold load).
    const isSubsequentNavigation = this.steps.some(step => step.lhr.gatherMode === 'navigation');
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
   * @param {string} url
   * @param {StepOptions=} stepOptions
   */
  async navigate(url, stepOptions) {
    if (this.currentTimespan) throw Error('Timespan already in progress');

    const result = await navigation(this._getNextNavigationOptions(url, stepOptions));
    if (!result) throw Error('Navigation returned undefined');

    const providedName = stepOptions?.stepName;
    this.steps.push({
      lhr: result.lhr,
      name: providedName || this._getDefaultStepName(result.lhr),
    });

    return result;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan(stepOptions) {
    if (this.currentTimespan) throw Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const timespan = await startTimespan(options);
    this.currentTimespan = {timespan, options};
  }

  async endTimespan() {
    if (!this.currentTimespan) throw Error('No timespan in progress');

    const {timespan, options} = this.currentTimespan;
    const result = await timespan.endTimespan();
    this.currentTimespan = undefined;
    if (!result) throw Error('Timespan returned undefined');

    const providedName = options?.stepName;
    this.steps.push({
      lhr: result.lhr,
      name: providedName || this._getDefaultStepName(result.lhr),
    });

    return result;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot(stepOptions) {
    if (this.currentTimespan) throw Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const result = await snapshot(options);
    if (!result) throw Error('Snapshot returned undefined');

    const providedName = stepOptions?.stepName;
    this.steps.push({
      lhr: result.lhr,
      name: providedName || this._getDefaultStepName(result.lhr),
    });

    return result;
  }

  /**
   * @return {LH.FlowResult}
   */
  getFlowResult() {
    if (!this.steps.length) throw Error('Need at least one step before getting the flow result');
    const url = new URL(this.steps[0].lhr.finalUrl);
    const name = this.name || `User flow (${url.hostname})`;
    return {steps: this.steps, name};
  }

  /**
   * @return {string}
   */
  generateReport() {
    const flowResult = this.getFlowResult();
    return generateFlowReportHtml(flowResult);
  }
}

module.exports = UserFlow;
