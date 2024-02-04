/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Audit} from './audit.js';
import {ManifestValues} from '../computed/manifest-values.js';
import * as i18n from '../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on if the manifest contains a maskable icon. This descriptive title is shown to users when the manifest contains at least one maskable icon. */
  title: 'Manifest has a maskable icon',
  /** Title of a Lighthouse audit that provides detial on if the manifest contains a maskable icon. this descriptive title is shown to users when the manifest contains no icons that are maskable. */
  failureTitle: 'Manifest doesn\'t have a maskable icon',
  /** Description of a Lighthouse audit that tells the user why they their manifest should have at least one maskable icon. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'A maskable icon ensures that the image fills the entire ' +
    'shape without being letterboxed when installing ' +
    'the app on a device. [Learn about maskable manifest icons](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview
 * Audits if a manifest contains at least one icon that is maskable
 *
 * Requirements:
 *    * manifest is not empty
 *    * manifest has valid icons
 *    * at least one of the icons has a purpose of 'maskable'
 */

class MaskableIcon extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'maskable-icon',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      supportedModes: ['navigation'],
      requiredArtifacts: ['WebAppManifest', 'InstallabilityErrors'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const manifestValues = await ManifestValues.request(artifacts, context);
    if (manifestValues.isParseFailure) {
      return {
        score: 0,
        explanation: manifestValues.parseFailureReason,
      };
    }
    const maskableIconCheck = manifestValues.allChecks.find(i => i.id === 'hasMaskableIcon');
    return {
      score: maskableIconCheck?.passing ? 1 : 0,
    };
  }
}

export default MaskableIcon;
export {UIStrings};
