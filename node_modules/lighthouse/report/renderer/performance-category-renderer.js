/**
 * @license
 * Copyright 2018 The Lighthouse Authors. All Rights Reserved.
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

/** @typedef {import('./dom.js').DOM} DOM */

import {Util} from './util.js';
import {CategoryRenderer} from './category-renderer.js';

export class PerformanceCategoryRenderer extends CategoryRenderer {
  /**
   * @param {LH.ReportResult.AuditRef} audit
   * @return {!Element}
   */
  _renderMetric(audit) {
    const tmpl = this.dom.createComponent('metric');
    const element = this.dom.find('.lh-metric', tmpl);
    element.id = audit.result.id;
    const rating = Util.calculateRating(audit.result.score, audit.result.scoreDisplayMode);
    element.classList.add(`lh-metric--${rating}`);

    const titleEl = this.dom.find('.lh-metric__title', tmpl);
    titleEl.textContent = audit.result.title;

    const valueEl = this.dom.find('.lh-metric__value', tmpl);
    valueEl.textContent = audit.result.displayValue || '';

    const descriptionEl = this.dom.find('.lh-metric__description', tmpl);
    descriptionEl.appendChild(this.dom.convertMarkdownLinkSnippets(audit.result.description));

    if (audit.result.scoreDisplayMode === 'error') {
      descriptionEl.textContent = '';
      valueEl.textContent = 'Error!';
      const tooltip = this.dom.createChildOf(descriptionEl, 'span');
      tooltip.textContent = audit.result.errorMessage || 'Report error: no metric information';
    } else if (audit.result.scoreDisplayMode === 'notApplicable') {
      valueEl.textContent = '--';
    }

    return element;
  }

  /**
   * @param {LH.ReportResult.AuditRef} audit
   * @param {number} scale
   * @return {!Element}
   */
  _renderOpportunity(audit, scale) {
    const oppTmpl = this.dom.createComponent('opportunity');
    const element = this.populateAuditValues(audit, oppTmpl);
    element.id = audit.result.id;

    if (!audit.result.details || audit.result.scoreDisplayMode === 'error') {
      return element;
    }
    const details = audit.result.details;
    if (details.type !== 'opportunity') {
      return element;
    }

    // Overwrite the displayValue with opportunity's wastedMs
    // TODO: normalize this to one tagName.
    const displayEl =
      this.dom.find('span.lh-audit__display-text, div.lh-audit__display-text', element);
    const sparklineWidthPct = `${details.overallSavingsMs / scale * 100}%`;
    this.dom.find('div.lh-sparkline__bar', element).style.width = sparklineWidthPct;
    displayEl.textContent = Util.i18n.formatSeconds(details.overallSavingsMs, 0.01);

    // Set [title] tooltips
    if (audit.result.displayValue) {
      const displayValue = audit.result.displayValue;
      this.dom.find('div.lh-load-opportunity__sparkline', element).title = displayValue;
      displayEl.title = displayValue;
    }

    return element;
  }

  /**
   * Get an audit's wastedMs to sort the opportunity by, and scale the sparkline width
   * Opportunities with an error won't have a details object, so MIN_VALUE is returned to keep any
   * erroring opportunities last in sort order.
   * @param {LH.ReportResult.AuditRef} audit
   * @return {number}
   */
  _getWastedMs(audit) {
    if (audit.result.details && audit.result.details.type === 'opportunity') {
      const details = audit.result.details;
      if (typeof details.overallSavingsMs !== 'number') {
        throw new Error('non-opportunity details passed to _getWastedMs');
      }
      return details.overallSavingsMs;
    } else {
      return Number.MIN_VALUE;
    }
  }

  /**
   * Get a link to the interactive scoring calculator with the metric values.
   * @param {LH.ReportResult.AuditRef[]} auditRefs
   * @return {string}
   */
  _getScoringCalculatorHref(auditRefs) {
    // TODO: filter by !!acronym when dropping renderer support of v7 LHRs.
    const metrics = auditRefs.filter(audit => audit.group === 'metrics');
    const fci = auditRefs.find(audit => audit.id === 'first-cpu-idle');
    const fmp = auditRefs.find(audit => audit.id === 'first-meaningful-paint');
    if (fci) metrics.push(fci);
    if (fmp) metrics.push(fmp);

    /**
     * Clamp figure to 2 decimal places
     * @param {number} val
     * @return {number}
     */
    const clampTo2Decimals = val => Math.round(val * 100) / 100;

    const metricPairs = metrics.map(audit => {
      let value;
      if (typeof audit.result.numericValue === 'number') {
        value = audit.id === 'cumulative-layout-shift' ?
          clampTo2Decimals(audit.result.numericValue) :
          Math.round(audit.result.numericValue);
        value = value.toString();
      } else {
        value = 'null';
      }
      return [audit.acronym || audit.id, value];
    });
    const paramPairs = [...metricPairs];

    if (Util.reportJson) {
      paramPairs.push(['device', Util.reportJson.configSettings.formFactor]);
      paramPairs.push(['version', Util.reportJson.lighthouseVersion]);
    }

    const params = new URLSearchParams(paramPairs);
    const url = new URL('https://googlechrome.github.io/lighthouse/scorecalc/');
    url.hash = params.toString();
    return url.href;
  }

  /**
   * For performance, audits with no group should be a diagnostic or opportunity.
   * The audit details type will determine which of the two groups an audit is in.
   *
   * @param {LH.ReportResult.AuditRef} audit
   * @return {'load-opportunity'|'diagnostic'|null}
   */
  _classifyPerformanceAudit(audit) {
    if (audit.group) return null;
    if (audit.result.details && audit.result.details.type === 'opportunity') {
      return 'load-opportunity';
    }
    return 'diagnostic';
  }

  /**
   * @param {LH.ReportResult.Category} category
   * @param {Object<string, LH.Result.ReportGroup>} groups
   * @param {{gatherMode: LH.Result.GatherMode}=} options
   * @return {Element}
   * @override
   */
  render(category, groups, options) {
    const strings = Util.i18n.strings;
    const element = this.dom.createElement('div', 'lh-category');
    element.id = category.id;
    element.appendChild(this.renderCategoryHeader(category, groups, options));

    // Metrics.
    const metricAudits = category.auditRefs.filter(audit => audit.group === 'metrics');
    if (metricAudits.length) {
      const [metricsGroupEl, metricsFooterEl] = this.renderAuditGroup(groups.metrics);

      // Metric descriptions toggle.
      const checkboxEl = this.dom.createElement('input', 'lh-metrics-toggle__input');
      const checkboxId = `lh-metrics-toggle${Util.getUniqueSuffix()}`;
      checkboxEl.setAttribute('aria-label', 'Toggle the display of metric descriptions');
      checkboxEl.type = 'checkbox';
      checkboxEl.id = checkboxId;
      metricsGroupEl.prepend(checkboxEl);
      const metricHeaderEl = this.dom.find('.lh-audit-group__header', metricsGroupEl);
      const labelEl = this.dom.createChildOf(metricHeaderEl, 'label', 'lh-metrics-toggle__label');
      labelEl.htmlFor = checkboxId;
      const showEl = this.dom.createChildOf(labelEl, 'span', 'lh-metrics-toggle__labeltext--show');
      const hideEl = this.dom.createChildOf(labelEl, 'span', 'lh-metrics-toggle__labeltext--hide');
      showEl.textContent = Util.i18n.strings.expandView;
      hideEl.textContent = Util.i18n.strings.collapseView;

      const metricsBoxesEl = this.dom.createElement('div', 'lh-metrics-container');
      metricsGroupEl.insertBefore(metricsBoxesEl, metricsFooterEl);
      metricAudits.forEach(item => {
        metricsBoxesEl.appendChild(this._renderMetric(item));
      });

      // Only add the disclaimer with the score calculator link if the category was rendered with a score gauge.
      if (element.querySelector('.lh-gauge__wrapper')) {
        const descriptionEl = this.dom.find('.lh-category-header__description', element);
        const estValuesEl = this.dom.createChildOf(descriptionEl, 'div', 'lh-metrics__disclaimer');
        const disclaimerEl = this.dom.convertMarkdownLinkSnippets(strings.varianceDisclaimer);
        estValuesEl.appendChild(disclaimerEl);

        // Add link to score calculator.
        const calculatorLink = this.dom.createChildOf(estValuesEl, 'a', 'lh-calclink');
        calculatorLink.target = '_blank';
        calculatorLink.textContent = strings.calculatorLink;
        this.dom.safelySetHref(calculatorLink, this._getScoringCalculatorHref(category.auditRefs));
      }

      metricsGroupEl.classList.add('lh-audit-group--metrics');
      element.appendChild(metricsGroupEl);
    }

    // Filmstrip
    const timelineEl = this.dom.createChildOf(element, 'div', 'lh-filmstrip-container');
    const thumbnailAudit = category.auditRefs.find(audit => audit.id === 'screenshot-thumbnails');
    const thumbnailResult = thumbnailAudit?.result;
    if (thumbnailResult?.details) {
      timelineEl.id = thumbnailResult.id;
      const filmstripEl = this.detailsRenderer.render(thumbnailResult.details);
      filmstripEl && timelineEl.appendChild(filmstripEl);
    }

    // Opportunities
    const opportunityAudits = category.auditRefs
        .filter(audit => this._classifyPerformanceAudit(audit) === 'load-opportunity')
        .filter(audit => !Util.showAsPassed(audit.result))
        .sort((auditA, auditB) => this._getWastedMs(auditB) - this._getWastedMs(auditA));

    const filterableMetrics = metricAudits.filter(a => !!a.relevantAudits);
    // TODO: only add if there are opportunities & diagnostics rendered.
    if (filterableMetrics.length) {
      this.renderMetricAuditFilter(filterableMetrics, element);
    }

    if (opportunityAudits.length) {
      // Scale the sparklines relative to savings, minimum 2s to not overstate small savings
      const minimumScale = 2000;
      const wastedMsValues = opportunityAudits.map(audit => this._getWastedMs(audit));
      const maxWaste = Math.max(...wastedMsValues);
      const scale = Math.max(Math.ceil(maxWaste / 1000) * 1000, minimumScale);
      const [groupEl, footerEl] = this.renderAuditGroup(groups['load-opportunities']);
      const tmpl = this.dom.createComponent('opportunityHeader');

      this.dom.find('.lh-load-opportunity__col--one', tmpl).textContent =
        strings.opportunityResourceColumnLabel;
      this.dom.find('.lh-load-opportunity__col--two', tmpl).textContent =
        strings.opportunitySavingsColumnLabel;

      const headerEl = this.dom.find('.lh-load-opportunity__header', tmpl);
      groupEl.insertBefore(headerEl, footerEl);
      opportunityAudits.forEach(item =>
        groupEl.insertBefore(this._renderOpportunity(item, scale), footerEl));
      groupEl.classList.add('lh-audit-group--load-opportunities');
      element.appendChild(groupEl);
    }

    // Diagnostics
    const diagnosticAudits = category.auditRefs
        .filter(audit => this._classifyPerformanceAudit(audit) === 'diagnostic')
        .filter(audit => !Util.showAsPassed(audit.result))
        .sort((a, b) => {
          const scoreA = a.result.scoreDisplayMode === 'informative' ? 100 : Number(a.result.score);
          const scoreB = b.result.scoreDisplayMode === 'informative' ? 100 : Number(b.result.score);
          return scoreA - scoreB;
        });

    if (diagnosticAudits.length) {
      const [groupEl, footerEl] = this.renderAuditGroup(groups['diagnostics']);
      diagnosticAudits.forEach(item => groupEl.insertBefore(this.renderAudit(item), footerEl));
      groupEl.classList.add('lh-audit-group--diagnostics');
      element.appendChild(groupEl);
    }

    // Passed audits
    const passedAudits = category.auditRefs
        .filter(audit => this._classifyPerformanceAudit(audit) && Util.showAsPassed(audit.result));

    if (!passedAudits.length) return element;

    const clumpOpts = {
      auditRefs: passedAudits,
      groupDefinitions: groups,
    };
    const passedElem = this.renderClump('passed', clumpOpts);
    element.appendChild(passedElem);

    // Budgets
    /** @type {Array<Element>} */
    const budgetTableEls = [];
    ['performance-budget', 'timing-budget'].forEach((id) => {
      const audit = category.auditRefs.find(audit => audit.id === id);
      if (audit?.result.details) {
        const table = this.detailsRenderer.render(audit.result.details);
        if (table) {
          table.id = id;
          table.classList.add('lh-details', 'lh-details--budget', 'lh-audit');
          budgetTableEls.push(table);
        }
      }
    });
    if (budgetTableEls.length > 0) {
      const [groupEl, footerEl] = this.renderAuditGroup(groups.budgets);
      budgetTableEls.forEach(table => groupEl.insertBefore(table, footerEl));
      groupEl.classList.add('lh-audit-group--budgets');
      element.appendChild(groupEl);
    }

    return element;
  }

  /**
   * Render the control to filter the audits by metric. The filtering is done at runtime by CSS only
   * @param {LH.ReportResult.AuditRef[]} filterableMetrics
   * @param {HTMLDivElement} categoryEl
   */
  renderMetricAuditFilter(filterableMetrics, categoryEl) {
    const metricFilterEl = this.dom.createElement('div', 'lh-metricfilter');
    const textEl = this.dom.createChildOf(metricFilterEl, 'span', 'lh-metricfilter__text');
    textEl.textContent = Util.i18n.strings.showRelevantAudits;

    const filterChoices = /** @type {LH.ReportResult.AuditRef[]} */ ([
      ({acronym: 'All'}),
      ...filterableMetrics,
    ]);

    // Form labels need to reference unique IDs, but multiple reports rendered in the same DOM (eg PSI)
    // would mean ID conflict.  To address this, we 'scope' these radio inputs with a unique suffix.
    const uniqSuffix = Util.getUniqueSuffix();
    for (const metric of filterChoices) {
      const elemId = `metric-${metric.acronym}-${uniqSuffix}`;
      const radioEl = this.dom.createChildOf(metricFilterEl, 'input', 'lh-metricfilter__radio');
      radioEl.type = 'radio';
      radioEl.name = `metricsfilter-${uniqSuffix}`;
      radioEl.id = elemId;

      const labelEl = this.dom.createChildOf(metricFilterEl, 'label', 'lh-metricfilter__label');
      labelEl.htmlFor = elemId;
      labelEl.title = metric.result?.title;
      labelEl.textContent = metric.acronym || metric.id;

      if (metric.acronym === 'All') {
        radioEl.checked = true;
        labelEl.classList.add('lh-metricfilter__label--active');
      }
      categoryEl.append(metricFilterEl);

      // Toggle class/hidden state based on filter choice.
      radioEl.addEventListener('input', _ => {
        for (const elem of categoryEl.querySelectorAll('label.lh-metricfilter__label')) {
          elem.classList.toggle('lh-metricfilter__label--active', elem.htmlFor === elemId);
        }
        categoryEl.classList.toggle('lh-category--filtered', metric.acronym !== 'All');

        for (const perfAuditEl of categoryEl.querySelectorAll('div.lh-audit')) {
          if (metric.acronym === 'All') {
            perfAuditEl.hidden = false;
            continue;
          }

          perfAuditEl.hidden = true;
          if (metric.relevantAudits && metric.relevantAudits.includes(perfAuditEl.id)) {
            perfAuditEl.hidden = false;
          }
        }

        // Hide groups/clumps if all child audits are also hidden.
        const groupEls = categoryEl.querySelectorAll('div.lh-audit-group, details.lh-audit-group');
        for (const groupEl of groupEls) {
          groupEl.hidden = false;
          const childEls = Array.from(groupEl.querySelectorAll('div.lh-audit'));
          const areAllHidden = !!childEls.length && childEls.every(auditEl => auditEl.hidden);
          groupEl.hidden = areAllHidden;
        }
      });
    }
  }
}
