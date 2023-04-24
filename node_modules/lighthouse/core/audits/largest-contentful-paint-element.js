/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Audit} from './audit.js';
import * as i18n from '../lib/i18n/i18n.js';

const UIStrings = {
  /** Descriptive title of a diagnostic audit that provides the element that was determined to be the Largest Contentful Paint. */
  title: 'Largest Contentful Paint element',
  /** Description of a Lighthouse audit that tells the user that the element shown was determined to be the Largest Contentful Paint. */
  description: 'This is the largest contentful element painted within the viewport. ' +
    '[Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class LargestContentfulPaintElement extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'largest-contentful-paint-element',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      supportedModes: ['navigation'],
      requiredArtifacts: ['traces', 'TraceElements'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    const lcpElement = artifacts.TraceElements
      .find(element => element.traceEventType === 'largest-contentful-paint');
    const lcpElementDetails = [];
    if (lcpElement) {
      lcpElementDetails.push({
        node: Audit.makeNodeItem(lcpElement.node),
      });
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'node', valueType: 'node', label: str_(i18n.UIStrings.columnElement)},
    ];

    const details = Audit.makeTableDetails(headings, lcpElementDetails);

    const displayValue = str_(i18n.UIStrings.displayValueElementsFound,
      {nodeCount: lcpElementDetails.length});

    return {
      score: 1,
      notApplicable: lcpElementDetails.length === 0,
      displayValue,
      details,
    };
  }
}

export default LargestContentfulPaintElement;
export {UIStrings};
