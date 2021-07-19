/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
/**
  * @fileoverview Gathers all images used on the page with their src, size,
  *   and attribute information. Executes script in the context of the page.
  */
'use strict';

const log = require('lighthouse-logger');
const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');
const DevtoolsLog = require('./devtools-log.js');
const FontSize = require('./seo/font-size.js');
const NetworkRecords = require('../../computed/network-records.js');

/* global window, getElementsInDocument, Image, getNodeDetails, ShadowRoot */

/** @param {Element} element */
/* c8 ignore start */
function getClientRect(element) {
  const clientRect = element.getBoundingClientRect();
  return {
    // Just grab the DOMRect properties we want, excluding x/y/width/height
    top: clientRect.top,
    bottom: clientRect.bottom,
    left: clientRect.left,
    right: clientRect.right,
  };
}
/* c8 ignore stop */

/**
 * If an image is within `picture`, the `picture` element's css position
 * is what we want to collect, since that position is relevant to CLS.
 * @param {Element} element
 * @param {CSSStyleDeclaration} computedStyle
 */
/* c8 ignore start */
function getPosition(element, computedStyle) {
  if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
    const parentStyle = window.getComputedStyle(element.parentElement);
    return parentStyle.getPropertyValue('position');
  }
  return computedStyle.getPropertyValue('position');
}
/* c8 ignore stop */

/**
 * @param {Array<Element>} allElements
 * @return {Array<LH.Artifacts.ImageElement>}
 */
/* c8 ignore start */
function getHTMLImages(allElements) {
  const allImageElements = /** @type {Array<HTMLImageElement>} */ (allElements.filter(element => {
    return element.localName === 'img';
  }));

  return allImageElements.map(element => {
    const computedStyle = window.getComputedStyle(element);
    const isPicture = !!element.parentElement && element.parentElement.tagName === 'PICTURE';
    const canTrustNaturalDimensions = !isPicture && !element.srcset;
    return {
      // currentSrc used over src to get the url as determined by the browser
      // after taking into account srcset/media/sizes/etc.
      src: element.currentSrc,
      srcset: element.srcset,
      displayedWidth: element.width,
      displayedHeight: element.height,
      clientRect: getClientRect(element),
      attributeWidth: element.getAttribute('width'),
      attributeHeight: element.getAttribute('height'),
      naturalDimensions: canTrustNaturalDimensions ?
        {width: element.naturalWidth, height: element.naturalHeight} :
        undefined,
      cssRules: undefined, // this will get overwritten below
      computedStyles: {
        position: getPosition(element, computedStyle),
        objectFit: computedStyle.getPropertyValue('object-fit'),
        imageRendering: computedStyle.getPropertyValue('image-rendering'),
      },
      isCss: false,
      isPicture,
      loading: element.loading,
      isInShadowDOM: element.getRootNode() instanceof ShadowRoot,
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(element),
    };
  });
}
/* c8 ignore stop */

/**
 * @param {Array<Element>} allElements
 * @return {Array<LH.Artifacts.ImageElement>}
 */
/* c8 ignore start */
function getCSSImages(allElements) {
  // Chrome normalizes background image style from getComputedStyle to be an absolute URL in quotes.
  // Only match basic background-image: url("http://host/image.jpeg") declarations
  const CSS_URL_REGEX = /^url\("([^"]+)"\)$/;

  /** @type {Array<LH.Artifacts.ImageElement>} */
  const images = [];

  for (const element of allElements) {
    const style = window.getComputedStyle(element);
    // If the element didn't have a CSS background image, we're not interested.
    if (!style.backgroundImage || !CSS_URL_REGEX.test(style.backgroundImage)) continue;

    const imageMatch = style.backgroundImage.match(CSS_URL_REGEX);
    // @ts-expect-error test() above ensures that there is a match.
    const url = imageMatch[1];

    images.push({
      src: url,
      srcset: '',
      displayedWidth: element.clientWidth,
      displayedHeight: element.clientHeight,
      clientRect: getClientRect(element),
      attributeWidth: null,
      attributeHeight: null,
      naturalDimensions: undefined,
      cssEffectiveRules: undefined,
      computedStyles: {
        position: getPosition(element, style),
        objectFit: '',
        imageRendering: style.getPropertyValue('image-rendering'),
      },
      isCss: true,
      isPicture: false,
      isInShadowDOM: element.getRootNode() instanceof ShadowRoot,
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(element),
    });
  }

  return images;
}
/* c8 ignore stop */

/** @return {Array<LH.Artifacts.ImageElement>} */
/* c8 ignore start */
function collectImageElementInfo() {
  /** @type {Array<Element>} */
  // @ts-expect-error - added by getElementsInDocumentFnString
  const allElements = getElementsInDocument();
  return getHTMLImages(allElements).concat(getCSSImages(allElements));
}
/* c8 ignore stop */

/**
 * @param {string} url
 * @return {Promise<{naturalWidth: number, naturalHeight: number}>}
 */
/* c8 ignore start */
function determineNaturalSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('error', _ => reject(new Error('determineNaturalSize failed img load')));
    img.addEventListener('load', () => {
      resolve({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    });

    img.src = url;
  });
}
/* c8 ignore stop */

/**
 * @param {Partial<Pick<LH.Crdp.CSS.CSSStyle, 'cssProperties'>>|undefined} rule
 * @param {string} property
 * @return {string | undefined}
 */
function findSizeDeclaration(rule, property) {
  if (!rule || !rule.cssProperties) return;

  const definedProp = rule.cssProperties.find(({name}) => name === property);
  if (!definedProp) return;

  return definedProp.value;
}

/**
 * Finds the most specific directly matched CSS font-size rule from the list.
 *
 * @param {Array<LH.Crdp.CSS.RuleMatch>|undefined} matchedCSSRules
 * @param {string} property
 * @returns {string | undefined}
 */
function findMostSpecificCSSRule(matchedCSSRules, property) {
  /** @param {LH.Crdp.CSS.CSSStyle} declaration */
  const isDeclarationofInterest = (declaration) => findSizeDeclaration(declaration, property);
  const rule = FontSize.findMostSpecificMatchedCSSRule(matchedCSSRules, isDeclarationofInterest);
  if (!rule) return;

  return findSizeDeclaration(rule, property);
}

/**
 * @param {LH.Crdp.CSS.GetMatchedStylesForNodeResponse} matched CSS rules}
 * @param {string} property
 * @returns {string | null}
 */
function getEffectiveSizingRule({attributesStyle, inlineStyle, matchedCSSRules}, property) {
  // CSS sizing can't be inherited.
  // We only need to check inline & matched styles.
  // Inline styles have highest priority.
  const inlineRule = findSizeDeclaration(inlineStyle, property);
  if (inlineRule) return inlineRule;

  const attributeRule = findSizeDeclaration(attributesStyle, property);
  if (attributeRule) return attributeRule;

  // Rules directly referencing the node come next.
  const matchedRule = findMostSpecificCSSRule(matchedCSSRules, property);
  if (matchedRule) return matchedRule;

  return null;
}

class ImageElements extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  };

  constructor() {
    super();
    /** @type {Map<string, {naturalWidth: number, naturalHeight: number}>} */
    this._naturalSizeCache = new Map();
  }

  /**
   * @param {LH.Gatherer.FRTransitionalDriver} driver
   * @param {LH.Artifacts.ImageElement} element
   */
  async fetchElementWithSizeInformation(driver, element) {
    const url = element.src;
    let size = this._naturalSizeCache.get(url);
    if (!size) {
      try {
        // We don't want this to take forever, 250ms should be enough for images that are cached
        driver.defaultSession.setNextProtocolTimeout(250);
        size = await driver.executionContext.evaluate(determineNaturalSize, {
          args: [url],
        });
        this._naturalSizeCache.set(url, size);
      } catch (_) {
        // determineNaturalSize fails on invalid images, which we treat as non-visible
      }
    }

    if (!size) return;
    element.naturalDimensions = {width: size.naturalWidth, height: size.naturalHeight};
  }

  /**
   * Images might be sized via CSS. In order to compute unsized-images failures, we need to collect
   * matched CSS rules to see if this is the case.
   * @url http://go/dwoqq (googlers only)
   * @param {LH.Gatherer.FRProtocolSession} session
   * @param {string} devtoolsNodePath
   * @param {LH.Artifacts.ImageElement} element
   */
  async fetchSourceRules(session, devtoolsNodePath, element) {
    try {
      const {nodeId} = await session.sendCommand('DOM.pushNodeByPathToFrontend', {
        path: devtoolsNodePath,
      });
      if (!nodeId) return;

      const matchedRules = await session.sendCommand('CSS.getMatchedStylesForNode', {
        nodeId: nodeId,
      });
      const width = getEffectiveSizingRule(matchedRules, 'width');
      const height = getEffectiveSizingRule(matchedRules, 'height');
      const aspectRatio = getEffectiveSizingRule(matchedRules, 'aspect-ratio');
      element.cssEffectiveRules = {width, height, aspectRatio};
    } catch (err) {
      if (/No node.*found/.test(err.message)) return;
      throw err;
    }
  }

  /**
   * @param {LH.Artifacts.NetworkRequest[]} networkRecords
   */
  indexNetworkRecords(networkRecords) {
    return networkRecords.reduce((map, record) => {
      // An image response in newer formats is sometimes incorrectly marked as "application/octet-stream",
      // so respect the extension too.
      const isImage = /^image/.test(record.mimeType) || /\.(avif|webp)$/i.test(record.url);
      // The network record is only valid for size information if it finished with a successful status
      // code that indicates a complete image response.
      if (isImage && record.finished && record.statusCode === 200) {
        map[record.url] = record;
      }

      return map;
    }, /** @type {Record<string, LH.Artifacts.NetworkRequest>} */ ({}));
  }

  /**
   *
   * @param {LH.Gatherer.FRTransitionalDriver} driver
   * @param {LH.Artifacts.ImageElement[]} elements
   * @param {Record<string, LH.Artifacts.NetworkRequest>} indexedNetworkRecords
   */
  async collectExtraDetails(driver, elements, indexedNetworkRecords) {
    // Don't do more than 5s of this expensive devtools protocol work. See #11289
    let reachedGatheringBudget = false;
    setTimeout(_ => (reachedGatheringBudget = true), 5000);
    let skippedCount = 0;

    for (const element of elements) {
      // Pull some of our information directly off the network record.
      const networkRecord = indexedNetworkRecords[element.src];
      element.mimeType = networkRecord && networkRecord.mimeType;

      if (reachedGatheringBudget) {
        skippedCount++;
        continue;
      }

      // Need source rules to determine if sized via CSS (for unsized-images).
      if (!element.isInShadowDOM && !element.isCss) {
        await this.fetchSourceRules(driver.defaultSession, element.node.devtoolsNodePath, element);
      }
      // Images within `picture` behave strangely and natural size information isn't accurate,
      // CSS images have no natural size information at all. Try to get the actual size if we can.
      // Additional fetch is expensive; don't bother if we don't have a networkRecord for the image.
      if ((element.isPicture || element.isCss || element.srcset) && networkRecord) {
        await this.fetchElementWithSizeInformation(driver, element);
      }
    }

    if (reachedGatheringBudget) {
      log.warn('ImageElements', `Reached gathering budget of 5s. Skipped extra details for ${skippedCount}/${elements.length}`); // eslint-disable-line max-len
    }
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @param {LH.Artifacts.NetworkRequest[]} networkRecords
   * @return {Promise<LH.Artifacts['ImageElements']>}
   */
  async _getArtifact(context, networkRecords) {
    const session = context.driver.defaultSession;
    const executionContext = context.driver.executionContext;
    const indexedNetworkRecords = this.indexNetworkRecords(networkRecords);

    const elements = await executionContext.evaluate(collectImageElementInfo, {
      args: [],
      deps: [
        pageFunctions.getElementsInDocumentString,
        pageFunctions.getBoundingClientRectString,
        pageFunctions.getNodeDetailsString,
        getClientRect,
        getPosition,
        getHTMLImages,
        getCSSImages,
      ],
    });

    await Promise.all([
      session.sendCommand('DOM.enable'),
      session.sendCommand('CSS.enable'),
      session.sendCommand('DOM.getDocument', {depth: -1, pierce: true}),
    ]);

    // Sort (in-place) as largest images descending.
    elements.sort((a, b) => {
      const aRecord = indexedNetworkRecords[a.src] || {};
      const bRecord = indexedNetworkRecords[b.src] || {};
      return bRecord.resourceSize - aRecord.resourceSize;
    });

    await this.collectExtraDetails(context.driver, elements, indexedNetworkRecords);

    await Promise.all([
      session.sendCommand('DOM.disable'),
      session.sendCommand('CSS.disable'),
    ]);

    return elements;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @return {Promise<LH.Artifacts['ImageElements']>}
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return this._getArtifact(context, networkRecords);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['ImageElements']>}
   */
  async afterPass(passContext, loadData) {
    return this._getArtifact({...passContext, dependencies: {}}, loadData.networkRecords);
  }
}

module.exports = ImageElements;
