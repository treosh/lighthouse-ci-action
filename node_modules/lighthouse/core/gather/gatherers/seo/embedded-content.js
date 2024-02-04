/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* globals getElementsInDocument getNodeDetails */

import BaseGatherer from '../../base-gatherer.js';
import {pageFunctions} from '../../../lib/page-functions.js';

/**
 * @return {LH.Artifacts.EmbeddedContentInfo[]}
 */
function getEmbeddedContent() {
  const functions = /** @type {typeof pageFunctions} */ ({
    // @ts-expect-error - getElementsInDocument put into scope via stringification
    getElementsInDocument,
    // @ts-expect-error - getNodeDetails put into scope via stringification
    getNodeDetails,
  });

  const selector = 'object, embed, applet';
  const elements = functions.getElementsInDocument(selector);
  return elements
    .map(node => ({
      tagName: node.tagName,
      type: node.getAttribute('type'),
      src: node.getAttribute('src'),
      data: node.getAttribute('data'),
      code: node.getAttribute('code'),
      params: Array.from(node.children)
        .filter(el => el.tagName === 'PARAM')
        .map(el => ({
          name: el.getAttribute('name') || '',
          value: el.getAttribute('value') || '',
        })),
      node: functions.getNodeDetails(node),
    }));
}

class EmbeddedContent extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.Context} passContext
   * @return {Promise<LH.Artifacts['EmbeddedContent']>}
   */
  getArtifact(passContext) {
    return passContext.driver.executionContext.evaluate(getEmbeddedContent, {
      args: [],
      deps: [
        pageFunctions.getElementsInDocument,
        pageFunctions.getNodeDetails,
      ],
    });
  }
}

export default EmbeddedContent;
