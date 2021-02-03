/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* global getNodeDetails */

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

  /** @param {HTMLAnchorElement|SVGAElement} node */
  function getTruncatedOnclick(node) {
    const onclick = node.getAttribute('onclick') || '';
    return onclick.slice(0, 1024);
  }

  /** @type {Array<HTMLAnchorElement|SVGAElement>} */
  // @ts-expect-error - put into scope via stringification
  const anchorElements = getElementsInDocument('a'); // eslint-disable-line no-undef

  return anchorElements.map(node => {
    if (node instanceof HTMLAnchorElement) {
      return {
        href: node.href,
        rawHref: node.getAttribute('href') || '',
        onclick: getTruncatedOnclick(node),
        role: node.getAttribute('role') || '',
        name: node.name,
        text: node.innerText, // we don't want to return hidden text, so use innerText
        rel: node.rel,
        target: node.target,
        // @ts-expect-error - getNodeDetails put into scope via stringification
        node: getNodeDetails(node),
      };
    }

    return {
      href: resolveURLOrEmpty(node.href.baseVal),
      rawHref: node.getAttribute('href') || '',
      onclick: getTruncatedOnclick(node),
      role: node.getAttribute('role') || '',
      text: node.textContent || '',
      rel: '',
      target: node.target.baseVal || '',
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(node),
    };
  });
}

/**
 * @param {LH.Gatherer.PassContext['driver']} driver
 * @param {string} devtoolsNodePath
 * @return {Promise<Array<{type: string}>>}
 */
async function getEventListeners(driver, devtoolsNodePath) {
  const objectId = await driver.resolveDevtoolsNodePathToObjectId(devtoolsNodePath);
  if (!objectId) return [];

  const response = await driver.sendCommand('DOMDebugger.getEventListeners', {
    objectId,
  });

  return response.listeners.map(({type}) => ({type}));
}

class AnchorElements extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['AnchorElements']>}
   */
  async afterPass(passContext) {
    const driver = passContext.driver;
    const expression = `(() => {
      ${pageFunctions.getElementsInDocumentString};
      ${pageFunctions.getNodeDetailsString};

      return (${collectAnchorElements})();
    })()`;

    /** @type {LH.Artifacts['AnchorElements']} */
    const anchors = await driver.evaluateAsync(expression, {useIsolation: true});
    await driver.sendCommand('DOM.enable');

    // DOM.getDocument is necessary for pushNodesByBackendIdsToFrontend to properly retrieve nodeIds if the `DOM` domain was enabled before this gatherer, invoke it to be safe.
    await driver.sendCommand('DOM.getDocument', {depth: -1, pierce: true});
    const anchorsWithEventListeners = anchors.map(async anchor => {
      const listeners = await getEventListeners(driver, anchor.node.devtoolsNodePath);

      return {
        ...anchor,
        listeners,
      };
    });

    const result = await Promise.all(anchorsWithEventListeners);
    await driver.sendCommand('DOM.disable');
    return result;
  }
}

module.exports = AnchorElements;
