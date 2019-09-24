/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Audits a page to see how the size of DOM it creates. Stats like
 * tree depth, # children, and total elements are returned. The score is calculated
 * based solely on the total number of elements found on the page.
 */

'use strict';

const Audit = require('../audit.js');
const Util = require('../../report/html/renderer/util.js');
const i18n = require('../../lib/i18n/i18n.js');

const MAX_DOM_ELEMENTS = 1500;
const MAX_DOM_TREE_WIDTH = 60;
const MAX_DOM_TREE_DEPTH = 32;

const UIStrings = {
  /** Title of a diagnostic audit that provides detail on the size of the web page's DOM. The size of a DOM is characterized by the total number of DOM elements and greatest DOM depth. This descriptive title is shown to users when the amount is acceptable and no user action is required. */
  title: 'Avoids an excessive DOM size',
  /** Title of a diagnostic audit that provides detail on the size of the web page's DOM. The size of a DOM is characterized by the total number of DOM elements and greatest DOM depth. This imperative title is shown to users when there is a significant amount of execution time that could be reduced. */
  failureTitle: 'Avoid an excessive DOM size',
  /** Description of a Lighthouse audit that tells the user *why* they should reduce the size of the web page's DOM. The size of a DOM is characterized by the total number of DOM elements and greatest DOM depth. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Browser engineers recommend pages contain fewer than ' +
    `~${MAX_DOM_ELEMENTS.toLocaleString()} DOM elements. The sweet spot is a tree ` +
    `depth < ${MAX_DOM_TREE_DEPTH} elements and fewer than ${MAX_DOM_TREE_WIDTH} ` +
    'children/parent element. A large DOM can increase memory usage, cause longer ' +
    '[style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations), ' +
    'and produce costly [layout reflows](https://developers.google.com/speed/articles/reflow). [Learn more](https://web.dev/dom-size).',
  /** Table column header for the type of statistic. These statistics describe how big the DOM is (count of DOM elements, children, depth). */
  columnStatistic: 'Statistic',
  /** Table column header for the DOM element. Each DOM element is described with its HTML representation. */
  columnElement: 'Element',
  /** Table column header for the observed value of the DOM statistic. */
  columnValue: 'Value',
  /** [ICU Syntax] Label for an audit identifying the number of DOM elements found in the page. */
  displayValue: `{itemCount, plural,
    =1 {1 element}
    other {# elements}
    }`,
  /** Label for the total number of DOM elements found in the page. */
  statisticDOMElements: 'Total DOM Elements',
  /** Label for the numeric value of the maximum depth in the page's DOM tree. */
  statisticDOMDepth: 'Maximum DOM Depth',
  /** Label for the numeric value of the maximum number of children any DOM element in the page has. The element described will have the most children in the page. */
  statisticDOMWidth: 'Maximum Child Elements',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);


class DOMSize extends Audit {
  static get MAX_DOM_ELEMENTS() {
    return MAX_DOM_ELEMENTS;
  }

  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'dom-size',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      requiredArtifacts: ['DOMStats'],
    };
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      // 25th and 50th percentiles HTTPArchive -> 50 and 75
      // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
      // see https://www.desmos.com/calculator/vqot3wci4g
      scorePODR: 700,
      scoreMedian: 1400,
    };
  }


  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {LH.Audit.Product}
   */
  static audit(artifacts, context) {
    const stats = artifacts.DOMStats;

    const score = Audit.computeLogNormalScore(
      stats.totalBodyElements,
      context.options.scorePODR,
      context.options.scoreMedian
    );

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'statistic', itemType: 'text', text: str_(UIStrings.columnStatistic)},
      {key: 'element', itemType: 'code', text: str_(UIStrings.columnElement)},
      {key: 'value', itemType: 'numeric', text: str_(UIStrings.columnValue)},
    ];

    /** @type {LH.Audit.Details.Table['items']} */
    const items = [
      {
        statistic: str_(UIStrings.statisticDOMElements),
        element: '',
        value: Util.formatNumber(stats.totalBodyElements),
      },
      {
        statistic: str_(UIStrings.statisticDOMDepth),
        element: {
          type: 'code',
          value: stats.depth.snippet,
        },
        value: Util.formatNumber(stats.depth.max),
      },
      {
        statistic: str_(UIStrings.statisticDOMWidth),
        element: {
          type: 'code',
          value: stats.width.snippet,
        },
        value: Util.formatNumber(stats.width.max),
      },
    ];

    return {
      score,
      numericValue: stats.totalBodyElements,
      displayValue: str_(UIStrings.displayValue, {itemCount: stats.totalBodyElements}),
      extendedInfo: {
        value: items,
      },
      details: Audit.makeTableDetails(headings, items),
    };
  }
}

module.exports = DOMSize;
module.exports.UIStrings = UIStrings;
