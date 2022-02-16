/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';


import {DOM} from '../renderer/dom.js';
import {ReportRenderer} from '../renderer/report-renderer.js';
import {ReportUIFeatures} from '../renderer/report-ui-features.js';
import {CategoryRenderer} from './category-renderer.js';
import {DetailsRenderer} from './details-renderer.js';

/**
 * @param {LH.Result} lhr
 * @param {LH.Renderer.Options} opts
 * @return {HTMLElement}
 */
function renderReport(lhr, opts = {}) {
  const rootEl = document.createElement('article');
  rootEl.classList.add('lh-root', 'lh-vars');

  const dom = new DOM(rootEl.ownerDocument, rootEl);
  const renderer = new ReportRenderer(dom);

  renderer.renderReport(lhr, rootEl, opts);

  // Hook in JS features and page-level event listeners after the report
  // is in the document.
  const features = new ReportUIFeatures(dom, opts);
  features.initFeatures(lhr);
  return rootEl;
}

/**
 * @param {LH.ReportResult.Category} category
 * @param {Parameters<CategoryRenderer['renderCategoryScore']>[2]=} options
 * @return {DocumentFragment}
 */
function renderCategoryScore(category, options) {
  const dom = new DOM(document, document.documentElement);
  const detailsRenderer = new DetailsRenderer(dom);
  const categoryRenderer = new CategoryRenderer(dom, detailsRenderer);
  return categoryRenderer.renderCategoryScore(category, {}, options);
}

/**
 * @param {Blob} blob
 * @param {string} filename
 */
function saveFile(blob, filename) {
  const dom = new DOM(document, document.documentElement);
  dom.saveFile(blob, filename);
}

/**
 * @param {string} markdownText
 * @return {Element}
 */
function convertMarkdownCodeSnippets(markdownText) {
  const dom = new DOM(document, document.documentElement);
  return dom.convertMarkdownCodeSnippets(markdownText);
}

/**
 * @return {DocumentFragment}
 */
function createStylesElement() {
  const dom = new DOM(document, document.documentElement);
  return dom.createComponent('styles');
}

export {
  renderReport,
  renderCategoryScore,
  saveFile,
  convertMarkdownCodeSnippets,
  createStylesElement,
};
