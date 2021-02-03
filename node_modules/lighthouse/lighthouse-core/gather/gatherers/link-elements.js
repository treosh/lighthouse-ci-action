/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const LinkHeader = require('http-link-header');
const Gatherer = require('./gatherer.js');
const {URL} = require('../../lib/url-shim.js');
const NetworkAnalyzer = require('../../lib/dependency-graph/simulator/network-analyzer.js');
const pageFunctions = require('../../lib/page-functions.js');

/* globals HTMLLinkElement getNodeDetails */

/**
 * @fileoverview
 * This gatherer collects all the effect `link` elements, both in the page and declared in the
 * headers of the main resource.
 */

/**
 *
 * @param {string} url
 * @param {string} finalUrl
 * @return {string|null}
 */
function normalizeUrlOrNull(url, finalUrl) {
  try {
    return new URL(url, finalUrl).href;
  } catch (_) {
    return null;
  }
}

/**
 * @param {string|undefined} value
 * @return {LH.Artifacts.LinkElement['crossOrigin']}
 */
function getCrossoriginFromHeader(value) {
  if (value === 'anonymous') return 'anonymous';
  if (value === 'use-credentials') return 'use-credentials';
  return null;
}

/**
 * @return {LH.Artifacts['LinkElements']}
 */
/* istanbul ignore next */
function getLinkElementsInDOM() {
  /** @type {Array<HTMLOrSVGElement>} */
  // @ts-expect-error - getElementsInDocument put into scope via stringification
  const browserElements = getElementsInDocument('link'); // eslint-disable-line no-undef
  /** @type {LH.Artifacts['LinkElements']} */
  const linkElements = [];

  for (const link of browserElements) {
    // We're only interested in actual LinkElements, not `<link>` tagName elements inside SVGs.
    // https://github.com/GoogleChrome/lighthouse/issues/9764
    if (!(link instanceof HTMLLinkElement)) continue;

    const hrefRaw = link.getAttribute('href') || '';
    const source = link.closest('head') ? 'head' : 'body';

    linkElements.push({
      rel: link.rel,
      href: link.href,
      hreflang: link.hreflang,
      as: link.as,
      crossOrigin: link.crossOrigin,
      hrefRaw,
      source,
      // @ts-expect-error - put into scope via stringification
      node: getNodeDetails(link),
    });
  }

  return linkElements;
}

class LinkElements extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  static getLinkElementsInDOM(passContext) {
    // We'll use evaluateAsync because the `node.getAttribute` method doesn't actually normalize
    // the values like access from JavaScript does.
    return passContext.driver.evaluate(getLinkElementsInDOM, {
      args: [],
      useIsolation: true,
      deps: [
        pageFunctions.getNodeDetailsString,
        pageFunctions.getElementsInDocument,
      ],
    });
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {LH.Artifacts['LinkElements']}
   */
  static getLinkElementsInHeaders(passContext, loadData) {
    const finalUrl = passContext.url;
    const records = loadData.networkRecords;
    const mainDocument = NetworkAnalyzer.findMainDocument(records, finalUrl);

    /** @type {LH.Artifacts['LinkElements']} */
    const linkElements = [];

    for (const header of mainDocument.responseHeaders) {
      if (header.name.toLowerCase() !== 'link') continue;

      for (const link of LinkHeader.parse(header.value).refs) {
        linkElements.push({
          rel: link.rel || '',
          href: normalizeUrlOrNull(link.uri, finalUrl),
          hrefRaw: link.uri || '',
          hreflang: link.hreflang || '',
          as: link.as || '',
          crossOrigin: getCrossoriginFromHeader(link.crossorigin),
          source: 'headers',
          node: null,
        });
      }
    }

    return linkElements;
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  async afterPass(passContext, loadData) {
    const fromDOM = await LinkElements.getLinkElementsInDOM(passContext);
    const fromHeaders = LinkElements.getLinkElementsInHeaders(passContext, loadData);
    const linkElements = fromDOM.concat(fromHeaders);

    for (const link of linkElements) {
      // Normalize the rel for easy consumption/filtering
      link.rel = link.rel.toLowerCase();
    }

    return linkElements;
  }
}

module.exports = LinkElements;
