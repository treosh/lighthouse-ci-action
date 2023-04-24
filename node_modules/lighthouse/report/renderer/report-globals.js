/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {UIStrings} from './report-utils.js';

/** @typedef {import('./i18n-formatter').I18nFormatter} I18nFormatter */

let svgSuffix = 0;

class Globals {
  /** @type {I18nFormatter} */
  // @ts-expect-error: Set in report renderer.
  static i18n = null;

  /** @type {typeof UIStrings} */
  // @ts-expect-error: Set in report renderer.
  static strings = {};

  /** @type {LH.ReportResult | null} */
  static reportJson = null;

  /**
   * @param {{providedStrings: Record<string, string>; i18n: I18nFormatter; reportJson: LH.ReportResult | null}} options
   */
  static apply(options) {
    Globals.strings = {
      // Set missing renderer strings to default (english) values.
      ...UIStrings,
      ...options.providedStrings,
    };
    Globals.i18n = options.i18n;
    Globals.reportJson = options.reportJson;
  }

  static getUniqueSuffix() {
    return svgSuffix++;
  }

  static resetUniqueSuffix() {
    svgSuffix = 0;
  }
}

export {
  Globals,
};
