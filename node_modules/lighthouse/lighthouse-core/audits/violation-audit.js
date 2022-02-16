/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const JsBundles = require('../computed/js-bundles.js');

class ViolationAudit extends Audit {
  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @param {RegExp} pattern
   * @return {Promise<Array<{source: LH.Audit.Details.SourceLocationValue}>>}
   */
  static async getViolationResults(artifacts, context, pattern) {
    const bundles = await JsBundles.request(artifacts, context);

    /**
     * @template T
     * @param {T} value
     * @return {value is Exclude<T, undefined>}
     */
    function filterUndefined(value) {
      return value !== undefined;
    }

    const seen = new Set();
    return artifacts.ConsoleMessages
        .filter(entry => entry.url && entry.source === 'violation' && pattern.test(entry.text))
        .map(entry => {
          const bundle = bundles.find(bundle => bundle.script.src === entry.url);
          return Audit.makeSourceLocationFromConsoleMessage(entry, bundle);
        })
        .filter(filterUndefined)
        .filter(source => {
          // Filter out duplicate entries since they are not differentiable to the user
          // @see https://github.com/GoogleChrome/lighthouse/issues/5218
          const key = `${source.url}!${source.line}!${source.column}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map(source => ({source}));
  }
}

module.exports = ViolationAudit;
