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
 * @return {LH.Artifacts['IFrameElements']}
 */
/* istanbul ignore next */
function collectIFrameElements() {
  // @ts-expect-error - put into scope via stringification
  const iFrameElements = getElementsInDocument('iframe'); // eslint-disable-line no-undef
  return iFrameElements.map(/** @param {HTMLIFrameElement} node */ (node) => {
    const clientRect = node.getBoundingClientRect();
    const {top, bottom, left, right, width, height} = clientRect;
    return {
      id: node.id,
      src: node.src,
      clientRect: {top, bottom, left, right, width, height},
      // @ts-expect-error - put into scope via stringification
      isPositionFixed: isPositionFixed(node), // eslint-disable-line no-undef
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(node),
    };
  });
}

class IFrameElements extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['IFrameElements']>}
   * @override
   */
  async afterPass(passContext) {
    const driver = passContext.driver;

    const expression = `(() => {
      ${pageFunctions.getElementsInDocumentString};
      ${pageFunctions.isPositionFixedString};
      ${pageFunctions.getNodeDetailsString};
      return (${collectIFrameElements})();
    })()`;

    /** @type {LH.Artifacts['IFrameElements']} */
    const iframeElements = await driver.evaluateAsync(expression, {useIsolation: true});
    return iframeElements;
  }
}

module.exports = IFrameElements;
