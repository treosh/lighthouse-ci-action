/**
 * @license
 * Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/* eslint-env browser */

/** @typedef {HTMLElementTagNameMap & {[id: string]: HTMLElement}} HTMLElementByTagName */
/** @template {string} T @typedef {import('typed-query-selector/parser').ParseSelector<T, Element>} ParseSelector */

import {Util} from './util.js';
import {createComponent} from './components.js';

export class DOM {
  /**
   * @param {Document} document
   * @param {HTMLElement} rootEl
   */
  constructor(document, rootEl) {
    /** @type {Document} */
    this._document = document;
    /** @type {string} */
    this._lighthouseChannel = 'unknown';
    /** @type {Map<string, DocumentFragment>} */
    this._componentCache = new Map();
    /** @type {HTMLElement} */
    // For legacy Report API users, this'll be undefined, but set in renderReport
    this.rootEl = rootEl;
  }

  /**
   * @template {string} T
   * @param {T} name
   * @param {string=} className
   * @return {HTMLElementByTagName[T]}
   */
  createElement(name, className) {
    const element = this._document.createElement(name);
    if (className) {
      for (const token of className.split(/\s+/)) {
        if (token) element.classList.add(token);
      }
    }
    return element;
  }

  /**
   * @param {string} namespaceURI
   * @param {string} name
   * @param {string=} className
   * @return {Element}
   */
  createElementNS(namespaceURI, name, className) {
    const element = this._document.createElementNS(namespaceURI, name);
    if (className) {
      for (const token of className.split(/\s+/)) {
        if (token) element.classList.add(token);
      }
    }
    return element;
  }

  /**
   * @return {!DocumentFragment}
   */
  createFragment() {
    return this._document.createDocumentFragment();
  }

  /**
   * @param {string} data
   * @return {!Node}
   */
  createTextNode(data) {
    return this._document.createTextNode(data);
  }


  /**
   * @template {string} T
   * @param {Element} parentElem
   * @param {T} elementName
   * @param {string=} className
   * @return {HTMLElementByTagName[T]}
   */
  createChildOf(parentElem, elementName, className) {
    const element = this.createElement(elementName, className);
    parentElem.appendChild(element);
    return element;
  }

  /**
   * @param {import('./components.js').ComponentName} componentName
   * @return {!DocumentFragment} A clone of the cached component.
   */
  createComponent(componentName) {
    let component = this._componentCache.get(componentName);
    if (component) {
      const cloned = /** @type {DocumentFragment} */ (component.cloneNode(true));
      // Prevent duplicate styles in the DOM. After a template has been stamped
      // for the first time, remove the clone's styles so they're not re-added.
      this.findAll('style', cloned).forEach(style => style.remove());
      return cloned;
    }

    component = createComponent(this, componentName);
    this._componentCache.set(componentName, component);
    const cloned = /** @type {DocumentFragment} */ (component.cloneNode(true));
    return cloned;
  }

  clearComponentCache() {
    this._componentCache.clear();
  }

  /**
   * @param {string} text
   * @return {Element}
   */
  convertMarkdownLinkSnippets(text) {
    const element = this.createElement('span');

    for (const segment of Util.splitMarkdownLink(text)) {
      if (!segment.isLink) {
        // Plain text segment.
        element.appendChild(this._document.createTextNode(segment.text));
        continue;
      }

      // Otherwise, append any links found.
      const url = new URL(segment.linkHref);

      const DOCS_ORIGINS = ['https://developers.google.com', 'https://web.dev'];
      if (DOCS_ORIGINS.includes(url.origin)) {
        url.searchParams.set('utm_source', 'lighthouse');
        url.searchParams.set('utm_medium', this._lighthouseChannel);
      }

      const a = this.createElement('a');
      a.rel = 'noopener';
      a.target = '_blank';
      a.textContent = segment.text;
      this.safelySetHref(a, url.href);
      element.appendChild(a);
    }

    return element;
  }

  /**
   * Set link href, but safely, preventing `javascript:` protocol, etc.
   * @see https://github.com/google/safevalues/
   * @param {HTMLAnchorElement} elem
   * @param {string} url
   */
  safelySetHref(elem, url) {
    // Defaults to '' to fix proto roundtrip issue. See https://github.com/GoogleChrome/lighthouse/issues/12868
    url = url || '';

    // In-page anchor links are safe.
    if (url.startsWith('#')) {
      elem.href = url;
      return;
    }

    const allowedProtocols = ['https:', 'http:'];
    let parsed;
    try {
      parsed = new URL(url);
    } catch (_) {}

    if (parsed && allowedProtocols.includes(parsed.protocol)) {
      elem.href = parsed.href;
    }
  }

  /**
   * Only create blob URLs for JSON & HTML
   * @param {HTMLAnchorElement} elem
   * @param {Blob} blob
   */
  safelySetBlobHref(elem, blob) {
    if (blob.type !== 'text/html' && blob.type !== 'application/json') {
      throw new Error('Unsupported blob type');
    }
    const href = URL.createObjectURL(blob);
    elem.href = href;
  }

  /**
   * @param {string} markdownText
   * @return {Element}
   */
  convertMarkdownCodeSnippets(markdownText) {
    const element = this.createElement('span');

    for (const segment of Util.splitMarkdownCodeSpans(markdownText)) {
      if (segment.isCode) {
        const pre = this.createElement('code');
        pre.textContent = segment.text;
        element.appendChild(pre);
      } else {
        element.appendChild(this._document.createTextNode(segment.text));
      }
    }

    return element;
  }

  /**
   * The channel to use for UTM data when rendering links to the documentation.
   * @param {string} lighthouseChannel
   */
  setLighthouseChannel(lighthouseChannel) {
    this._lighthouseChannel = lighthouseChannel;
  }

  /**
   * ONLY use if `dom.rootEl` isn't sufficient for your needs. `dom.rootEl` is preferred
   * for all scoping, because a document can have multiple reports within it.
   * @return {Document}
   */
  document() {
    return this._document;
  }

  /**
   * TODO(paulirish): import and conditionally apply the DevTools frontend subclasses instead of this
   * @return {boolean}
   */
  isDevTools() {
    return !!this._document.querySelector('.lh-devtools');
  }

  /**
   * Guaranteed context.querySelector. Always returns an element or throws if
   * nothing matches query.
   * @template {string} T
   * @param {T} query
   * @param {ParentNode} context
   * @return {ParseSelector<T>}
   */
  find(query, context) {
    const result = context.querySelector(query);
    if (result === null) {
      throw new Error(`query ${query} not found`);
    }

    // Because we control the report layout and templates, use the simpler
    // `typed-query-selector` types that don't require differentiating between
    // e.g. HTMLAnchorElement and SVGAElement. See https://github.com/GoogleChrome/lighthouse/issues/12011
    return /** @type {ParseSelector<T>} */ (result);
  }

  /**
   * Helper for context.querySelectorAll. Returns an Array instead of a NodeList.
   * @template {string} T
   * @param {T} query
   * @param {ParentNode} context
   */
  findAll(query, context) {
    const elements = Array.from(context.querySelectorAll(query));
    return elements;
  }

  /**
   * Fires a custom DOM event on target.
   * @param {string} name Name of the event.
   * @param {Node=} target DOM node to fire the event on.
   * @param {*=} detail Custom data to include.
   */
  fireEventOn(name, target = this._document, detail) {
    const event = new CustomEvent(name, detail ? {detail} : undefined);
    target.dispatchEvent(event);
  }

  /**
   * Downloads a file (blob) using a[download].
   * @param {Blob|File} blob The file to save.
   * @param {string} filename
   */
  saveFile(blob, filename) {
    const a = this.createElement('a');
    a.download = filename;
    this.safelySetBlobHref(a, blob);
    this._document.body.appendChild(a); // Firefox requires anchor to be in the DOM.
    a.click();

    // cleanup.
    this._document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }
}
