/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Identifies polyfills and transforms that should not be present if using module/nomodule pattern.
 * @see https://docs.google.com/document/d/1ItjJwAd6e0Ts6yMbvh8TN3BBh_sAd58rYE1whnpuxaA/edit Design document
 * @see https://docs.google.com/spreadsheets/d/1z28Au8wo8-c2UsM2lDVEOJcI3jOkb2c951xEBqzBKCc/edit?usp=sharing Legacy babel transforms / polyfills
 * ./lighthouse-core/scripts/legacy-javascript - verification tool.
 */

/** @typedef {{name: string, expression: string}} Pattern */
/** @typedef {{name: string, line: number, column: number}} PatternMatchResult */

const Audit = require('./audit.js');
const NetworkRecords = require('../computed/network-records.js');
const MainResource = require('../computed/main-resource.js');
const JSBundles = require('../computed/js-bundles.js');
const URL = require('../lib/url-shim.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a Lighthouse audit that tells the user about legacy polyfills and transforms used on the page. This is displayed in a list of audit titles that Lighthouse generates. */
  title: 'Legacy JavaScript',
  // eslint-disable-next-line max-len
  // TODO: web.dev article. this codelab is good starting place: https://web.dev/codelab-serve-modern-code/
  /** Description of a Lighthouse audit that tells the user about old JavaScript that is no longer needed. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Polyfills and transforms enable legacy browsers to use new JavaScript features. However, many aren\'t necessary for modern browsers. For your bundled JavaScript, adopt a modern script deployment strategy using module/nomodule feature detection to reduce the amount of code shipped to modern browsers, while retaining support for legacy browsers. [Learn More](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * Takes a list of patterns (consisting of a name identifier and a RegExp expression string)
 * and returns match results with line / column information for a given code input.
 */
class CodePatternMatcher {
  /**
   * @param {Pattern[]} patterns
   */
  constructor(patterns) {
    const patternsExpression = patterns.map(pattern => `(${pattern.expression})`).join('|');
    this.re = new RegExp(`(^\r\n|\r|\n)|${patternsExpression}`, 'g');
    this.patterns = patterns;
  }

  /**
   * @param {string} code
   * @return {PatternMatchResult[]}
   */
  match(code) {
    // Reset RegExp state.
    this.re.lastIndex = 0;

    const seen = new Set();
    /** @type {PatternMatchResult[]} */
    const matches = [];
    /** @type {RegExpExecArray | null} */
    let result;
    let line = 0;
    let lineBeginsAtIndex = 0;
    // Each pattern maps to one subgroup in the generated regex. For each iteration of RegExp.exec,
    // only one subgroup will be defined. Exec until no more matches.
    while ((result = this.re.exec(code)) !== null) {
      // Discard first value in `result` - it's just the entire match.
      const captureGroups = result.slice(1);
      // isNewline - truthy if matching a newline, used to track the line number.
      // `patternExpressionMatches` maps to each possible pattern in `this.patterns`.
      // Only one of [isNewline, ...patternExpressionMatches] is ever truthy.
      const [isNewline, ...patternExpressionMatches] = captureGroups;
      if (isNewline) {
        line++;
        lineBeginsAtIndex = result.index + 1;
        continue;
      }
      const pattern = this.patterns[patternExpressionMatches.findIndex(Boolean)];

      // Don't report more than one instance of a pattern for this code.
      // Would result in multiple matches for the same pattern, ex: if both '='
      // and 'Object.defineProperty' are used conditionally based on feature detection.
      // Would also result in many matches for transform patterns.
      if (seen.has(pattern)) {
        continue;
      }
      seen.add(pattern);

      matches.push({
        name: pattern.name,
        line,
        column: result.index - lineBeginsAtIndex,
      });
    }

    return matches;
  }
}

class LegacyJavascript extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'legacy-javascript',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      description: str_(UIStrings.description),
      title: str_(UIStrings.title),
      requiredArtifacts: ['devtoolsLogs', 'ScriptElements', 'SourceMaps', 'URL'],
    };
  }

  /**
   * @param {string?} object
   * @param {string} property
   */
  static buildPolyfillExpression(object, property) {
    const qt = (/** @type {string} */ token) =>
      `['"]${token}['"]`; // don't worry about matching string delims

    let expression = '';

    if (object) {
      // String.prototype.startsWith =
      expression += `${object}\\.${property}\\s?=[^=]`;
    } else {
      // Promise =
      // window.Promise =// Promise =Z
      // but not: SomePromise =
      expression += `(?:window\\.|[\\s;]+)${property}\\s?=[^=]`;
    }

    // String.prototype['startsWith'] =
    if (object) {
      expression += `|${object}\\[${qt(property)}\\]\\s?=[^=]`;
    }

    // Object.defineProperty(String.prototype, 'startsWith'
    expression += `|defineProperty\\(${object || 'window'},\\s?${qt(property)}`;

    // core-js
    if (object) {
      const objectWithoutPrototype = object.replace('.prototype', '');
      // e(e.S,"Object",{values
      // Minified + mangled pattern found in CDN babel-polyfill.
      // see https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.min.js
      // TODO: perhaps this is the wrong place to check for a CDN polyfill. Remove?
      // expression += `|;e\\([^,]+,${qt(objectWithoutPrototype)},{${property}:`;

      // Minified pattern.
      // $export($export.S,"Date",{now:function
      expression += `|\\$export\\([^,]+,${qt(objectWithoutPrototype)},{${property}:`;
    } else {
      // WeakSet, etc.
      expression += `|function ${property}\\(`;
    }

    return expression;
  }

  static getPolyfillData() {
    return [
      /* eslint-disable max-len */
      {module: 'es6.array.fill', name: 'Array.prototype.fill'},
      {module: 'es6.array.filter', name: 'Array.prototype.filter'},
      {module: 'es6.array.find', name: 'Array.prototype.find'},
      {module: 'es6.array.find-index', name: 'Array.prototype.findIndex'},
      {module: 'es6.array.for-each', name: 'Array.prototype.forEach'},
      {module: 'es6.array.from', name: 'Array.from'},
      {module: 'es6.array.is-array', name: 'Array.isArray'},
      {module: 'es6.array.last-index-of', name: 'Array.prototype.lastIndexOf'},
      {module: 'es6.array.map', name: 'Array.prototype.map'},
      {module: 'es6.array.of', name: 'Array.of'},
      {module: 'es6.array.reduce', name: 'Array.prototype.reduce'},
      {module: 'es6.array.reduce-right', name: 'Array.prototype.reduceRight'},
      {module: 'es6.array.some', name: 'Array.prototype.some'},
      {module: 'es6.date.now', name: 'Date.now'},
      {module: 'es6.date.to-iso-string', name: 'Date.prototype.toISOString'},
      {module: 'es6.date.to-json', name: 'Date.prototype.toJSON'},
      {module: 'es6.date.to-string', name: 'Date.prototype.toString'},
      {module: 'es6.function.name', name: 'Function.prototype.name'},
      {module: 'es6.map', name: 'Map'},
      {module: 'es6.number.is-integer', name: 'Number.isInteger'},
      {module: 'es6.number.is-safe-integer', name: 'Number.isSafeInteger'},
      {module: 'es6.number.parse-float', name: 'Number.parseFloat'},
      {module: 'es6.number.parse-int', name: 'Number.parseInt'},
      {module: 'es6.object.assign', name: 'Object.assign'},
      {module: 'es6.object.create', name: 'Object.create'},
      {module: 'es6.object.define-properties', name: 'Object.defineProperties'},
      {module: 'es6.object.define-property', name: 'Object.defineProperty'},
      {module: 'es6.object.freeze', name: 'Object.freeze'},
      {module: 'es6.object.get-own-property-descriptor', name: 'Object.getOwnPropertyDescriptor'},
      {module: 'es6.object.get-own-property-names', name: 'Object.getOwnPropertyNames'},
      {module: 'es6.object.get-prototype-of', name: 'Object.getPrototypeOf'},
      {module: 'es6.object.is-extensible', name: 'Object.isExtensible'},
      {module: 'es6.object.is-frozen', name: 'Object.isFrozen'},
      {module: 'es6.object.is-sealed', name: 'Object.isSealed'},
      {module: 'es6.object.keys', name: 'Object.keys'},
      {module: 'es6.object.prevent-extensions', name: 'Object.preventExtensions'},
      {module: 'es6.object.seal', name: 'Object.seal'},
      {module: 'es6.object.set-prototype-of', name: 'Object.setPrototypeOf'},
      {module: 'es6.promise', name: 'Promise'},
      {module: 'es6.reflect.apply', name: 'Reflect.apply'},
      {module: 'es6.reflect.construct', name: 'Reflect.construct'},
      {module: 'es6.reflect.define-property', name: 'Reflect.defineProperty'},
      {module: 'es6.reflect.delete-property', name: 'Reflect.deleteProperty'},
      {module: 'es6.reflect.get', name: 'Reflect.get'},
      {module: 'es6.reflect.get-own-property-descriptor', name: 'Reflect.getOwnPropertyDescriptor'},
      {module: 'es6.reflect.get-prototype-of', name: 'Reflect.getPrototypeOf'},
      {module: 'es6.reflect.has', name: 'Reflect.has'},
      {module: 'es6.reflect.is-extensible', name: 'Reflect.isExtensible'},
      {module: 'es6.reflect.own-keys', name: 'Reflect.ownKeys'},
      {module: 'es6.reflect.prevent-extensions', name: 'Reflect.preventExtensions'},
      {module: 'es6.reflect.set', name: 'Reflect.set'},
      {module: 'es6.reflect.set-prototype-of', name: 'Reflect.setPrototypeOf'},
      {module: 'es6.set', name: 'Set'},
      {module: 'es6.string.code-point-at', name: 'String.prototype.codePointAt'},
      {module: 'es6.string.ends-with', name: 'String.prototype.endsWith'},
      {module: 'es6.string.from-code-point', name: 'String.fromCodePoint'},
      {module: 'es6.string.includes', name: 'String.prototype.includes'},
      {module: 'es6.string.raw', name: 'String.raw'},
      {module: 'es6.string.repeat', name: 'String.prototype.repeat'},
      {module: 'es6.string.starts-with', name: 'String.prototype.startsWith'},
      {module: 'es6.string.trim', name: 'String.prototype.trim'},
      {module: 'es6.typed.array-buffer', name: 'ArrayBuffer'},
      {module: 'es6.typed.data-view', name: 'DataView'},
      {module: 'es6.typed.float32-array', name: 'Float32Array'},
      {module: 'es6.typed.float64-array', name: 'Float64Array'},
      {module: 'es6.typed.int16-array', name: 'Int16Array'},
      {module: 'es6.typed.int32-array', name: 'Int32Array'},
      {module: 'es6.typed.int8-array', name: 'Int8Array'},
      {module: 'es6.typed.uint16-array', name: 'Uint16Array'},
      {module: 'es6.typed.uint32-array', name: 'Uint32Array'},
      {module: 'es6.typed.uint8-array', name: 'Uint8Array'},
      {module: 'es6.typed.uint8-clamped-array', name: 'Uint8ClampedArray'},
      {module: 'es6.weak-map', name: 'WeakMap'},
      {module: 'es6.weak-set', name: 'WeakSet'},
      {module: 'es7.array.includes', name: 'Array.prototype.includes'},
      {module: 'es7.object.entries', name: 'Object.entries'},
      {module: 'es7.object.get-own-property-descriptors', name: 'Object.getOwnPropertyDescriptors'},
      {module: 'es7.object.values', name: 'Object.values'},
      {module: 'es7.string.pad-end', name: 'String.prototype.padEnd'},
      {module: 'es7.string.pad-start', name: 'String.prototype.padStart'},
      /* eslint-enable max-len */
    ];
  }

  /**
   * @return {Pattern[]}
   */
  static getPolyfillPatterns() {
    return this.getPolyfillData().map(({name}) => {
      const parts = name.split('.');
      const object = parts.length > 1 ? parts.slice(0, parts.length - 1).join('.') : null;
      const property = parts[parts.length - 1];
      return {
        name,
        expression: this.buildPolyfillExpression(object, property),
      };
    });
  }

  /**
   * @return {Pattern[]}
   */
  static getTransformPatterns() {
    return [
      {
        name: '@babel/plugin-transform-classes',
        expression: 'Cannot call a class as a function',
      },
      {
        name: '@babel/plugin-transform-regenerator',
        expression: /regeneratorRuntime\.a?wrap/.source,
      },
      {
        name: '@babel/plugin-transform-spread',
        expression: /\.apply\(void 0,\s?_toConsumableArray/.source,
      },
    ];
  }

  /**
   * Returns a collection of match results grouped by script url.
   *
   * @param {CodePatternMatcher} matcher
   * @param {LH.GathererArtifacts['ScriptElements']} scripts
   * @param {LH.Artifacts.NetworkRequest[]} networkRecords
   * @param {LH.Artifacts.Bundle[]} bundles
   * @return {Map<string, PatternMatchResult[]>}
   */
  static detectAcrossScripts(matcher, scripts, networkRecords, bundles) {
    /** @type {Map<string, PatternMatchResult[]>} */
    const urlToMatchResults = new Map();
    const polyfillData = this.getPolyfillData();

    for (const {requestId, content} of Object.values(scripts)) {
      if (!content) continue;
      const networkRecord = networkRecords.find(record => record.requestId === requestId);
      if (!networkRecord) continue;

      // Start with pattern matching against the downloaded script.
      const matches = matcher.match(content);

      // If it's a bundle with source maps, add in the polyfill modules by name too.
      const bundle = bundles.find(b => b.script.src === networkRecord.url);
      if (bundle) {
        for (const {module, name} of polyfillData) {
          // Skip if the pattern matching found a match for this polyfill.
          if (matches.some(m => m.name === name)) continue;

          const source = bundle.rawMap.sources.find(source => source.endsWith(`${module}.js`));
          if (!source) continue;

          const mapping = bundle.map.mappings().find(m => m.sourceURL === source);
          if (mapping) {
            matches.push({name, line: mapping.lineNumber, column: mapping.columnNumber});
          } else {
            matches.push({name, line: 0, column: 0});
          }
        }
      }

      if (!matches.length) continue;
      urlToMatchResults.set(networkRecord.url, matches);
    }

    return urlToMatchResults;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[LegacyJavascript.DEFAULT_PASS];
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    const mainResource = await MainResource.request({
      URL: artifacts.URL,
      devtoolsLog,
    }, context);
    const bundles = await JSBundles.request(artifacts, context);

    /** @type {Array<{url: string, signals: string[], locations: LH.Audit.Details.SourceLocationValue[]}>} */
    const tableRows = [];
    let signalCount = 0;

    // TODO(cjamcl): Use SourceMaps, and only pattern match if maps are not available.
    const matcher = new CodePatternMatcher([
      ...this.getPolyfillPatterns(),
      ...this.getTransformPatterns(),
    ]);

    const urlToMatchResults =
      this.detectAcrossScripts(matcher, artifacts.ScriptElements, networkRecords, bundles);
    urlToMatchResults.forEach((matches, url) => {
      /** @type {typeof tableRows[number]} */
      const row = {url, signals: [], locations: []};
      for (const match of matches) {
        const {name, line, column} = match;
        row.signals.push(name);
        row.locations.push({
          type: 'source-location',
          url,
          line,
          column,
          urlProvider: 'network',
        });
      }
      tableRows.push(row);
      signalCount += row.signals.length;
    });

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      /* eslint-disable max-len */
      {key: 'url', itemType: 'url', subRows: {key: 'locations', itemType: 'source-location'}, text: str_(i18n.UIStrings.columnURL)},
      {key: null, itemType: 'code', subRows: {key: 'signals'}, text: ''},
      /* eslint-enable max-len */
    ];
    const details = Audit.makeTableDetails(headings, tableRows);

    // Only fail if first party code has legacy code.
    // TODO(cjamcl): Use third-party-web.
    const foundSignalInFirstPartyCode = tableRows.some(row => {
      return URL.rootDomainsMatch(row.url, mainResource.url);
    });
    return {
      score: foundSignalInFirstPartyCode ? 0 : 1,
      notApplicable: !foundSignalInFirstPartyCode,
      extendedInfo: {
        signalCount,
      },
      details,
    };
  }
}

module.exports = LegacyJavascript;
module.exports.UIStrings = UIStrings;
