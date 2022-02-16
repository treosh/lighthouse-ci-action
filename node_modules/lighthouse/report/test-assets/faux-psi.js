/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @fileoverview This file exercises two LH reports within the same DOM. */

/** @typedef {import('../clients/bundle.js')} lighthouseRenderer */
/** @type {lighthouseRenderer} */
// @ts-expect-error
const lighthouseRenderer = window['report'];

const wait = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));


(async function __initPsiReports__() {
  renderLHReport();

  document.querySelector('button')?.addEventListener('click', () => {
    renderLHReport();
  });
})();

async function renderLHReport() {
  // @ts-expect-error
  const mobileLHR = window.__LIGHTHOUSE_JSON__;
  const desktopLHR = JSON.parse(JSON.stringify(mobileLHR));

  const lhrs = {
    'mobile': mobileLHR,
    'desktop': desktopLHR,
  };

  for (const [tabId, lhr] of Object.entries(lhrs)) {
    await distinguishLHR(lhr, tabId);

    const container = document.querySelector(`section#${tabId} .reportContainer`);
    if (!container) throw new Error('Unexpected DOM. Bailing.');

    try {
      container.textContent = 'Analyzing…';
      await wait(500);
      for (const el of container.childNodes) el.remove();

      const reportRootEl = lighthouseRenderer.renderReport(lhr, {
        omitTopbar: true,
        disableAutoDarkModeAndFireworks: true,
      });
      // TODO: display warnings if appropriate.
      for (const el of reportRootEl.querySelectorAll('.lh-warnings--toplevel')) {
        el.setAttribute('hidden', 'true');
      }

      // Move env block
      const metaItemsEl = reportRootEl.querySelector('.lh-meta__items');
      if (metaItemsEl) {
        reportRootEl.querySelector('.lh-metrics-container')?.parentNode?.insertBefore(
          metaItemsEl,
          reportRootEl.querySelector('.lh-buttons')
        );
      }

      container.append(reportRootEl);

      // Override some LH styles. (To find .lh-vars we must descend from reportRootEl's parent)
      for (const el of container.querySelectorAll('article.lh-vars')) {
        // Ensure these css var names are not stale.
        el.style.setProperty('--report-content-max-width', '100%');
        el.style.setProperty('--edge-gap-padding', '0');
      }
      for (const el of reportRootEl.querySelectorAll('footer.lh-footer')) {
        el.style.display = 'none';
      }
    } catch (e) {
      console.error(e);
      container.textContent = 'Error: LHR failed to render.';
    }
  }
}


/**
 * Tweak the LHR to make the desktop and mobile reports easier to identify.
 * Adjusted: Perf category name and score, and emoji placed on top of key screenshots.
 * @param {LH.Result} lhr
 * @param {string} tabId
 */
async function distinguishLHR(lhr, tabId) {
  if (tabId === 'desktop') {
    lhr.categories.performance.score = 0.81;
  }

  const finalSSDetails = lhr.audits['final-screenshot']?.details;
  if (finalSSDetails && finalSSDetails.type === 'screenshot') {
    finalSSDetails.data = await decorateScreenshot(finalSSDetails.data, tabId);
  }

  const fpSSDetails = lhr.audits['full-page-screenshot']?.details;
  if (fpSSDetails && fpSSDetails.type === 'full-page-screenshot') {
    fpSSDetails.screenshot.data = await decorateScreenshot(fpSSDetails.screenshot.data, tabId);
  }
}

/**
 * Add 📱 and 💻 emoji on top of screenshot
 * @param {string} datauri
 * @param {string} tabId
 */
async function decorateScreenshot(datauri, tabId) {
  const img = document.createElement('img');

  await new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = datauri;
  });
  const c = document.createElement('canvas');
  c.width = tabId === 'desktop' ? 280 : img.width;
  c.height = tabId === 'desktop' ? 194 : img.height;

  const ctx = c.getContext('2d');
  if (!ctx) throw new Error();
  ctx.drawImage(img, 0, 0, c.width, c.height);
  ctx.font = `${c.width / 2}px serif`;
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.7;
  ctx.fillText(tabId === 'mobile' ? '📱' : '💻', c.width / 2, Math.min(c.height / 2, 700));
  return c.toDataURL();
}
