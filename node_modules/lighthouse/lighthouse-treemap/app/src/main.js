/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env browser */

/* globals webtreemap TreemapUtil */

/**
 * Allows for saving the document and loading with data intact.
 * @param {LH.Treemap.Options} options
 */
function injectOptions(options) {
  if (window.__treemapOptions) return;

  const scriptEl = document.createElement('script');
  scriptEl.textContent = `
    window.__treemapOptions = ${JSON.stringify(options)};
  `;
  document.head.append(scriptEl);
}

/**
 * @param {LH.Treemap.Options} options
 */
function init(options) {
  // ==== temporary
  TreemapUtil.find('main').textContent = JSON.stringify(options.lhr);
  // eslint-disable-next-line no-console
  console.log({webtreemap});
  // ==== temporary

  injectOptions(options);

  // eslint-disable-next-line no-console
  console.log('window.__treemapOptions', window.__treemapOptions);
}

/**
 * @param {string} message
 */
function showError(message) {
  document.body.textContent = message;
}

async function main() {
  if (window.__treemapOptions) {
    // Prefer the hardcoded options from a saved HTML file above all.
    init(window.__treemapOptions);
  } else if (new URLSearchParams(window.location.search).has('debug')) {
    const response = await fetch('debug.json');
    init(await response.json());
  } else {
    window.addEventListener('message', e => {
      if (e.source !== self.opener) return;

      /** @type {LH.Treemap.Options} */
      const options = e.data;
      const {lhr} = options;
      if (!lhr) return showError('Error: Invalid options');

      const documentUrl = lhr.requestedUrl;
      if (!documentUrl) return showError('Error: Invalid options');

      init(options);
    });
  }

  // If the page was opened as a popup, tell the opening window we're ready.
  if (self.opener && !self.opener.closed) {
    self.opener.postMessage({opened: true}, '*');
  }
}

document.addEventListener('DOMContentLoaded', main);
