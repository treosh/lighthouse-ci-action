/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const ComputedResponsivenes = require('../../computed/metrics/responsiveness.js');
const i18n = require('../../lib/i18n/i18n.js');

const UIStrings = {
  /** Description of the Interaction to Next Paint metric. This description is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Interaction to Next Paint measures page responsiveness, how long it ' +
               'takes the page to visibly respond to user input. [Learn more](https://web.dev/inp/).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * @fileoverview This metric gives a high-percentile measure of responsiveness to input.
 */
class ExperimentalInteractionToNextPaint extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'experimental-interaction-to-next-paint',
      title: str_(i18n.UIStrings.interactionToNextPaint),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      supportedModes: ['timespan'],
      requiredArtifacts: ['traces'],
    };
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      // https://web.dev/inp/
      // This is using the same threshold as field tools since only supported in
      // unsimulated user flows for now.
      // see https://www.desmos.com/calculator/4xtrhg51th
      p10: 200,
      median: 500,
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const {settings} = context;
    // TODO: responsiveness isn't yet supported by lantern.
    if (settings.throttlingMethod === 'simulate') {
      return {score: null, notApplicable: true};
    }

    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const metricData = {trace, settings};
    const interactionEvent = await ComputedResponsivenes.request(metricData, context);

    // TODO: include the no-interaction state in the report instead of using n/a.
    if (interactionEvent === null) {
      return {score: null, notApplicable: true};
    }

    // TODO: remove workaround once 103.0.5052.0 is sufficiently released.
    const timing = interactionEvent.name === 'FallbackTiming' ?
        interactionEvent.duration : interactionEvent.args.data.duration;

    return {
      score: Audit.computeLogNormalScore({p10: context.options.p10, median: context.options.median},
        timing),
      numericValue: timing,
      numericUnit: 'millisecond',
      displayValue: str_(i18n.UIStrings.ms, {timeInMs: timing}),
    };
  }
}

module.exports = ExperimentalInteractionToNextPaint;
module.exports.UIStrings = UIStrings;
