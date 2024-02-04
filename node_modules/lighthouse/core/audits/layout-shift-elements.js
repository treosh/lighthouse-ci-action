/**
 * @license Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Audit} from './audit.js';
import * as i18n from '../lib/i18n/i18n.js';
import {CumulativeLayoutShift as CumulativeLayoutShiftComputed} from '../computed/metrics/cumulative-layout-shift.js';
import CumulativeLayoutShift from './metrics/cumulative-layout-shift.js';

const UIStrings = {
  /** Descriptive title of a diagnostic audit that provides the top elements affected by layout shifts. */
  title: 'Avoid large layout shifts',
  /** Description of a diagnostic audit that provides the top elements affected by layout shifts. "windowing" means the metric value is calculated using the subset of events in a small window of time during the run. "normalization" is a good substitute for "windowing". The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)',
  /**  Label for a column in a data table; entries in this column will be the amount that the corresponding element affected by layout shifts. */
  columnContribution: 'Layout shift impact',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class LayoutShiftElements extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'layout-shift-elements',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.METRIC_SAVINGS,
      guidanceLevel: 2,
      requiredArtifacts: ['traces', 'TraceElements'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const {cumulativeLayoutShift: clsSavings, impactByNodeId} =
      await CumulativeLayoutShiftComputed.request(artifacts.traces[Audit.DEFAULT_PASS], context);

    /** @type {Array<{node: LH.Audit.Details.ItemValue, score: number}>} */
    const clsElementData = artifacts.TraceElements
      .filter(element => element.traceEventType === 'layout-shift')
      .map(element => ({
        node: Audit.makeNodeItem(element.node),
        score: impactByNodeId.get(element.nodeId) || 0,
      }));

    if (clsElementData.length < impactByNodeId.size) {
      const displayedNodeImpact = clsElementData.reduce((sum, {score}) => sum += score, 0);

      // This is not necessarily the same as CLS due to normalization.
      const totalNodeImpact = Array.from(impactByNodeId.values())
        .reduce((sum, score) => sum + score);

      clsElementData.push({
        node: {
          type: 'code',
          value: str_(i18n.UIStrings.otherResourceType),
        },
        score: totalNodeImpact - displayedNodeImpact,
      });
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'node', valueType: 'node', label: str_(i18n.UIStrings.columnElement)},
      {key: 'score', valueType: 'numeric',
        granularity: 0.001, label: str_(UIStrings.columnContribution)},
    ];

    const details = Audit.makeTableDetails(headings, clsElementData);

    let displayValue;
    if (impactByNodeId.size > 0) {
      displayValue = str_(i18n.UIStrings.displayValueElementsFound,
        {nodeCount: impactByNodeId.size});
    }

    const passed = clsSavings <= CumulativeLayoutShift.defaultOptions.p10;

    return {
      score: passed ? 1 : 0,
      scoreDisplayMode: passed ? Audit.SCORING_MODES.INFORMATIVE : undefined,
      metricSavings: {
        CLS: clsSavings,
      },
      notApplicable: details.items.length === 0,
      displayValue,
      details,
    };
  }
}

export default LayoutShiftElements;
export {UIStrings};
