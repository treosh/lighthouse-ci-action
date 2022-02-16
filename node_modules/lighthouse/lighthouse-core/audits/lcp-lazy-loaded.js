/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on whether the largest above-the-fold image was loaded with sufficient priority. This descriptive title is shown to users when the image was loaded properly. */
  title: 'Largest Contentful Paint image was not lazily loaded',
  /** Title of a Lighthouse audit that provides detail on whether the largest above-the-fold image was loaded with sufficient priority. This descriptive title is shown to users when the image was loaded inefficiently using the `loading=lazy` attribute. */
  failureTitle: 'Largest Contentful Paint image was lazily loaded',
  /** Description of a Lighthouse audit that tells the user why the advice is important. This is displayed after a user expands the section to see more. No character length limits. */
  description: 'Above-the-fold images that are lazily loaded render later in the page lifecycle, which can delay the largest contentful paint. [Learn more](https://web.dev/lcp-lazy-loading/).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class LargestContentfulPaintLazyLoaded extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'lcp-lazy-loaded',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      supportedModes: ['navigation'],
      requiredArtifacts: ['TraceElements', 'ViewportDimensions', 'ImageElements'],
    };
  }

  /**
   * @param {LH.Artifacts.ImageElement} image
   * @param {LH.Artifacts.ViewportDimensions} viewportDimensions
   * @return {boolean}
   */
  static isImageInViewport(image, viewportDimensions) {
    const imageTop = image.clientRect.top;
    const viewportHeight = viewportDimensions.innerHeight;
    return imageTop < viewportHeight;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    const lcpElement = artifacts.TraceElements
      .find(element => element.traceEventType === 'largest-contentful-paint');
    const lcpElementImage = lcpElement ? artifacts.ImageElements.find(elem => {
      return elem.node.devtoolsNodePath === lcpElement.node.devtoolsNodePath;
    }) : undefined;


    if (!lcpElementImage ||
      !this.isImageInViewport(lcpElementImage, artifacts.ViewportDimensions)) {
      return {score: 1, notApplicable: true};
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'node', itemType: 'node', text: str_(i18n.UIStrings.columnElement)},
    ];

    const details = Audit.makeTableDetails(headings, [
      {
        node: Audit.makeNodeItem(lcpElementImage.node),
      },
    ]);

    return {
      score: lcpElementImage.loading === 'lazy' ? 0 : 1,
      details,
    };
  }
}

module.exports = LargestContentfulPaintLazyLoaded;
module.exports.UIStrings = UIStrings;
