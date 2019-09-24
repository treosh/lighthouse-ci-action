/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');

/* eslint-env browser, node */

/**
 * Function that is stringified and run in the page to collect anchor elements.
 * Additional complexity is introduced because anchors can be HTML or SVG elements.
 *
 * We use this evaluateAsync method because the `node.getAttribute` method doesn't actually normalize
 * the values like access from JavaScript in-page does.
 *
 * @return {LH.Artifacts['AnchorElements']}
 */
/* istanbul ignore next */
function collectAnchorElements() {
  /** @param {string} url */
  const resolveURLOrEmpty = url => {
    try {
      return new URL(url, window.location.href).href;
    } catch (_) {
      return '';
    }
  };

  /** @type {Array<HTMLAnchorElement|SVGAElement>} */
  // @ts-ignore - put into scope via stringification
  const anchorElements = getElementsInDocument('a'); // eslint-disable-line no-undef

  return anchorElements.map(node => {
    // @ts-ignore - put into scope via stringification
    const outerHTML = getOuterHTMLSnippet(node); // eslint-disable-line no-undef

    if (node instanceof HTMLAnchorElement) {
      return {
        href: node.href,
        text: node.innerText, // we don't want to return hidden text, so use innerText
        rel: node.rel,
        target: node.target,
        outerHTML,
      };
    }

    return {
      href: resolveURLOrEmpty(node.href.baseVal),
      text: node.textContent || '',
      rel: '',
      target: node.target.baseVal || '',
      outerHTML,
    };
  });
}

class AnchorElements extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['AnchorElements']>}
   */
  async afterPass(passContext) {
    const driver = passContext.driver;
    const expression = `(() => {
      ${pageFunctions.getOuterHTMLSnippetString};
      ${pageFunctions.getElementsInDocumentString};

      return (${collectAnchorElements})();
    })()`;

    /** @type {Array<LH.Artifacts.AnchorElement>} */
    return driver.evaluateAsync(expression, {useIsolation: true});
  }
}

module.exports = AnchorElements;
