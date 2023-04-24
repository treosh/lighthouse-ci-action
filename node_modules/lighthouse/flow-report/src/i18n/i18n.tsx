/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {createContext, FunctionComponent} from 'preact';
import {useContext, useMemo} from 'preact/hooks';

import {formatMessage} from '../../../shared/localization/format';
import {I18nFormatter} from '../../../report/renderer/i18n-formatter';
import {UIStrings} from './ui-strings';
import {useFlowResult} from '../util';
import strings from './localized-strings.js';
import {UIStrings as ReportUIStrings} from '../../../report/renderer/report-utils.js';
import {Globals} from '../../../report/renderer/report-globals.js';

const I18nContext = createContext({
  formatter: new I18nFormatter('en-US'),
  strings: {...ReportUIStrings, ...UIStrings},
});

function useLhrLocale() {
  const flowResult = useFlowResult();
  const firstLhr = flowResult.steps[0].lhr;
  const locale = firstLhr.configSettings.locale;

  if (flowResult.steps.some(step => step.lhr.configSettings.locale !== locale)) {
    console.warn('LHRs have inconsistent locales');
  }

  return {
    locale,
    lhrStrings: firstLhr.i18n.rendererFormattedStrings,
  };
}

function useI18n() {
  return useContext(I18nContext);
}

function useLocalizedStrings() {
  const i18n = useI18n();
  return i18n.strings;
}

function useStringFormatter() {
  const {locale} = useLhrLocale();
  return (str: string, values?: Record<string, string|number>) => {
    return formatMessage(str, values, locale);
  };
}

const I18nProvider: FunctionComponent = ({children}) => {
  const {locale, lhrStrings} = useLhrLocale();

  const i18n = useMemo(() => {
    Globals.apply({
      providedStrings: {
        // Preload with strings from the first lhr.
        // Used for legacy report components imported into the flow report.
        ...lhrStrings,
        // Set any missing flow strings to default (english) values.
        ...UIStrings,
        // `strings` is generated in build/build-report.js
        ...strings[locale],
      },
      i18n: new I18nFormatter(locale),
      reportJson: null,
    });

    return {
      formatter: Globals.i18n,
      strings: Globals.strings as typeof UIStrings & typeof ReportUIStrings,
    };
  }, [locale, lhrStrings]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
};

export {
  useI18n,
  useLocalizedStrings,
  useStringFormatter,
  I18nProvider,
};
