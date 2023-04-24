/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Ensure that each table header in a data table refers to data cells.
 * See base class in axe-audit.js for audit() implementation.
 */

import AxeAudit from './axe-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of an accesibility audit that evaluates if all table header elements have children. This title is descriptive of the successful state and is shown to users when no user action is required. */
  title: '`<th>` elements and elements with `[role="columnheader"/"rowheader"]` have ' +
      'data cells they describe.',
  /** Title of an accesibility audit that evaluates if all table header elements have children. This title is descriptive of the failing state and is shown to users when there is a failure that needs to be addressed. */
  failureTitle: '`<th>` elements and elements with ' +
      '`[role="columnheader"/"rowheader"]` do not have data cells they describe.',
  /** Description of a Lighthouse audit that tells the user *why* they should try to pass. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Screen readers have features to make navigating tables easier. Ensuring ' +
      'table headers always refer to some set of cells may improve the experience for screen ' +
      'reader users. ' +
      '[Learn more about table headers](https://dequeuniversity.com/rules/axe/4.6/th-has-data-cells).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class THHasDataCells extends AxeAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'th-has-data-cells',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      scoreDisplayMode: AxeAudit.SCORING_MODES.INFORMATIVE,
      requiredArtifacts: ['Accessibility'],
    };
  }
}

export default THHasDataCells;
export {UIStrings};
