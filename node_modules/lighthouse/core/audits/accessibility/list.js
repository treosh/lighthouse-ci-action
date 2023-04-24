/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Ensures that lists are structured correctly.
 * See base class in axe-audit.js for audit() implementation.
 */

import AxeAudit from './axe-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of an accesibility audit that evaluates if all list elements have a valid structure containing only list items. This title is descriptive of the successful state and is shown to users when no user action is required. */
  title: 'Lists contain only `<li>` elements and script supporting elements ' +
      '(`<script>` and `<template>`).',
  /** Title of an accesibility audit that evaluates if all list elements have a valid structure containing only list items. This title is descriptive of the failing state and is shown to users when there is a failure that needs to be addressed. */
  failureTitle: 'Lists do not contain only `<li>` elements and script ' +
      'supporting elements (`<script>` and `<template>`).',
  /** Description of a Lighthouse audit that tells the user *why* they should try to pass. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Screen readers have a specific way of announcing lists. Ensuring proper list ' +
      'structure aids screen reader output. ' +
      '[Learn more about proper list structure](https://dequeuniversity.com/rules/axe/4.6/list).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class List extends AxeAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'list',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['Accessibility'],
    };
  }
}

export default List;
export {UIStrings};
