/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env browser */

/** @typedef {import('./dom.js').DOM} DOM */

/**
 * @param {DOM} dom
 * @param {boolean} [force]
 */
export function toggleDarkTheme(dom, force) {
  const el = dom.rootEl;
  // This seems unnecessary, but in DevTools, passing "undefined" as the second
  // parameter acts like passing "false".
  // https://github.com/ChromeDevTools/devtools-frontend/blob/dd6a6d4153647c2a4203c327c595692c5e0a4256/front_end/dom_extension/DOMExtension.js#L809-L819
  if (typeof force === 'undefined') {
    el.classList.toggle('lh-dark');
  } else {
    el.classList.toggle('lh-dark', force);
  }
}
