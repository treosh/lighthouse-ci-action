/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const _set = require('lodash.set');
const _get = require('lodash.get');

const i18n = require('./i18n.js');

/**
 * @fileoverview Use the lhr.i18n.icuMessagePaths object to change locales.
 *
 * `icuMessagePaths` is an object keyed by `LH.IcuMessage['i18nId']`s. Within each is either
 * 1) an array of strings, which are just object paths to where that message is used in the LHR
 * 2) an array of `LH.IcuMessagePath`s which include both a `path` and a `values` object
 *    which will be used in the replacement within `i18n.getFormatted()`
 *
 * An example:
    "icuMessagePaths": {
    "lighthouse-core/audits/metrics/first-contentful-paint.js | title": [
      "audits[first-contentful-paint].title"
    ],
    "lighthouse-core/audits/server-response-time.js | displayValue": [
      {
        "values": {
          "timeInMs": 570.5630000000001
        },
        "path": "audits[server-response-time].displayValue"
      }
    ],
    "lighthouse-core/lib/i18n/i18n.js | columnTimeSpent": [
      "audits[mainthread-work-breakdown].details.headings[1].text",
      "audits[network-rtt].details.headings[1].text",
      "audits[network-server-latency].details.headings[1].text"
    ],
    ...
 */

/**
 * Returns a new LHR with all strings changed to the new `requestedLocale`.
 * @param {LH.Result} lhr
 * @param {LH.Locale} requestedLocale
 * @return {{lhr: LH.Result, missingIcuMessageIds: string[]}}
 */
function swapLocale(lhr, requestedLocale) {
  // Copy LHR to avoid mutating provided LHR.
  lhr = JSON.parse(JSON.stringify(lhr));

  const locale = i18n.lookupLocale(requestedLocale);
  const originalLocale = lhr.configSettings.locale;
  const {icuMessagePaths} = lhr.i18n;
  const missingIcuMessageIds = [];

  if (!icuMessagePaths) throw new Error('missing icuMessagePaths');

  for (const [i18nId, icuMessagePath] of Object.entries(icuMessagePaths)) {
    for (const instance of icuMessagePath) {
      // The path that _formatPathAsString() generated.
      let path;
      let values;
      if (typeof instance === 'string') {
        path = instance;
      } else {
        path = instance.path;
        // `values` are the string template values to be used. eg. `values: {wastedBytes: 9028}`
        values = instance.values;
      }

      // If the path isn't valid or the value isn't a string, there's no point in trying to replace it.
      /** @type {unknown} */
      const originalString = _get(lhr, path);
      if (typeof originalString !== 'string') {
        continue;
      }

      const icuMessage = {
        i18nId,
        values,
        // The default value is the string already in place.
        formattedDefault: originalString,
      };
      // Get new formatted strings in revised locale.
      const relocalizedString = i18n.getFormatted(icuMessage, locale);

      // If we couldn't find a new replacement message, keep things as is.
      if (relocalizedString === originalString) {
        if (locale !== originalLocale) {
          // If the string remained the same while the locale changed, there may have been an issue.
          missingIcuMessageIds.push(i18nId);
        }
        continue;
      }

      // Write string back into the LHR.
      _set(lhr, path, relocalizedString);
    }
  }

  lhr.i18n.rendererFormattedStrings = i18n.getRendererFormattedStrings(locale);
  // Tweak the config locale
  lhr.configSettings.locale = locale;
  return {
    lhr,
    missingIcuMessageIds,
  };
}

module.exports = swapLocale;
