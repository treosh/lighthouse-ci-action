/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @typedef {string|LH.Audit.Details.NodeValue|undefined} Source */
/** @typedef {{source: Source, subItems: {type: 'subitems', items: SubItem[]}}} InvalidHreflang */
/** @typedef {{reason: LH.IcuMessage}} SubItem */

const Audit = require('../audit.js');
const i18n = require('../../lib/i18n/i18n.js');
const axeLibSource = require('../../lib/axe.js').source;

const VALID_LANGS = importValidLangs();
const NO_LANGUAGE = 'x-default';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on the `hreflang` attribute on a page. This descriptive title is shown when the page's `hreflang` attribute is configured correctly. "hreflang" is an HTML attribute and should not be translated. */
  title: 'Document has a valid `hreflang`',
  /** Title of a Lighthouse audit that provides detail on the `hreflang` attribute on a page. This descriptive title is shown when the page's `hreflang` attribute is not valid and needs to be fixed. "hreflang" is an HTML attribute and should not be translated. */
  failureTitle: 'Document doesn\'t have a valid `hreflang`',
  /** Description of a Lighthouse audit that tells the user *why* they need to have an hreflang link on their page. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. "hreflang" is an HTML attribute and should not be translated. */
  description: 'hreflang links tell search engines what version of a page they should ' +
    'list in search results for a given language or region. [Learn more]' +
    '(https://web.dev/hreflang/).',
  /** A failure reason for a Lighthouse audit that flags incorrect use of the `hreflang` attribute on `link` elements. This failure reason is shown when the hreflang language code is unexpected. */
  unexpectedLanguage: 'Unexpected language code',
  /** A failure reason for a Lighthouse audit that flags incorrect use of the `hreflang` attribute on `link` elements. This failure reason is shown when the `href` attribute value is not fully-qualified. */
  notFullyQualified: 'Relative href value',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * Import list of valid languages from axe core.
 * This is a huge array of language codes that can be stored more efficiently if we will need to
 * shrink the bundle size.
 * @return {Array<string>}
 */
function importValidLangs() {
  // Define a window-ish object so axe will export to it.
  const window = {getComputedStyle: () => {}};
  eval(axeLibSource);
  // @ts-expect-error
  return window.axe.utils.validLangs();
}

/**
 * @param {string} href
 * @returns {boolean}
 */
function isFullyQualified(href) {
  return href.startsWith('http:') || href.startsWith('https:');
}

/**
 * @param {string} hreflang
 * @returns {boolean}
 */
function isExpectedLanguageCode(hreflang) {
  if (hreflang.toLowerCase() === NO_LANGUAGE) {
    return true;
  }

  // hreflang can consist of language-script-region, we are validating only language
  const [lang] = hreflang.split('-');
  return VALID_LANGS.includes(lang.toLowerCase());
}

class Hreflang extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'hreflang',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['LinkElements', 'URL'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit({LinkElements}) {
    /** @type {InvalidHreflang[]} */
    const invalidHreflangs = [];

    const auditableLinkElements = LinkElements.filter(linkElement => {
      const isAlternate = linkElement.rel === 'alternate';
      const hasHreflang = linkElement.hreflang;
      const isInBody = linkElement.source === 'body';

      return isAlternate && hasHreflang && !isInBody;
    });

    for (const link of auditableLinkElements) {
      const reasons = [];
      /** @type {Source} */
      let source;

      if (!isExpectedLanguageCode(link.hreflang)) {
        reasons.push(str_(UIStrings.unexpectedLanguage));
      }

      if (!isFullyQualified(link.hrefRaw.toLowerCase())) {
        reasons.push(str_(UIStrings.notFullyQualified));
      }

      if (link.source === 'head') {
        source = {
          type: 'node',
          snippet: `<link rel="alternate" hreflang="${link.hreflang}" href="${link.hrefRaw}" />`,
          path: link.node !== null ? link.node.devtoolsNodePath : '',
          selector: link.node !== null ? link.node.selector : '',
          nodeLabel: link.node !== null ? link.node.nodeLabel : '',
        };
      } else if (link.source === 'headers') {
        source = `Link: <${link.hrefRaw}>; rel="alternate"; hreflang="${link.hreflang}"`;
      }

      if (!source || !reasons.length) continue;

      invalidHreflangs.push({
        source,
        subItems: {
          type: 'subitems',
          items: reasons.map(reason => ({reason})),
        },
      });
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [{
      key: 'source',
      itemType: 'code',
      subItemsHeading: {
        key: 'reason',
        itemType: 'text',
      },
      text: '',
    }];

    const details = Audit.makeTableDetails(headings, invalidHreflangs);

    return {
      score: Number(invalidHreflangs.length === 0),
      details,
    };
  }
}

module.exports = Hreflang;
module.exports.UIStrings = UIStrings;
