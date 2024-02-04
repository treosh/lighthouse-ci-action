/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Ensures every `id` attribute value of active, focusable elements is unique.
 * See base class in axe-audit.js for audit() implementation.
 */

import AxeAudit from './axe-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of an accesibility audit that checks if there are any duplicate id HTML attributes on active, focusable elements. This title is descriptive of the successful state and is shown to users when no user action is required. */
  title: '`[id]` attributes on active, focusable elements are unique',
  /** Title of an accesibility audit that checks if there are any duplicate id HTML attributes on active, focusable elements. This title is descriptive of the failing state and is shown to users when there is a failure that needs to be addressed. */
  failureTitle: '`[id]` attributes on active, focusable elements are not unique',
  /** Description of a Lighthouse audit that tells the user *why* they should try to pass. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'All focusable elements must have a unique `id` to ensure that they\'re visible to assistive technologies. [Learn how to fix duplicate `id`s](https://dequeuniversity.com/rules/axe/4.8/duplicate-id-active).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class DuplicateIdActive extends AxeAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'duplicate-id-active',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['Accessibility'],
    };
  }
}

export default DuplicateIdActive;
export {UIStrings};
