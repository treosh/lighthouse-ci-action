
/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import ManualAudit from './manual-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that prompts the user to manually check that their site works across different web browsers. */
  title: 'Site works cross-browser',
  /** Description of a Lighthouse audit that tells the user why they should make sites work across different browsers. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'To reach the most number of users, sites should work across ' +
  'every major browser. [Learn about cross-browser compatibility](https://developer.chrome.com/docs/lighthouse/pwa/pwa-cross-browser/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview Manual PWA audit for cross browser support.
 */

class PWACrossBrowser extends ManualAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return Object.assign({
      id: 'pwa-cross-browser',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
    }, super.partialMeta);
  }
}

export default PWACrossBrowser;
export {UIStrings};

