/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');

/* globals getElementsInDocument getNodeDetails */

/* c8 ignore start */
function collectMetaElements() {
  const functions = /** @type {typeof pageFunctions} */({
    // @ts-expect-error - getElementsInDocument put into scope via stringification
    getElementsInDocument,
    // @ts-expect-error - getNodeDetails put into scope via stringification
    getNodeDetails,
  });

  const metas = functions.getElementsInDocument('head meta');
  return metas.map(meta => {
    /** @param {string} name */
    const getAttribute = name => {
      const attr = meta.attributes.getNamedItem(name);
      if (!attr) return;
      return attr.value;
    };
    return {
      name: meta.name.toLowerCase(),
      content: meta.content,
      property: getAttribute('property'),
      httpEquiv: meta.httpEquiv ? meta.httpEquiv.toLowerCase() : undefined,
      charset: getAttribute('charset'),
      node: functions.getNodeDetails(meta),
    };
  });
}
/* c8 ignore stop */

class MetaElements extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<LH.Artifacts['MetaElements']>}
   */
  getArtifact(passContext) {
    const driver = passContext.driver;

    // We'll use evaluateAsync because the `node.getAttribute` method doesn't actually normalize
    // the values like access from JavaScript does.
    return driver.executionContext.evaluate(collectMetaElements, {
      args: [],
      useIsolation: true,
      deps: [
        pageFunctions.getElementsInDocument,
        pageFunctions.getNodeDetailsString,
      ],
    });
  }
}

module.exports = MetaElements;
