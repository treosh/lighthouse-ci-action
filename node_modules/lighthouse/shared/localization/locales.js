/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * Define message file to be used for a given locale. A few aliases are defined below.
 *
 * Google locale inheritance rules: https://goto.google.com/ccssm
 * CLDR language aliases: https://www.unicode.org/cldr/charts/latest/supplemental/aliases.html
 * CLDR locale inheritance: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/parentLocales.json
 *
 * For Lighthouse bundles that shouldn't include locale data, the recommended pattern
 * is to replace the default export of this file with `{}` so that no locale messages
 * are included. Strings will work normally through the IcuMessage.formattedDefault
 * fallback, and locale messages can be added on demand (e.g. dynamically fetched)
 * through `format.registerLocaleData()`.
 */

// TODO(paulirish): Centralize locale inheritance (combining this & i18n.lookupLocale()), adopt cldr parentLocale rules.

/** @typedef {import('../../types/lhr/settings').Locale} Locale */
/** @typedef {Record<string, {message: string}>} LhlMessages */

const fs = require('fs');

/** @type {Record<string, LhlMessages>} */
const files = {
  'ar': JSON.parse(fs.readFileSync(`${__dirname}/locales/ar.json`, 'utf8')),
  'ar-XB': JSON.parse(fs.readFileSync(`${__dirname}/locales/ar-XB.json`, 'utf8')),
  'bg': JSON.parse(fs.readFileSync(`${__dirname}/locales/bg.json`, 'utf8')),
  'ca': JSON.parse(fs.readFileSync(`${__dirname}/locales/ca.json`, 'utf8')),
  'cs': JSON.parse(fs.readFileSync(`${__dirname}/locales/cs.json`, 'utf8')),
  'da': JSON.parse(fs.readFileSync(`${__dirname}/locales/da.json`, 'utf8')),
  'de': JSON.parse(fs.readFileSync(`${__dirname}/locales/de.json`, 'utf8')),
  'el': JSON.parse(fs.readFileSync(`${__dirname}/locales/el.json`, 'utf8')),
  'en-GB': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-GB.json`, 'utf8')),
  'en-US': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-US.json`, 'utf8')),
  'en-XA': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-XA.json`, 'utf8')),
  'en-XL': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-XL.json`, 'utf8')),
  'es': JSON.parse(fs.readFileSync(`${__dirname}/locales/es.json`, 'utf8')),
  'es-419': JSON.parse(fs.readFileSync(`${__dirname}/locales/es-419.json`, 'utf8')),
  'fi': JSON.parse(fs.readFileSync(`${__dirname}/locales/fi.json`, 'utf8')),
  'fil': JSON.parse(fs.readFileSync(`${__dirname}/locales/fil.json`, 'utf8')),
  'fr': JSON.parse(fs.readFileSync(`${__dirname}/locales/fr.json`, 'utf8')),
  'he': JSON.parse(fs.readFileSync(`${__dirname}/locales/he.json`, 'utf8')),
  'hi': JSON.parse(fs.readFileSync(`${__dirname}/locales/hi.json`, 'utf8')),
  'hr': JSON.parse(fs.readFileSync(`${__dirname}/locales/hr.json`, 'utf8')),
  'hu': JSON.parse(fs.readFileSync(`${__dirname}/locales/hu.json`, 'utf8')),
  'id': JSON.parse(fs.readFileSync(`${__dirname}/locales/id.json`, 'utf8')),
  'it': JSON.parse(fs.readFileSync(`${__dirname}/locales/it.json`, 'utf8')),
  'ja': JSON.parse(fs.readFileSync(`${__dirname}/locales/ja.json`, 'utf8')),
  'ko': JSON.parse(fs.readFileSync(`${__dirname}/locales/ko.json`, 'utf8')),
  'lt': JSON.parse(fs.readFileSync(`${__dirname}/locales/lt.json`, 'utf8')),
  'lv': JSON.parse(fs.readFileSync(`${__dirname}/locales/lv.json`, 'utf8')),
  'nl': JSON.parse(fs.readFileSync(`${__dirname}/locales/nl.json`, 'utf8')),
  'no': JSON.parse(fs.readFileSync(`${__dirname}/locales/no.json`, 'utf8')),
  'pl': JSON.parse(fs.readFileSync(`${__dirname}/locales/pl.json`, 'utf8')),
  'pt': JSON.parse(fs.readFileSync(`${__dirname}/locales/pt.json`, 'utf8')),
  'pt-PT': JSON.parse(fs.readFileSync(`${__dirname}/locales/pt-PT.json`, 'utf8')),
  'ro': JSON.parse(fs.readFileSync(`${__dirname}/locales/ro.json`, 'utf8')),
  'ru': JSON.parse(fs.readFileSync(`${__dirname}/locales/ru.json`, 'utf8')),
  'sk': JSON.parse(fs.readFileSync(`${__dirname}/locales/sk.json`, 'utf8')),
  'sl': JSON.parse(fs.readFileSync(`${__dirname}/locales/sl.json`, 'utf8')),
  'sr': JSON.parse(fs.readFileSync(`${__dirname}/locales/sr.json`, 'utf8')),
  'sr-Latn': JSON.parse(fs.readFileSync(`${__dirname}/locales/sr-Latn.json`, 'utf8')),
  'sv': JSON.parse(fs.readFileSync(`${__dirname}/locales/sv.json`, 'utf8')),
  'ta': JSON.parse(fs.readFileSync(`${__dirname}/locales/ta.json`, 'utf8')),
  'te': JSON.parse(fs.readFileSync(`${__dirname}/locales/te.json`, 'utf8')),
  'th': JSON.parse(fs.readFileSync(`${__dirname}/locales/th.json`, 'utf8')),
  'tr': JSON.parse(fs.readFileSync(`${__dirname}/locales/tr.json`, 'utf8')),
  'uk': JSON.parse(fs.readFileSync(`${__dirname}/locales/uk.json`, 'utf8')),
  'vi': JSON.parse(fs.readFileSync(`${__dirname}/locales/vi.json`, 'utf8')),
  'zh': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh.json`, 'utf8')),
  'zh-HK': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh-HK.json`, 'utf8')),
  'zh-TW': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh-TW.json`, 'utf8')),
};

// The keys within this const must exactly match the LH.Locale type in externs.d.ts
/** @type {Record<Locale, LhlMessages>} */
const locales = {
  'en-US': files['en-US'], // The 'source' strings, with descriptions
  'en': files['en-US'], // According to CLDR/ICU, 'en' == 'en-US' dates/numbers (Why?!)

  // TODO: en-GB has just ~10 messages that are different from en-US. We should only ship those.
  'en-AU': files['en-GB'], // Alias of 'en-GB'
  'en-GB': files['en-GB'], // Alias of 'en-GB'
  'en-IE': files['en-GB'], // Alias of 'en-GB'
  'en-SG': files['en-GB'], // Alias of 'en-GB'
  'en-ZA': files['en-GB'], // Alias of 'en-GB'
  'en-IN': files['en-GB'], // Alias of 'en-GB'

  // All locales from here have a messages file, though we allow fallback to the base locale when the files are identical
  'ar-XB': files['ar-XB'], // psuedolocalization
  'ar': files['ar'],
  'bg': files['bg'],
  'ca': files['ca'],
  'cs': files['cs'],
  'da': files['da'],
  'de': files['de'], // de-AT, de-CH identical, so they fall back into de
  'el': files['el'],
  'en-XA': files['en-XA'], // psuedolocalization
  'en-XL': files['en-XL'], // local psuedolocalization
  'es': files['es'],
  'es-419': files['es-419'],
  // Aliases of es-419: https://raw.githubusercontent.com/unicode-cldr/cldr-core/master/supplemental/parentLocales.json
  'es-AR': files['es-419'],
  'es-BO': files['es-419'],
  'es-BR': files['es-419'],
  'es-BZ': files['es-419'],
  'es-CL': files['es-419'],
  'es-CO': files['es-419'],
  'es-CR': files['es-419'],
  'es-CU': files['es-419'],
  'es-DO': files['es-419'],
  'es-EC': files['es-419'],
  'es-GT': files['es-419'],
  'es-HN': files['es-419'],
  'es-MX': files['es-419'],
  'es-NI': files['es-419'],
  'es-PA': files['es-419'],
  'es-PE': files['es-419'],
  'es-PR': files['es-419'],
  'es-PY': files['es-419'],
  'es-SV': files['es-419'],
  'es-US': files['es-419'],
  'es-UY': files['es-419'],
  'es-VE': files['es-419'],

  'fi': files['fi'],
  'fil': files['fil'],
  'fr': files['fr'], // fr-CH identical, so it falls back into fr
  'he': files['he'],
  'hi': files['hi'],
  'hr': files['hr'],
  'hu': files['hu'],
  'gsw': files['de'], // swiss german. identical (for our purposes) to 'de'
  'id': files['id'],
  'in': files['id'], // Alias of 'id'
  'it': files['it'],
  'iw': files['he'], // Alias of 'he'
  'ja': files['ja'],
  'ko': files['ko'],
  'lt': files['lt'],
  'lv': files['lv'],
  'mo': files['ro'], // Alias of 'ro'
  'nl': files['nl'],
  'nb': files['no'], // Alias of 'no'
  'no': files['no'],
  'pl': files['pl'],
  'pt': files['pt'], // pt-BR identical, so it falls back into pt
  'pt-PT': files['pt-PT'],
  'ro': files['ro'],
  'ru': files['ru'],
  'sk': files['sk'],
  'sl': files['sl'],
  'sr': files['sr'],
  'sr-Latn': files['sr-Latn'],
  'sv': files['sv'],
  'ta': files['ta'],
  'te': files['te'],
  'th': files['th'],
  'tl': files['fil'], // Alias of 'fil'
  'tr': files['tr'],
  'uk': files['uk'],
  'vi': files['vi'],
  'zh': files['zh'], // aka ZH-Hans, sometimes seen as zh-CN, zh-Hans-CN, Simplified Chinese
  'zh-HK': files['zh-HK'], // aka zh-Hant-HK. Note: yue-Hant-HK is not supported.
  'zh-TW': files['zh-TW'], // aka zh-Hant, zh-Hant-TW, Traditional Chinese
};

module.exports = locales;
