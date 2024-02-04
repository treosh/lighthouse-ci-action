/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import MultiCheckAudit from './multi-check-audit.js';
import {ManifestValues} from '../computed/manifest-values.js';
import * as i18n from '../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on the theme color the web page has set for the browser's address bar. This descriptive title is shown to users when an address-bar theme color has been set. */
  title: 'Sets a theme color for the address bar.',
  /** Title of a Lighthouse audit that provides detail on the theme color the web page has set for the browser's address bar. This descriptive title is shown to users when an address-bar theme color has not been set. */
  failureTitle: 'Does not set a theme color for the address bar.',
  /** Description of a Lighthouse audit that tells the user why they should set a theme color for the browser's address bar. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'The browser address bar can be themed to match your site. ' +
    '[Learn more about theming the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

/**
 * @fileoverview
 * Audits if a page is configured for a themed address bar
 *
 * Requirements:
 *   * manifest is not empty
 *   * manifest has a theme_color
 *   * HTML has a theme-color meta
 *
 * Color validity is explicitly not checked.
 */

class ThemedOmnibox extends MultiCheckAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'themed-omnibox',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      supportedModes: ['navigation'],
      requiredArtifacts: ['WebAppManifest', 'InstallabilityErrors', 'MetaElements'],
    };
  }

  /**
   * @param {LH.Artifacts.MetaElement|undefined} themeColorMeta
   * @param {Array<string>} failures
   */
  static assessMetaThemecolor(themeColorMeta, failures) {
    if (!themeColorMeta) {
      // TODO(#7238): i18n
      failures.push('No `<meta name="theme-color">` tag found');
    } else if (!themeColorMeta.content) {
      failures.push('The theme-color meta tag did not contain a content value');
    }
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

    const themeColorCheck = manifestValues.allChecks.find(i => i.id === 'hasThemeColor');
    if (themeColorCheck && !themeColorCheck.passing) {
      failures.push(themeColorCheck.failureText);
    }
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<{failures: Array<string>, manifestValues: LH.Artifacts.ManifestValues, themeColor: ?string}>}
   */
  static async audit_(artifacts, context) {
    /** @type {Array<string>} */
    const failures = [];

    const themeColorMeta = artifacts.MetaElements.find(meta => meta.name === 'theme-color');
    const manifestValues = await ManifestValues.request(artifacts, context);
    ThemedOmnibox.assessManifest(manifestValues, failures);
    ThemedOmnibox.assessMetaThemecolor(themeColorMeta, failures);

    return {
      failures,
      manifestValues,
      themeColor: themeColorMeta?.content || null,
    };
  }
}

export default ThemedOmnibox;
export {UIStrings};
