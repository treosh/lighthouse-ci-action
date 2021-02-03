/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
/**
 * @fileoverview
 * Audit that checks whether all images have explicit width and height.
 */

'use strict';

const Audit = require('./audit.js');
const i18n = require('./../lib/i18n/i18n.js');
const URL = require('./../lib/url-shim.js');

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on whether all images have explicit width and height. This descriptive title is shown to users when every image has explicit width and height */
  title: 'Image elements have explicit `width` and `height`',
  /** Title of a Lighthouse audit that provides detail on whether all images have explicit width and height. This descriptive title is shown to users when one or more images does not have explicit width and height */
  failureTitle: 'Image elements do not have explicit `width` and `height`',
  /** Description of a Lighthouse audit that tells the user why they should include explicit width and height for all images. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Set an explicit width and height on image elements to reduce layout shifts and improve CLS. [Learn more](https://web.dev/optimize-cls/#images-without-dimensions)',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class UnsizedImages extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'unsized-images',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['ImageElements'],
    };
  }

  /**
   * An img size attribute is valid for preventing CLS
   * if it is a non-negative, non-zero integer.
   * @param {string} attr
   * @return {boolean}
   */
  static isValidAttr(attr) {
    const NON_NEGATIVE_INT_REGEX = /^\d+$/;
    const ZERO_REGEX = /^0+$/;
    return NON_NEGATIVE_INT_REGEX.test(attr) && !ZERO_REGEX.test(attr);
  }

  /**
   * An img css size property is valid for preventing CLS
   * if it is defined, not empty, and not equal to 'auto'.
   * @param {string | undefined} property
   * @return {boolean}
   */
  static isValidCss(property) {
    if (!property) return false;
    return property !== 'auto';
  }

  /**
   * Images are considered sized if they have defined & valid values.
   * @param {LH.Artifacts.ImageElement} image
   * @return {boolean}
   */
  static isSizedImage(image) {
    const attrWidth = image.attributeWidth;
    const attrHeight = image.attributeHeight;
    const cssWidth = image.cssWidth;
    const cssHeight = image.cssHeight;
    const widthIsValidAttribute = UnsizedImages.isValidAttr(attrWidth);
    const widthIsValidCss = UnsizedImages.isValidCss(cssWidth);
    const heightIsValidAttribute = UnsizedImages.isValidAttr(attrHeight);
    const heightIsValidCss = UnsizedImages.isValidCss(cssHeight);
    const validWidth = widthIsValidAttribute || widthIsValidCss;
    const validHeight = heightIsValidAttribute || heightIsValidCss;
    return validWidth && validHeight;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts) {
    // CSS background-images & ShadowRoot images are ignored for this audit.
    const images = artifacts.ImageElements.filter(el => !el.isCss && !el.isInShadowDOM);
    const unsizedImages = [];

    for (const image of images) {
      const isFixedImage =
        image.cssComputedPosition === 'fixed' || image.cssComputedPosition === 'absolute';

      if (isFixedImage || UnsizedImages.isSizedImage(image)) continue;
      const url = URL.elideDataURI(image.src);
      unsizedImages.push({
        url,
        node: {
          type: /** @type {'node'} */ ('node'),
          path: image.node.devtoolsNodePath,
          selector: image.node.selector,
          nodeLabel: image.node.nodeLabel,
          snippet: image.node.snippet,
        },
      });
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'url', itemType: 'thumbnail', text: ''},
      {key: 'url', itemType: 'url', text: str_(i18n.UIStrings.columnURL)},
      {key: 'node', itemType: 'node', text: str_(i18n.UIStrings.columnFailingElem)},
    ];

    return {
      score: unsizedImages.length > 0 ? 0 : 1,
      notApplicable: images.length === 0,
      details: Audit.makeTableDetails(headings, unsizedImages),
    };
  }
}

module.exports = UnsizedImages;
module.exports.UIStrings = UIStrings;
