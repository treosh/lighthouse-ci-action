/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview
 * Audit that checks whether fonts that use `font-display: optional` were preloaded.
 */

import {Audit} from './audit.js';
import * as i18n from './../lib/i18n/i18n.js';
import FontDisplay from './../audits/font-display.js';
const PASSING_FONT_DISPLAY_REGEX = /^(optional)$/;
import {NetworkRecords} from '../computed/network-records.js';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on whether fonts that used `font-display: optional` were preloaded. This descriptive title is shown to users when all fonts that used `font-display: optional` were preloaded. */
  title: 'Fonts with `font-display: optional` are preloaded',
  /** Title of a Lighthouse audit that provides detail on whether fonts that used `font-display: optional` were preloaded. This descriptive title is shown to users when one or more fonts used `font-display: optional` and were not preloaded. */
  failureTitle: 'Fonts with `font-display: optional` are not preloaded',
  /** Description of a Lighthouse audit that tells the user why they should preload fonts if they are using `font-display: optional`. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Preload `optional` fonts so first-time visitors may use them. [Learn more about preloading fonts](https://web.dev/preload-optional-fonts/)',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class PreloadFontsAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'preload-fonts',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['devtoolsLogs', 'URL', 'CSSUsage'],
    };
  }

  /**
   * Finds which font URLs were attempted to be preloaded,
   * ignoring those that failed to be reused and were requested again.
   * Note: document.fonts.load() is a valid way to preload fonts,
   * but we are not currently checking for that.
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Set<string>}
   */
  static getURLsAttemptedToPreload(networkRecords) {
    const attemptedURLs = networkRecords
      .filter(req => req.resourceType === 'Font')
      .filter(req => req.isLinkPreload)
      .map(req => req.url);

    return new Set(attemptedURLs);
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit_(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[this.DEFAULT_PASS];
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);

    // Gets the URLs of fonts where font-display: optional.
    const optionalFontURLs =
      FontDisplay.findFontDisplayDeclarations(artifacts, PASSING_FONT_DISPLAY_REGEX).passingURLs;

    // Gets the URLs of fonts attempted to be preloaded.
    const preloadedFontURLs =
      PreloadFontsAudit.getURLsAttemptedToPreload(networkRecords);

    const results = Array.from(optionalFontURLs)
      .filter(url => !preloadedFontURLs.has(url))
      .map(url => {
        return {url};
      });

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'url', valueType: 'url', label: str_(i18n.UIStrings.columnURL)},
    ];

    return {
      score: results.length > 0 ? 0 : 1,
      details: Audit.makeTableDetails(headings, results),
      notApplicable: optionalFontURLs.size === 0,
    };
  }

  /**
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit() {
    // Preload advice is on hold until https://github.com/GoogleChrome/lighthouse/issues/11960
    // is resolved.
    return {score: 1, notApplicable: true};
  }
}

export default PreloadFontsAudit;
export {UIStrings};
