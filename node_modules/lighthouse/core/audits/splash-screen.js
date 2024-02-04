/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import MultiCheckAudit from './multi-check-audit.js';
import {ManifestValues} from '../computed/manifest-values.js';
import * as i18n from '../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on splash screens. This descriptive title is shown to users when the site has a custom splash screen. */
  title: 'Configured for a custom splash screen',
  /** Title of a Lighthouse audit that provides detail on splash screens. This descriptive title is shown to users when the site does not have a custom splash screen. */
  failureTitle: 'Is not configured for a custom splash screen',
  /** Description of a Lighthouse audit that tells the user why they should configure a custom splash screen. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'A themed splash screen ensures a high-quality experience when ' +
    'users launch your app from their homescreens. ' +
    '[Learn more about splash screens](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview
 * Audits if a page is configured for a custom splash screen when launched
 * https://github.com/GoogleChrome/lighthouse/issues/24
 *
 * Requirements:
 *   * manifest is not empty
 *   * manifest has a valid name
 *   * manifest has a valid background_color
 *   * manifest has a valid theme_color
 *   * manifest contains icon that's a png and size >= 512px
 */

class SplashScreen extends MultiCheckAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'splash-screen',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      supportedModes: ['navigation'],
      requiredArtifacts: ['WebAppManifest', 'InstallabilityErrors'],
    };
  }

  /**
   * @param {LH.Artifacts.ManifestValues} manifestValues
   * @param {Array<string>} failures
   */
  static assessManifest(manifestValues, failures) {
    if (manifestValues.isParseFailure && manifestValues.parseFailureReason) {
      failures.push(manifestValues.parseFailureReason);
      return;
    }

    const splashScreenCheckIds = [
      'hasName',
      'hasBackgroundColor',
      'hasThemeColor',
      'hasIconsAtLeast512px',
    ];

    manifestValues.allChecks
      .filter(item => splashScreenCheckIds.includes(item.id))
      .forEach(item => {
        if (!item.passing) {
          failures.push(item.failureText);
        }
      });
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<{failures: Array<string>, manifestValues: LH.Artifacts.ManifestValues}>}
   */
  static async audit_(artifacts, context) {
    /** @type {Array<string>} */
    const failures = [];

    const manifestValues = await ManifestValues.request(artifacts, context);
    SplashScreen.assessManifest(manifestValues, failures);

    return {
      failures,
      manifestValues,
    };
  }
}

export default SplashScreen;
export {UIStrings};
