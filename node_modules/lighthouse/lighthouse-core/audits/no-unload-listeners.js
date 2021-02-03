/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const i18n = require('./../lib/i18n/i18n.js');

const UIStrings = {
  /** Descriptive title of a Lighthouse audit that checks if a web page has 'unload' event listeners and finds none. */
  title: 'Avoids `unload` event listeners',
  /** Descriptive title of a Lighthouse audit that checks if a web page has 'unload' event listeners and finds that it is using them. */
  failureTitle: 'Registers an `unload` listener',
  /** Description of a Lighthouse audit that tells the user why pages should not use the 'unload' event. This is displayed after a user expands the section to see more. 'Learn More' becomes link text to additional documentation. */
  description: 'The `unload` event does not fire reliably and listening for it can prevent browser optimizations like the Back-Forward Cache. Consider using the `pagehide` or `visibilitychange` events instead. [Learn More](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#the-unload-event)',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class NoUnloadListeners extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'no-unload-listeners',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['GlobalListeners', 'JsUsage'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    const unloadListeners = artifacts.GlobalListeners.filter(l => l.type === 'unload');
    if (!unloadListeners.length) {
      return {
        score: 1,
      };
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'source', itemType: 'source-location', text: str_(i18n.UIStrings.columnURL)},
    ];

    // Look up scriptId to script URL via the JsUsage artifact.
    /** @type {Map<string, string>} */
    const scriptIdToUrl = new Map();
    for (const [url, usages] of Object.entries(artifacts.JsUsage)) {
      for (const usage of usages) {
        scriptIdToUrl.set(usage.scriptId, url);
      }
    }

    /** @type {Array<{source: LH.Audit.Details.ItemValue}>} */
    const tableItems = unloadListeners.map(listener => {
      const url = scriptIdToUrl.get(listener.scriptId);

      // If we can't find a url, still show something so the user can manually
      // look for where an `unload` handler is being created.
      if (!url) {
        return {
          source: {
            type: 'url',
            value: '(unknown)',
          },
        };
      }

      return {
        source: {
          type: 'source-location',
          url,
          urlProvider: 'network',
          line: listener.lineNumber,
          column: listener.columnNumber,
        },
      };
    });

    return {
      score: 0,
      details: Audit.makeTableDetails(headings, tableItems),
    };
  }
}

module.exports = NoUnloadListeners;
module.exports.UIStrings = UIStrings;
