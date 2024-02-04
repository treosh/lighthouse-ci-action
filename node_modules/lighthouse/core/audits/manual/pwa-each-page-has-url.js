/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ManualAudit from './manual-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that prompts the user to manually check that each page on their website uses a unique URL. */
  title: 'Each page has a URL',
  /** Description of a Lighthouse audit that tells the user why they should use unique URLs for each web page. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Ensure individual pages are deep linkable via URL and that URLs are ' +
      'unique for the purpose of shareability on social media. [Learn more about providing deep links](https://developer.chrome.com/docs/lighthouse/pwa/pwa-each-page-has-url/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview Manual PWA audit to ensure every page has a deep link.
 */

class PWAEachPageHasURL extends ManualAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return Object.assign({
      id: 'pwa-each-page-has-url',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
    }, super.partialMeta);
  }
}

export default PWAEachPageHasURL;
export {UIStrings};
