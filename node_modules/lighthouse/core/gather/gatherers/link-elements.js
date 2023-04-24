/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import LinkHeader from 'http-link-header';

import FRGatherer from '../base-gatherer.js';
import {pageFunctions} from '../../lib/page-functions.js';
import DevtoolsLog from './devtools-log.js';
import {MainResource} from '../../computed/main-resource.js';

/* globals HTMLLinkElement getNodeDetails */

/**
 * @fileoverview
 * This gatherer collects all the effect `link` elements, both in the page and declared in the
 * headers of the main resource.
 */

/**
 *
 * @param {string} url
 * @param {string} finalDisplayedUrl
 * @return {string|null}
 */
function normalizeUrlOrNull(url, finalDisplayedUrl) {
  try {
    return new URL(url, finalDisplayedUrl).href;
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
/* c8 ignore start */
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
/* c8 ignore stop */

class LinkElements extends FRGatherer {
  constructor() {
    super();
    /**
     * This needs to be in the constructor.
     * https://github.com/GoogleChrome/lighthouse/issues/12134
     * @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>}
     */
    this.meta = {
      supportedModes: ['timespan', 'navigation'],
      dependencies: {DevtoolsLog: DevtoolsLog.symbol},
    };
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  static getLinkElementsInDOM(context) {
    // We'll use evaluateAsync because the `node.getAttribute` method doesn't actually normalize
    // the values like access from JavaScript does.
    return context.driver.executionContext.evaluate(getLinkElementsInDOM, {
      args: [],
      useIsolation: true,
      deps: [
        pageFunctions.getNodeDetails,
        pageFunctions.getElementsInDocument,
      ],
    });
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  static async getLinkElementsInHeaders(context, devtoolsLog) {
    const mainDocument =
      await MainResource.request({devtoolsLog, URL: context.baseArtifacts.URL}, context);

    /** @type {LH.Artifacts['LinkElements']} */
    const linkElements = [];

    for (const header of mainDocument.responseHeaders) {
      if (header.name.toLowerCase() !== 'link') continue;

      for (const link of LinkHeader.parse(header.value).refs) {
        linkElements.push({
          rel: link.rel || '',
          href: normalizeUrlOrNull(link.uri, context.baseArtifacts.URL.finalDisplayedUrl),
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
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  async _getArtifact(context, devtoolsLog) {
    const fromDOM = await LinkElements.getLinkElementsInDOM(context);
    const fromHeaders = await LinkElements.getLinkElementsInHeaders(context, devtoolsLog);
    const linkElements = fromDOM.concat(fromHeaders);

    for (const link of linkElements) {
      // Normalize the rel for easy consumption/filtering
      link.rel = link.rel.toLowerCase();
    }

    return linkElements;
  }

  /**
   * @param {LH.Gatherer.PassContext} context
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  async afterPass(context, loadData) {
    return this._getArtifact({...context, dependencies: {}}, loadData.devtoolsLog);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @return {Promise<LH.Artifacts['LinkElements']>}
   */
  async getArtifact(context) {
    return this._getArtifact(context, context.dependencies.DevtoolsLog);
  }
}

export default LinkElements;
