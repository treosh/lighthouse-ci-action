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
 *
 * Dummy text for ensuring report robustness: </script> pre$`post %%LIGHTHOUSE_JSON%%
 * (this is handled by terser)
 */
'use strict';

/** @typedef {import('./dom.js').DOM} DOM */

import {CategoryRenderer} from './category-renderer.js';
import {DetailsRenderer} from './details-renderer.js';
import {ElementScreenshotRenderer} from './element-screenshot-renderer.js';
import {I18n} from './i18n.js';
import {PerformanceCategoryRenderer} from './performance-category-renderer.js';
import {PwaCategoryRenderer} from './pwa-category-renderer.js';
import {Util} from './util.js';


export class ReportRenderer {
  /**
   * @param {DOM} dom
   */
  constructor(dom) {
    /** @type {DOM} */
    this._dom = dom;
    /** @type {LH.Renderer.Options} */
    this._opts = {};
  }

  /**
   * @param {LH.Result} lhr
   * @param {HTMLElement?} rootEl Report root element containing the report
   * @param {LH.Renderer.Options=} opts
   * @return {!Element}
   */
  renderReport(lhr, rootEl, opts) {
    // Allow legacy report rendering API
    if (!this._dom.rootEl && rootEl) {
      console.warn('Please adopt the new report API in renderer/api.js.');
      const closestRoot = rootEl.closest('.lh-root');
      if (closestRoot) {
        this._dom.rootEl = /** @type {HTMLElement} */ (closestRoot);
      } else {
        rootEl.classList.add('lh-root', 'lh-vars');
        this._dom.rootEl = rootEl;
      }
    } else if (this._dom.rootEl && rootEl) {
      // Handle legacy flow-report case
      this._dom.rootEl = rootEl;
    }
    if (opts) {
      this._opts = opts;
    }

    this._dom.setLighthouseChannel(lhr.configSettings.channel || 'unknown');

    const report = Util.prepareReportResult(lhr);

    this._dom.rootEl.textContent = ''; // Remove previous report.
    this._dom.rootEl.appendChild(this._renderReport(report));

    return this._dom.rootEl;
  }

  /**
   * @param {LH.ReportResult} report
   * @return {DocumentFragment}
   */
  _renderReportTopbar(report) {
    const el = this._dom.createComponent('topbar');
    const metadataUrl = this._dom.find('a.lh-topbar__url', el);
    metadataUrl.textContent = report.finalUrl;
    metadataUrl.title = report.finalUrl;
    this._dom.safelySetHref(metadataUrl, report.finalUrl);
    return el;
  }

  /**
   * @return {DocumentFragment}
   */
  _renderReportHeader() {
    const el = this._dom.createComponent('heading');
    const domFragment = this._dom.createComponent('scoresWrapper');
    const placeholder = this._dom.find('.lh-scores-wrapper-placeholder', el);
    placeholder.replaceWith(domFragment);
    return el;
  }

  /**
   * @param {LH.ReportResult} report
   * @return {DocumentFragment}
   */
  _renderReportFooter(report) {
    const footer = this._dom.createComponent('footer');

    this._renderMetaBlock(report, footer);

    this._dom.find('.lh-footer__version_issue', footer).textContent = Util.i18n.strings.footerIssue;
    this._dom.find('.lh-footer__version', footer).textContent = report.lighthouseVersion;
    return footer;
  }

  /**
   * @param {LH.ReportResult} report
   * @param {DocumentFragment} footer
   */
  _renderMetaBlock(report, footer) {
    const envValues = Util.getEmulationDescriptions(report.configSettings || {});


    const match = report.userAgent.match(/(\w*Chrome\/[\d.]+)/); // \w* to include 'HeadlessChrome'
    const chromeVer = Array.isArray(match)
      ? match[1].replace('/', ' ').replace('Chrome', 'Chromium')
      : 'Chromium';
    const channel = report.configSettings.channel;
    const benchmarkIndex = report.environment.benchmarkIndex.toFixed(0);
    const axeVersion = report.environment.credits?.['axe-core'];

    // [CSS icon class, textContent, tooltipText]
    const metaItems = [
      ['date',
        `Captured at ${Util.i18n.formatDateTime(report.fetchTime)}`],
      ['devices',
        `${envValues.deviceEmulation} with Lighthouse ${report.lighthouseVersion}`,
        `${Util.i18n.strings.runtimeSettingsBenchmark}: ${benchmarkIndex}` +
            `\n${Util.i18n.strings.runtimeSettingsCPUThrottling}: ${envValues.cpuThrottling}` +
            (axeVersion ? `\n${Util.i18n.strings.runtimeSettingsAxeVersion}: ${axeVersion}` : '')],
      ['samples-one',
        Util.i18n.strings.runtimeSingleLoad,
        Util.i18n.strings.runtimeSingleLoadTooltip],
      ['stopwatch',
        Util.i18n.strings.runtimeAnalysisWindow],
      ['networkspeed',
        `${envValues.summary}`,
        `${Util.i18n.strings.runtimeSettingsNetworkThrottling}: ${envValues.networkThrottling}`],
      ['chrome',
        `Using ${chromeVer}` + (channel ? ` with ${channel}` : ''),
        `${Util.i18n.strings.runtimeSettingsUANetwork}: "${report.environment.networkUserAgent}"`],
    ];

    const metaItemsEl = this._dom.find('.lh-meta__items', footer);
    for (const [iconname, text, tooltip] of metaItems) {
      const itemEl = this._dom.createChildOf(metaItemsEl, 'li', 'lh-meta__item');
      itemEl.textContent = text;
      if (tooltip) {
        itemEl.classList.add('lh-tooltip-boundary');
        const tooltipEl = this._dom.createChildOf(itemEl, 'div', 'lh-tooltip');
        tooltipEl.textContent = tooltip;
      }
      itemEl.classList.add('lh-report-icon', `lh-report-icon--${iconname}`);
    }
  }

  /**
   * Returns a div with a list of top-level warnings, or an empty div if no warnings.
   * @param {LH.ReportResult} report
   * @return {Node}
   */
  _renderReportWarnings(report) {
    if (!report.runWarnings || report.runWarnings.length === 0) {
      return this._dom.createElement('div');
    }

    const container = this._dom.createComponent('warningsToplevel');
    const message = this._dom.find('.lh-warnings__msg', container);
    message.textContent = Util.i18n.strings.toplevelWarningsMessage;

    const warnings = this._dom.find('ul', container);
    for (const warningString of report.runWarnings) {
      const warning = warnings.appendChild(this._dom.createElement('li'));
      warning.appendChild(this._dom.convertMarkdownLinkSnippets(warningString));
    }

    return container;
  }

  /**
   * @param {LH.ReportResult} report
   * @param {CategoryRenderer} categoryRenderer
   * @param {Record<string, CategoryRenderer>} specificCategoryRenderers
   * @return {!DocumentFragment[]}
   */
  _renderScoreGauges(report, categoryRenderer, specificCategoryRenderers) {
    // Group gauges in this order: default, pwa, plugins.
    const defaultGauges = [];
    const customGauges = []; // PWA.
    const pluginGauges = [];

    for (const category of Object.values(report.categories)) {
      const renderer = specificCategoryRenderers[category.id] || categoryRenderer;
      const categoryGauge = renderer.renderCategoryScore(
        category,
        report.categoryGroups || {},
        {gatherMode: report.gatherMode}
      );

      const gaugeWrapperEl = this._dom.find('a.lh-gauge__wrapper, a.lh-fraction__wrapper',
        categoryGauge);
      if (gaugeWrapperEl) {
        this._dom.safelySetHref(gaugeWrapperEl, `#${category.id}`);
        // Handle navigation clicks by scrolling to target without changing the page's URL.
        // Why? Some report embedding clients have their own routing and updating the location.hash
        // can introduce problems. Others may have an unpredictable `<base>` URL which ensures
        // navigation to `${baseURL}#categoryid` will be unintended.
        gaugeWrapperEl.addEventListener('click', e => {
          if (!gaugeWrapperEl.matches('[href^="#"]')) return;
          const selector = gaugeWrapperEl.getAttribute('href');
          const reportRoot = this._dom.rootEl;
          if (!selector || !reportRoot) return;
          const destEl = this._dom.find(selector, reportRoot);
          e.preventDefault();
          destEl.scrollIntoView();
        });
        this._opts.onPageAnchorRendered?.(gaugeWrapperEl);
      }


      if (Util.isPluginCategory(category.id)) {
        pluginGauges.push(categoryGauge);
      } else if (renderer.renderCategoryScore === categoryRenderer.renderCategoryScore) {
        // The renderer for default categories is just the default CategoryRenderer.
        // If the functions are equal, then renderer is an instance of CategoryRenderer.
        // For example, the PWA category uses PwaCategoryRenderer, which overrides
        // CategoryRenderer.renderCategoryScore, so it would fail this check and be placed
        // in the customGauges bucket.
        defaultGauges.push(categoryGauge);
      } else {
        customGauges.push(categoryGauge);
      }
    }

    return [...defaultGauges, ...customGauges, ...pluginGauges];
  }

  /**
   * @param {LH.ReportResult} report
   * @return {!DocumentFragment}
   */
  _renderReport(report) {
    const i18n = new I18n(report.configSettings.locale, {
      // Set missing renderer strings to default (english) values.
      ...Util.UIStrings,
      ...report.i18n.rendererFormattedStrings,
    });
    Util.i18n = i18n;
    Util.reportJson = report;

    const fullPageScreenshot =
      report.audits['full-page-screenshot']?.details &&
      report.audits['full-page-screenshot'].details.type === 'full-page-screenshot' ?
      report.audits['full-page-screenshot'].details : undefined;
    const detailsRenderer = new DetailsRenderer(this._dom, {
      fullPageScreenshot,
    });

    const categoryRenderer = new CategoryRenderer(this._dom, detailsRenderer);

    /** @type {Record<string, CategoryRenderer>} */
    const specificCategoryRenderers = {
      performance: new PerformanceCategoryRenderer(this._dom, detailsRenderer),
      pwa: new PwaCategoryRenderer(this._dom, detailsRenderer),
    };

    const headerContainer = this._dom.createElement('div');
    headerContainer.appendChild(this._renderReportHeader());

    const reportContainer = this._dom.createElement('div', 'lh-container');
    const reportSection = this._dom.createElement('div', 'lh-report');
    reportSection.appendChild(this._renderReportWarnings(report));

    let scoreHeader;
    const isSoloCategory = Object.keys(report.categories).length === 1;
    if (!isSoloCategory) {
      scoreHeader = this._dom.createElement('div', 'lh-scores-header');
    } else {
      headerContainer.classList.add('lh-header--solo-category');
    }

    const scoreScale = this._dom.createElement('div');
    scoreScale.classList.add('lh-scorescale-wrap');
    scoreScale.append(this._dom.createComponent('scorescale'));
    if (scoreHeader) {
      const scoresContainer = this._dom.find('.lh-scores-container', headerContainer);
      scoreHeader.append(
        ...this._renderScoreGauges(report, categoryRenderer, specificCategoryRenderers));
      scoresContainer.appendChild(scoreHeader);
      scoresContainer.appendChild(scoreScale);

      const stickyHeader = this._dom.createElement('div', 'lh-sticky-header');
      stickyHeader.append(
        ...this._renderScoreGauges(report, categoryRenderer, specificCategoryRenderers));
      reportContainer.appendChild(stickyHeader);
    }

    const categories = reportSection.appendChild(this._dom.createElement('div', 'lh-categories'));
    const categoryOptions = {gatherMode: report.gatherMode};
    for (const category of Object.values(report.categories)) {
      const renderer = specificCategoryRenderers[category.id] || categoryRenderer;
      // .lh-category-wrapper is full-width and provides horizontal rules between categories.
      // .lh-category within has the max-width: var(--report-content-max-width);
      const wrapper = renderer.dom.createChildOf(categories, 'div', 'lh-category-wrapper');
      wrapper.appendChild(renderer.render(
        category,
        report.categoryGroups,
        categoryOptions
      ));
    }

    categoryRenderer.injectFinalScreenshot(categories, report.audits, scoreScale);

    const reportFragment = this._dom.createFragment();
    if (!this._opts.omitGlobalStyles) {
      reportFragment.append(this._dom.createComponent('styles'));
    }

    if (!this._opts.omitTopbar) {
      reportFragment.appendChild(this._renderReportTopbar(report));
    }

    reportFragment.appendChild(reportContainer);
    reportContainer.appendChild(headerContainer);
    reportContainer.appendChild(reportSection);
    reportSection.appendChild(this._renderReportFooter(report));

    if (fullPageScreenshot) {
      ElementScreenshotRenderer.installFullPageScreenshot(
        this._dom.rootEl, fullPageScreenshot.screenshot);
    }

    return reportFragment;
  }
}
