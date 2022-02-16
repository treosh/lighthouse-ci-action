/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {createContext, FunctionComponent} from 'preact';
import {useContext, useMemo} from 'preact/hooks';

import {formatMessage} from '../../../shared/localization/format';
import {I18n} from '../../../report/renderer/i18n';
import {UIStrings} from './ui-strings';
import {useFlowResult} from '../util';
import strings from './localized-strings';
import {Util} from '../../../report/renderer/util';

const I18nContext = createContext(new I18n('en-US', {...Util.UIStrings, ...UIStrings}));

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
    const i18n = new I18n(locale, {
      // Set any missing lhr strings to default (english) values.
      ...Util.UIStrings,
      // Preload with strings from the first lhr.
      // Used for legacy report components imported into the flow report.
      ...lhrStrings,
      // Set any missing flow strings to default (english) values.
      ...UIStrings,
      // `strings` is generated in build/build-report.js
      ...strings[locale],
    });

    // Initialize renderer util i18n for strings rendered in wrapped components.
    // TODO: Don't attach global i18n to `Util`.
    Util.i18n = i18n;

    return i18n;
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
