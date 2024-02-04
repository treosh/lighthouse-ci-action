/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ManualAudit from './manual-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that prompts the user to manually check that page transitions (navigating to other pages on a website) shouldn't feel like they are waiting for the network to load. */
  title: 'Page transitions don\'t feel like they block on the network',
  /** Description of a Lighthouse audit that tells the user why they should make transitions in their web app feel fast. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Transitions should feel snappy as you tap around, even on a slow network. ' +
    'This experience is key to a user\'s perception of performance. [Learn more about page transitions](https://developer.chrome.com/docs/lighthouse/pwa/pwa-page-transitions/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview Manual PWA audit for janky-free page transitions.
 */

class PWAPageTransitions extends ManualAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return Object.assign({
      id: 'pwa-page-transitions',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
    }, super.partialMeta);
  }
}

export default PWAPageTransitions;
export {UIStrings};
