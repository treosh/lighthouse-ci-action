/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Ensures every ARIA button, link and menuitem element has an accessible name
 * See base class in axe-audit.js for audit() implementation.
 */

import AxeAudit from './axe-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of an accessibility audit that evaluates if important HTML elements have an accessible name. This title is descriptive of the successful state and is shown to users when no user action is required. */
  title: '`button`, `link`, and `menuitem` elements have accessible names',
  /** Title of an accessibility audit that evaluates if important HTML elements do not have accessible names. This title is descriptive of the failing state and is shown to users when there is a failure that needs to be addressed. */
  failureTitle: '`button`, `link`, and `menuitem` elements do not have accessible names.',
  /** Description of a Lighthouse audit that tells the user *why* they should have accessible names for HTML elements. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'When an element doesn\'t have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn how to make command elements more accessible](https://dequeuniversity.com/rules/axe/4.6/aria-command-name).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class AriaCommandName extends AxeAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'aria-command-name',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['Accessibility'],
    };
  }
}

export default AriaCommandName;
export {UIStrings};
