/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import _Crdp from 'devtools-protocol/types/protocol';
import _CrdpMappings from 'devtools-protocol/types/protocol-mapping'

declare global {
  // Augment Intl to include
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales
  namespace Intl {
    var getCanonicalLocales: (locales?: string | Array<string>) => Array<string>;
  }

  /** Make properties K in T optional. */
  type MakeOptional<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P]
  } & {
    [P in K]+?: T[P]
  }

  /** An object with the keys in the union K mapped to themselves as values. */
  type SelfMap<K extends string> = {
    [P in K]: P;
  };

  /** Make optional all properties on T and any properties on object properties of T. */
  type RecursivePartial<T> = {
    [P in keyof T]+?: T[P] extends object ?
      RecursivePartial<T[P]> :
      T[P];
  };

  /**
   * Exclude void from T
   */
  type NonVoid<T> = T extends void ? never : T;

  /** Remove properties K from T. */
  type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  /** Obtain the type of the first parameter of a function. */
  type FirstParamType<T extends (arg1: any, ...args: any[]) => any> =
    T extends (arg1: infer P, ...args: any[]) => any ? P : never;

  module LH {
    // re-export useful type modules under global LH module.
    export import Crdp = _Crdp;
    export import CrdpEvents = _CrdpMappings.Events;
    export import CrdpCommands = _CrdpMappings.Commands;

    /** Simulation settings that control the amount of network & cpu throttling in the run. */
    interface ThrottlingSettings {
      /** The round trip time in milliseconds. */
      rttMs?: number;
      /** The network throughput in kilobits per second. */
      throughputKbps?: number;
      // devtools settings
      /** The network request latency in milliseconds. */
      requestLatencyMs?: number;
      /** The network download throughput in kilobits per second. */
      downloadThroughputKbps?: number;
      /** The network upload throughput in kilobits per second. */
      uploadThroughputKbps?: number;
      // used by both
      /** The amount of slowdown applied to the cpu (1/<cpuSlowdownMultiplier>). */
      cpuSlowdownMultiplier?: number
    }

    export interface PrecomputedLanternData {
      additionalRttByOrigin: {[origin: string]: number};
      serverResponseTimeByOrigin: {[origin: string]: number};
    }

    export type Locale = 'en-US'|'en'|'en-AU'|'en-GB'|'en-IE'|'en-SG'|'en-ZA'|'en-IN'|'ar-XB'|'ar'|'bg'|'bs'|'ca'|'cs'|'da'|'de'|'el'|'en-XA'|'en-XL'|'es'|'es-419'|'es-AR'|'es-BO'|'es-BR'|'es-BZ'|'es-CL'|'es-CO'|'es-CR'|'es-CU'|'es-DO'|'es-EC'|'es-GT'|'es-HN'|'es-MX'|'es-NI'|'es-PA'|'es-PE'|'es-PR'|'es-PY'|'es-SV'|'es-US'|'es-UY'|'es-VE'|'fi'|'fil'|'fr'|'he'|'hi'|'hr'|'hu'|'gsw'|'id'|'in'|'it'|'iw'|'ja'|'ko'|'ln'|'lt'|'lv'|'mo'|'nl'|'nb'|'no'|'pl'|'pt'|'pt-PT'|'ro'|'ru'|'sk'|'sl'|'sr'|'sr-Latn'|'sv'|'ta'|'te'|'th'|'tl'|'tr'|'uk'|'vi'|'zh'|'zh-HK'|'zh-TW';

    export type OutputMode = 'json' | 'html' | 'csv';

    /**
     * Options that are found in both the flags used by the Lighthouse module
     * interface and the Config's `settings` object.
     */
    interface SharedFlagsSettings {
      /** The type(s) of report output to be produced. */
      output?: OutputMode|OutputMode[];
      /** The locale to use for the output. */
      locale?: Locale;
      /** The maximum amount of time to wait for a page content render, in ms. If no content is rendered within this limit, the run is aborted with an error. */
      maxWaitForFcp?: number;
      /** The maximum amount of time to wait for a page to load, in ms. */
      maxWaitForLoad?: number;
      /** List of URL patterns to block. */
      blockedUrlPatterns?: string[] | null;
      /** Comma-delimited list of trace categories to include. */
      additionalTraceCategories?: string | null;
      /** Flag indicating the run should only audit. */
      auditMode?: boolean | string;
      /** Flag indicating the run should only gather. */
      gatherMode?: boolean | string;
      /** Flag indicating that the browser storage should not be reset for the audit. */
      disableStorageReset?: boolean;
      /** The form factor the emulation should use. */
      emulatedFormFactor?: 'mobile'|'desktop'|'none';
      /** The method used to throttle the network. */
      throttlingMethod?: 'devtools'|'simulate'|'provided';
      /** The throttling config settings. */
      throttling?: ThrottlingSettings;
      /** If present, the run should only conduct this list of audits. */
      onlyAudits?: string[] | null;
      /** If present, the run should only conduct this list of categories. */
      onlyCategories?: string[] | null;
      /** If present, the run should skip this list of audits. */
      skipAudits?: string[] | null;
      /** List of extra HTTP Headers to include. */
      extraHeaders?: Crdp.Network.Headers | null; // See extraHeaders TODO in bin.js
      /** How Lighthouse was run, e.g. from the Chrome extension or from the npm module */
      channel?: string
      /** Precomputed lantern estimates to use instead of observed analysis. */
      precomputedLanternData?: PrecomputedLanternData | null;
      /** The budget.json object for LightWallet. */
      budgets?: Array<Budget> | null;
    }

    /**
     * Extends the flags in SharedFlagsSettings with flags used to configure the
     * Lighthouse module but will not end up in the Config settings.
     */
    export interface Flags extends SharedFlagsSettings {
      /** The port to use for the debugging protocol, if manually connecting. */
      port?: number;
      /** The hostname to use for the debugging protocol, if manually connecting. */
      hostname?: string;
      /** The level of logging to enable. */
      logLevel?: 'silent'|'error'|'info'|'verbose';
      /** The path to the config JSON. */
      configPath?: string;
      /** Run the specified plugins. */
      plugins?: string[];
    }

    /**
     * Extends the flags accepted by the Lighthouse module with additional flags
     * used just for controlling the CLI.
     */
    export interface CliFlags extends Flags {
      _: string[];
      chromeFlags: string;
      /** Output path for the generated results. */
      outputPath: string;
      /** Flag to save the trace contents and screenshots to disk. */
      saveAssets: boolean;
      /** Flag to open the report immediately. */
      view: boolean;
      /** Flag to enable error reporting. */
      enableErrorReporting?: boolean;
      /** Flag to print a list of all audits + categories. */
      listAllAudits: boolean;
      /** Flag to print a list of all required trace categories. */
      listTraceCategories: boolean;
      /** A preset audit of selected audit categories to run. */
      preset?: 'full'|'mixed-content'|'perf';
      /** A flag to enable logLevel 'verbose'. */
      verbose: boolean;
      /** A flag to enable logLevel 'silent'. */
      quiet: boolean;
      /** A flag to print the normalized config for the given config and options, then exit. */
      printConfig: boolean;
      /** Path to the file where precomputed lantern data should be read from. */
      precomputedLanternDataPath?: string;
      /** Path to the file where precomputed lantern data should be written to. */
      lanternDataOutputPath?: string;
      /** Path to the budget.json file for LightWallet. */
      budgetPath?: string | null;

      // The following are given defaults in cli-flags, so are not optional like in Flags or SharedFlagsSettings.
      output: OutputMode[];
      port: number;
      hostname: string;
    }

    export interface RunnerResult {
      lhr: Result;
      report: string|string[];
      artifacts: Artifacts;
    }

    export interface ReportCategory {
      name: string;
      description: string;
      audits: ReportAudit[];
    }

    export interface ReportAudit {
      id: string;
      weight: number;
      group: string;
    }

    /**
     * A record of DevTools Debugging Protocol events.
     */
    export type DevtoolsLog = Array<Protocol.RawEventMessage>;

    export interface Trace {
      traceEvents: TraceEvent[];
      metadata?: {
        'cpu-family'?: number;
      };
      [futureProps: string]: any;
    }

    /**
     * @see https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview
     */
    export interface TraceEvent {
      name: string;
      cat: string;
      args: {
        fileName?: string;
        snapshot?: string;
        data?: {
          isLoadingMainFrame?: boolean;
          documentLoaderURL?: string;
          frames?: {
            frame: string;
            parent?: string;
            processId?: number;
          }[];
          page?: string;
          readyState?: number;
          requestId?: string;
          stackTrace?: {
            url: string
          }[];
          styleSheetUrl?: string;
          timerId?: string;
          url?: string;
        };
        frame?: string;
        name?: string;
        labels?: string;
      };
      pid: number;
      tid: number;
      ts: number;
      dur: number;
      ph: 'B'|'b'|'D'|'E'|'e'|'F'|'I'|'M'|'N'|'n'|'O'|'R'|'S'|'T'|'X';
      s?: 't';
      id?: string;
    }

    export interface DevToolsJsonTarget {
      description: string;
      devtoolsFrontendUrl: string;
      id: string;
      title: string;
      type: string;
      url: string;
      webSocketDebuggerUrl: string;
    }
  }
}
