/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview This audit checks a page for any large JS libraries with smaller alternatives.
 * These libraries can be replaced with functionally equivalent, smaller ones.
 * @see https://docs.google.com/document/d/1TgKO3cWqMpcS4dn0xbjDG5fyuqgVvYYoXg--knaxJnM
 */

'use strict';
/** @typedef {{repository: string, lastScraped: number|'Error', versions: Record<string, {gzip: number}>}} BundlePhobiaLibrary */

/** @typedef {{gzip: number, name: string, repository: string}} MinifiedBundlePhobiaLibrary */

/** @type {Record<string, BundlePhobiaLibrary>} */
const libStats = require('../lib/large-javascript-libraries/bundlephobia-database.json');

/** @type {Record<string, string[]>} */
const librarySuggestions = require('../lib/large-javascript-libraries/library-suggestions.js')
  .suggestions;

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on large Javascript libraries that are used on the page that have better alternatives. This descriptive title is shown when to users when no known unnecessarily large libraries are detected on the page.*/
  title: 'Avoids large JavaScript libraries with smaller alternatives',
  /** Title of a Lighthouse audit that provides detail on large Javascript libraries that are used on the page that have better alternatives. This descriptive title is shown when to users when some known unnecessarily large libraries are detected on the page.*/
  failureTitle: 'Replace unnecessarily large JavaScript libraries',
  /** Description of a Lighthouse audit that tells the user why they should care about the large Javascript libraries that have better alternatives. This is displayed after a user expands the section to see more. No character length limits. */
  description: 'Large JavaScript libraries can lead to poor performance. ' +
    'Prefer smaller, functionally equivalent libraries to reduce your bundle size.' +
    ' [Learn more](https://developers.google.com/web/fundamentals/performance/webpack/decrease-frontend-size#optimize_dependencies).',
  /** Label for a column in a data table. Entries will be names of large JavaScript libraries that could be replaced. */
  columnLibraryName: 'Library',
  /** [ICU Syntax] Label for the Large JavaScrip Libraries audit identifying how many large libraries were found. */
  displayValue: `{libraryCount, plural,
    =1 {1 large library found}
    other {# large libraries found}
    }`,
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class LargeJavascriptLibraries extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'large-javascript-libraries',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['Stacks'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    /** @type {Array<{original: MinifiedBundlePhobiaLibrary, suggestions: MinifiedBundlePhobiaLibrary[]}>} */
    const libraryPairings = [];
    const detectedLibs = artifacts.Stacks;

    const seenLibraries = new Set();

    for (const detectedLib of detectedLibs) {
      if (!detectedLib.npm || !libStats[detectedLib.npm]) continue;

      const suggestions = librarySuggestions[detectedLib.npm];
      if (!suggestions) continue;

      if (seenLibraries.has(detectedLib.npm)) continue;
      seenLibraries.add(detectedLib.npm);

      let version = 'latest';
      if (detectedLib.version && libStats[detectedLib.npm].versions[detectedLib.version]) {
        version = detectedLib.version;
      }

      const originalLib = libStats[detectedLib.npm].versions[version];

      /** @type {Array<{name: string, repository: string, gzip: number}>} */
      const smallerSuggestions = [];
      for (const suggestion of suggestions) {
        if (libStats[suggestion].versions['latest'].gzip >= originalLib.gzip) continue;

        smallerSuggestions.push({
          name: suggestion,
          repository: libStats[suggestion].repository,
          gzip: libStats[suggestion].versions['latest'].gzip,
        });
      }

      smallerSuggestions.sort((a, b) => a.gzip - b.gzip);
      if (!smallerSuggestions.length) continue;

      libraryPairings.push({
        original: {
          gzip: originalLib.gzip,
          name: detectedLib.npm,
          repository: libStats[detectedLib.npm].repository,
        },
        suggestions: smallerSuggestions,
      });
    }

    /** @type {LH.Audit.Details.Table['items']} */
    const tableDetails = libraryPairings.map(libraryPairing => {
      const original = libraryPairing.original;
      const suggestions = libraryPairing.suggestions;
      const suggestionItems = suggestions.map(suggestion => {
        return {
          suggestion: {
            type: /** @type {'link'} */ ('link'),
            text: suggestion.name,
            url: suggestion.repository,
          },
          transferSize: suggestion.gzip,
          wastedBytes: original.gzip - suggestion.gzip,
        };
      });

      return {
        name: {
          type: /** @type {'link'} */ ('link'),
          text: original.name,
          url: original.repository,
        },
        transferSize: original.gzip,
        subItems: {
          type: /** @type {'subitems'} */ ('subitems'),
          items: suggestionItems,
        },
      };
    });

    /** @type {LH.Audit.Details.TableColumnHeading[]} */
    const headings = [
      /* eslint-disable max-len */
      {key: 'name', itemType: 'text', subItemsHeading: {key: 'suggestion'}, text: str_(UIStrings.columnLibraryName)},
      {key: 'transferSize', itemType: 'bytes', subItemsHeading: {key: 'transferSize'}, text: str_(i18n.UIStrings.columnTransferSize)},
      {key: null, itemType: 'bytes', subItemsHeading: {key: 'wastedBytes'}, text: str_(i18n.UIStrings.columnWastedBytes)},
      /* eslint-enable max-len */
    ];

    const displayValue = str_(UIStrings.displayValue, {libraryCount: tableDetails.length});

    const details = Audit.makeTableDetails(headings, tableDetails, {});

    return {
      score: libraryPairings.length > 0 ? 0 : 1,
      displayValue,
      details,
    };
  }
}

module.exports = LargeJavascriptLibraries;
module.exports.UIStrings = UIStrings;
