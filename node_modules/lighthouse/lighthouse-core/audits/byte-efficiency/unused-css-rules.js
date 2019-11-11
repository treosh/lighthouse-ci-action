/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const ByteEfficiencyAudit = require('./byte-efficiency-audit.js');
const i18n = require('../../lib/i18n/i18n.js');

const UIStrings = {
  /** Imperative title of a Lighthouse audit that tells the user to remove content from their CSS that isn’t needed immediately and instead load that content at a later time. This is displayed in a list of audit titles that Lighthouse generates. */
  title: 'Remove unused CSS',
  /** Description of a Lighthouse audit that tells the user *why* they should defer loading any content in CSS that isn’t needed at page load. This is displayed after a user expands the section to see more. No word length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Remove dead rules from stylesheets and defer the loading of CSS not used for ' +
    'above-the-fold content to reduce unnecessary bytes consumed by network activity. ' +
    '[Learn more](https://web.dev/unused-css-rules).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

// Allow 10KB of unused CSS to permit `:hover` and other styles not used on a non-interactive load.
// @see https://github.com/GoogleChrome/lighthouse/issues/9353 for more discussion.
const IGNORE_THRESHOLD_IN_BYTES = 10 * 1024;
const PREVIEW_LENGTH = 100;

/** @typedef {LH.Artifacts.CSSStyleSheetInfo & {networkRecord: LH.Artifacts.NetworkRequest, usedRules: Array<LH.Crdp.CSS.RuleUsage>}} StyleSheetInfo */

class UnusedCSSRules extends ByteEfficiencyAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'unused-css-rules',
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      scoreDisplayMode: ByteEfficiencyAudit.SCORING_MODES.NUMERIC,
      requiredArtifacts: ['CSSUsage', 'URL', 'devtoolsLogs', 'traces'],
    };
  }

  /**
   * @param {Array<LH.Artifacts.CSSStyleSheetInfo>} styles The output of the Styles gatherer.
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Object<string, StyleSheetInfo>} A map of styleSheetId to stylesheet information.
   */
  static indexStylesheetsById(styles, networkRecords) {
    const indexedNetworkRecords = networkRecords
        // Some phantom network records appear with a 0 resourceSize that aren't real.
        // A network record that has no size data is just as good as no network record at all for our
        // purposes, so we'll just filter them out. https://github.com/GoogleChrome/lighthouse/issues/9684#issuecomment-532381611
        .filter(record => record.resourceSize > 0)
        .reduce((indexed, record) => {
          indexed[record.url] = record;
          return indexed;
        }, /** @type {Object<string, LH.Artifacts.NetworkRequest>} */ ({}));

    return styles.reduce((indexed, stylesheet) => {
      indexed[stylesheet.header.styleSheetId] = Object.assign({
        usedRules: [],
        networkRecord: indexedNetworkRecords[stylesheet.header.sourceURL],
      }, stylesheet);
      return indexed;
    }, /** @type {Object<string, StyleSheetInfo>} */ ({}));
  }

  /**
   * Adds used rules to their corresponding stylesheet.
   * @param {Array<LH.Crdp.CSS.RuleUsage>} rules The output of the CSSUsage gatherer.
   * @param {Object<string, StyleSheetInfo>} indexedStylesheets Stylesheet information indexed by id.
   */
  static indexUsedRules(rules, indexedStylesheets) {
    rules.forEach(rule => {
      const stylesheetInfo = indexedStylesheets[rule.styleSheetId];

      if (!stylesheetInfo) {
        return;
      }

      if (rule.used) {
        stylesheetInfo.usedRules.push(rule);
      }
    });
  }

  /**
   * @param {StyleSheetInfo} stylesheetInfo
   * @return {{wastedBytes: number, totalBytes: number, wastedPercent: number}}
   */
  static computeUsage(stylesheetInfo) {
    let usedUncompressedBytes = 0;
    const totalUncompressedBytes = stylesheetInfo.content.length;

    for (const usedRule of stylesheetInfo.usedRules) {
      usedUncompressedBytes += usedRule.endOffset - usedRule.startOffset;
    }

    const totalTransferredBytes = ByteEfficiencyAudit.estimateTransferSize(
        stylesheetInfo.networkRecord, totalUncompressedBytes, 'Stylesheet');
    const percentUnused = (totalUncompressedBytes - usedUncompressedBytes) / totalUncompressedBytes;
    const wastedBytes = Math.round(percentUnused * totalTransferredBytes);

    return {
      wastedBytes,
      wastedPercent: percentUnused * 100,
      totalBytes: totalTransferredBytes,
    };
  }

  /**
   * Trims stylesheet content down to the first rule-set definition.
   * @param {string=} content
   * @return {string}
   */
  static determineContentPreview(content) {
    let preview = (content || '')
        .slice(0, PREVIEW_LENGTH * 5)
        .replace(/( {2,}|\t)+/g, '  ') // remove leading indentation if present
        .replace(/\n\s+}/g, '\n}') // completely remove indentation of closing braces
        .trim(); // trim the leading whitespace

    if (preview.length > PREVIEW_LENGTH) {
      const firstRuleStart = preview.indexOf('{');
      const firstRuleEnd = preview.indexOf('}');

      if (firstRuleStart === -1 || firstRuleEnd === -1
          || firstRuleStart > firstRuleEnd
          || firstRuleStart > PREVIEW_LENGTH) {
        // We couldn't determine the first rule-set or it's not within the preview
        preview = preview.slice(0, PREVIEW_LENGTH) + '...';
      } else if (firstRuleEnd < PREVIEW_LENGTH) {
        // The entire first rule-set fits within the preview
        preview = preview.slice(0, firstRuleEnd + 1) + ' ...';
      } else {
        // The first rule-set doesn't fit within the preview, just show as many as we can
        const lastSemicolonIndex = preview.slice(0, PREVIEW_LENGTH).lastIndexOf(';');
        preview = lastSemicolonIndex < firstRuleStart ?
            preview.slice(0, PREVIEW_LENGTH) + '... } ...' :
            preview.slice(0, lastSemicolonIndex + 1) + ' ... } ...';
      }
    }

    return preview;
  }

  /**
   * @param {StyleSheetInfo} stylesheetInfo The stylesheetInfo object.
   * @param {string} pageUrl The URL of the page, used to identify inline styles.
   * @return {LH.Audit.ByteEfficiencyItem}
   */
  static mapSheetToResult(stylesheetInfo, pageUrl) {
    let url = stylesheetInfo.header.sourceURL;
    if (!url || url === pageUrl) {
      const contentPreview = UnusedCSSRules.determineContentPreview(stylesheetInfo.content);
      url = contentPreview;
    }

    const usage = UnusedCSSRules.computeUsage(stylesheetInfo);
    return {url, ...usage};
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Promise<ByteEfficiencyAudit.ByteEfficiencyProduct>}
   */
  static audit_(artifacts, networkRecords) {
    const styles = artifacts.CSSUsage.stylesheets;
    const usage = artifacts.CSSUsage.rules;
    const pageUrl = artifacts.URL.finalUrl;

    return Promise.resolve(networkRecords).then(networkRecords => {
      const indexedSheets = UnusedCSSRules.indexStylesheetsById(styles, networkRecords);
      UnusedCSSRules.indexUsedRules(usage, indexedSheets);

      const items = Object.keys(indexedSheets)
          .map(sheetId => UnusedCSSRules.mapSheetToResult(indexedSheets[sheetId], pageUrl))
          .filter(sheet => sheet && sheet.wastedBytes > IGNORE_THRESHOLD_IN_BYTES);

      /** @type {LH.Audit.Details.Opportunity['headings']} */
      const headings = [
        {key: 'url', valueType: 'url', label: str_(i18n.UIStrings.columnURL)},
        {key: 'totalBytes', valueType: 'bytes', label: str_(i18n.UIStrings.columnSize)},
        {key: 'wastedBytes', valueType: 'bytes', label: str_(i18n.UIStrings.columnWastedBytes)},
      ];

      return {
        items,
        headings,
      };
    });
  }
}

module.exports = UnusedCSSRules;
module.exports.UIStrings = UIStrings;
