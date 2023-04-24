/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview The entry point for rendering the Lighthouse report for the HTML
 * file created by ReportGenerator.
 * The renderer code is bundled and injected into the report HTML along with the JSON report.
 */

/* global ga */

import {renderReport} from '../renderer/api.js';
import {Logger} from '../renderer/logger.js';

function __initLighthouseReport__() {
  /** @type {LH.Result} */
  // @ts-expect-error
  const lhr = window.__LIGHTHOUSE_JSON__;

  const reportRootEl = renderReport(lhr, {
    getStandaloneReportHTML() {
      return document.documentElement.outerHTML;
    },
  });
  document.body.append(reportRootEl);

  document.addEventListener('lh-analytics', /** @param {Event} e */ e => {
    // @ts-expect-error
    if (window.ga) ga(e.detail.cmd, e.detail.fields);
  });

  document.addEventListener('lh-log', /** @param {Event} e */ e => {
    const el = document.querySelector('div#lh-log');
    if (!el) return;

    const logger = new Logger(el);
    // @ts-expect-error
    const detail = e.detail;

    switch (detail.cmd) {
      case 'log':
        logger.log(detail.msg);
        break;
      case 'warn':
        logger.warn(detail.msg);
        break;
      case 'error':
        logger.error(detail.msg);
        break;
      case 'hide':
        logger.hide();
        break;
    }
  });
}

// @ts-expect-error
window.__initLighthouseReport__ = __initLighthouseReport__;
