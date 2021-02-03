/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-disable max-len */

const yargs = require('yargs');
const fs = require('fs');
const {isObjectOfUnknownValues} = require('../lighthouse-core/lib/type-verifiers.js');

/**
 * @param {string=} manualArgv
 * @return {LH.CliFlags}
 */
function getFlags(manualArgv) {
  // @ts-expect-error - undocumented, but yargs() supports parsing a single `string`.
  const y = manualArgv ? yargs(manualArgv) : yargs;

  const argv = y.help('help')
      .showHelpOnFail(false, 'Specify --help for available options')

      .usage('lighthouse <url> <options>')
      .example(
          'lighthouse <url> --view', 'Opens the HTML report in a browser after the run completes')
      .example(
          'lighthouse <url> --config-path=./myconfig.js',
          'Runs Lighthouse with your own configuration: custom audits, report generation, etc.')
      .example(
          'lighthouse <url> --output=json --output-path=./report.json --save-assets',
          'Save trace, screenshots, and named JSON report.')
      .example(
          'lighthouse <url> --screenEmulation.disabled --throttling-method=provided --no-emulated-user-agent',
          'Disable emulation and all throttling')
      .example(
          'lighthouse <url> --chrome-flags="--window-size=412,660"',
          'Launch Chrome with a specific window size')
      .example(
          'lighthouse <url> --quiet --chrome-flags="--headless"',
          'Launch Headless Chrome, turn off logging')
      .example(
          'lighthouse <url> --extra-headers "{\\"Cookie\\":\\"monster=blue\\", \\"x-men\\":\\"wolverine\\"}"',
          'Stringify\'d JSON HTTP Header key/value pairs to send in requests')
      .example(
          'lighthouse <url> --extra-headers=./path/to/file.json',
          'Path to JSON file of HTTP Header key/value pairs to send in requests')
      .example(
          'lighthouse <url> --only-categories=performance,pwa',
          'Only run the specified categories. Available categories: accessibility, best-practices, performance, pwa, seo')

      // We only have the single string positional argument, the url.
      .option('_', {
        array: true, // Always an array, but this lets the type system know.
        type: 'string',
      })

      /*
       * Also accept a file for all of these flags. Yargs will merge in and override the file-based
       * flags with the command-line flags.
       *
       * i.e. when command-line `--throttling-method=provided` and file `throttlingMethod: "devtools"`,
       * throttlingMethod will be `provided`.
       *
       * @see https://github.com/yargs/yargs/blob/a6e67f15a61558d0ba28bfe53385332f0ce5d431/docs/api.md#config
       */
      .option('cli-flags-path', {
        config: true,
        describe: 'The path to a JSON file that contains the desired CLI flags to apply. Flags specified at the command line will still override the file-based ones.',
      })

      // Logging
      .options({
        'verbose': {
          type: 'boolean',
          default: false,
          describe: 'Displays verbose logging',
        },
        'quiet': {
          type: 'boolean',
          default: false,
          describe: 'Displays no progress, debug logs, or errors',
        },
      })
      .group(['verbose', 'quiet'], 'Logging:')

      // Configuration
      .options({
        'save-assets': {
          type: 'boolean',
          default: false,
          describe: 'Save the trace contents & devtools logs to disk',
        },
        'list-all-audits': {
          type: 'boolean',
          default: false,
          describe: 'Prints a list of all available audits and exits',
        },
        'list-trace-categories': {
          type: 'boolean',
          default: false,
          describe: 'Prints a list of all required trace categories and exits',
        },
        'print-config': {
          type: 'boolean',
          default: false,
          describe: 'Print the normalized config for the given config and options, then exit.',
        },
        'additional-trace-categories': {
          type: 'string',
          describe: 'Additional categories to capture with the trace (comma-delimited).',
        },
        'config-path': {
          type: 'string',
          describe: `The path to the config JSON.
            An example config file: lighthouse-core/config/lr-desktop-config.js`,
        },
        'preset': {
          type: 'string',
          describe: `Use a built-in configuration.
          WARNING: If the --config-path flag is provided, this preset will be ignored.`,
        },
        'chrome-flags': {
          type: 'string',
          default: '',
          describe: `Custom flags to pass to Chrome (space-delimited). For a full list of flags, see https://bit.ly/chrome-flags
            Additionally, use the CHROME_PATH environment variable to use a specific Chrome binary. Requires Chromium version 66.0 or later. If omitted, any detected Chrome Canary or Chrome stable will be used.`,
        },
        'port': {
          type: 'number',
          default: 0,
          describe: 'The port to use for the debugging protocol. Use 0 for a random port',
        },
        'hostname': {
          type: 'string',
          default: 'localhost',
          describe: 'The hostname to use for the debugging protocol.',
        },
        'form-factor': {
          type: 'string',
          describe: 'Determines how performance metrics are scored and if mobile-only audits are skipped. For desktop, --preset=desktop instead.',
        },
        'screenEmulation': {
          describe: 'Sets screen emulation parameters. See also --preset. Use --screenEmulation.disabled to disable. Otherwise set these 4 parameters individually: --screenEmulation.mobile --screenEmulation.width=360 --screenEmulation.height=640 --screenEmulation.deviceScaleFactor=2',
          coerce: coerceScreenEmulation,
        },
        'emulatedUserAgent': {
          type: 'string',
          coerce: coerceOptionalStringBoolean,
          describe: 'Sets useragent emulation',
        },
        'max-wait-for-load': {
          type: 'number',
          describe: 'The timeout (in milliseconds) to wait before the page is considered done loading and the run should continue. WARNING: Very high values can lead to large traces and instability',
        },
        'enable-error-reporting': {
          type: 'boolean',
          default: undefined, // Explicitly `undefined` so prompted by default.
          describe: 'Enables error reporting, overriding any saved preference. --no-enable-error-reporting will do the opposite. More: https://git.io/vFFTO',
        },
        'gather-mode': {
          alias: 'G',
          coerce: coerceOptionalStringBoolean,
          describe: 'Collect artifacts from a connected browser and save to disk. (Artifacts folder path may optionally be provided). If audit-mode is not also enabled, the run will quit early.',
        },
        'audit-mode': {
          alias: 'A',
          coerce: coerceOptionalStringBoolean,
          describe: 'Process saved artifacts from disk. (Artifacts folder path may be provided, otherwise defaults to ./latest-run/)',
        },
        'only-audits': {
          array: true,
          type: 'string',
          coerce: splitCommaSeparatedValues,
          describe: 'Only run the specified audits',
        },
        'only-categories': {
          array: true,
          type: 'string',
          coerce: splitCommaSeparatedValues,
          describe: 'Only run the specified categories. Available categories: accessibility, best-practices, performance, pwa, seo',
        },
        'skip-audits': {
          array: true,
          type: 'string',
          coerce: splitCommaSeparatedValues,
          describe: 'Run everything except these audits',
        },
        'budget-path': {
          type: 'string',
          describe: 'The path to the budget.json file for LightWallet.',
        },
      })
      .group([
        'save-assets', 'list-all-audits', 'list-trace-categories', 'print-config', 'additional-trace-categories',
        'config-path', 'preset', 'chrome-flags', 'port', 'hostname', 'form-factor', 'screenEmulation', 'emulatedUserAgent',
        'max-wait-for-load', 'enable-error-reporting', 'gather-mode', 'audit-mode',
        'only-audits', 'only-categories', 'skip-audits', 'budget-path',
      ], 'Configuration:')

      // Output
      .options({
        'output': {
          type: 'array',
          default: /** @type {['html']} */ (['html']),
          coerce: coerceOutput,
          describe: 'Reporter for the results, supports multiple values. choices: "json", "html", "csv"',
        },
        'output-path': {
          type: 'string',
          describe: `The file path to output the results. Use 'stdout' to write to stdout.
  If using JSON output, default is stdout.
  If using HTML or CSV output, default is a file in the working directory with a name based on the test URL and date.
  If using multiple outputs, --output-path is appended with the standard extension for each output type. "reports/my-run" -> "reports/my-run.report.html", "reports/my-run.report.json", etc.
  Example: --output-path=./lighthouse-results.html`,
        },
        'view': {
          type: 'boolean',
          default: false,
          describe: 'Open HTML report in your browser',
        },
      })
      .group(['output', 'output-path', 'view'], 'Output:')

      // Other options.
      .options({
        'locale': {
          coerce: coerceLocale,
          describe: 'The locale/language the report should be formatted in',
        },
        'blocked-url-patterns': {
          array: true,
          type: 'string',
          describe: 'Block any network requests to the specified URL patterns',
        },
        'disable-storage-reset': {
          type: 'boolean',
          describe: 'Disable clearing the browser cache and other storage APIs before a run',
        },
        'throttling-method': {
          type: 'string',
          describe: 'Controls throttling method',
        },
      })

      // Throttling settings, parsed as an object.
      .option('throttling', {
        coerce: coerceThrottling,
      })
      .describe({
        'throttling.rttMs': 'Controls simulated network RTT (TCP layer)',
        'throttling.throughputKbps': 'Controls simulated network download throughput',
        'throttling.requestLatencyMs': 'Controls emulated network RTT (HTTP layer)',
        'throttling.downloadThroughputKbps': 'Controls emulated network download throughput',
        'throttling.uploadThroughputKbps': 'Controls emulated network upload throughput',
        'throttling.cpuSlowdownMultiplier': 'Controls simulated + emulated CPU throttling',
      })

      .options({
        'extra-headers': {
          coerce: coerceExtraHeaders,
          describe: 'Set extra HTTP Headers to pass with request',
        },
        'precomputed-lantern-data-path': {
          type: 'string',
          describe: 'Path to the file where lantern simulation data should be read from, overwriting the lantern observed estimates for RTT and server latency.',
        },
        'lantern-data-output-path': {
          type: 'string',
          describe: 'Path to the file where lantern simulation data should be written to, can be used in a future run with the `precomputed-lantern-data-path` flag.',
        },
        'plugins': {
          array: true,
          type: 'string',
          coerce: splitCommaSeparatedValues,
          describe: 'Run the specified plugins',
        },
        'channel': {
          type: 'string',
          default: 'cli',
        },
        'chrome-ignore-default-flags': {
          type: 'boolean',
          default: false,
        },
      })

      // Choices added outside of `options()` and cast so tsc picks them up.
      .choices('form-factor', /** @type {['mobile', 'desktop']} */ (['mobile', 'desktop']))
      .choices('throttling-method', /** @type {['devtools', 'provided', 'simulate']} */ (['devtools', 'provided', 'simulate']))
      .choices('preset', /** @type {['perf', 'experimental', 'desktop']} */ (['perf', 'experimental', 'desktop']))

      .check(argv => {
        // Lighthouse doesn't need a URL if...
        //   - We're just listing the available options.
        //   - We're just printing the config.
        //   - We're in auditMode (and we have artifacts already)
        // If one of these don't apply, if no URL, stop the program and ask for one.
        const isPrintSomethingMode = argv.listAllAudits || argv.listTraceCategories || argv.printConfig;
        const isOnlyAuditMode = !!argv.auditMode && !argv.gatherMode;
        if (isPrintSomethingMode || isOnlyAuditMode) {
          return true;
        } else if (argv._.length > 0) {
          return true;
        }

        throw new Error('Please provide a url');
      })
      .epilogue('For more information on Lighthouse, see https://developers.google.com/web/tools/lighthouse/.')
      .wrap(yargs.terminalWidth())
      .argv;

  // Augmenting yargs type with auto-camelCasing breaks in tsc@4.1.2 and @types/yargs@15.0.11,
  // so for now cast to add yarg's camelCase properties to type.
  const cliFlags = /** @type {typeof argv & CamelCasify<typeof argv>} */ (argv);

  return cliFlags;
}

/**
 * Support comma-separated values for some array flags by splitting on any ',' found.
 * @param {Array<string>=} strings
 * @return {Array<string>|undefined}
 */
function splitCommaSeparatedValues(strings) {
  if (!strings) return strings;

  return strings.flatMap(value => value.split(','));
}

/**
 * @param {unknown} value
 * @return {boolean|string|undefined}
 */
function coerceOptionalStringBoolean(value) {
  if (typeof value !== 'undefined' && typeof value !== 'string' && typeof value !== 'boolean') {
    throw new Error('Invalid value: Argument must be a string or a boolean');
  }
  return value;
}

/**
 * Coerce output CLI input to `LH.SharedFlagsSettings['output']` or throw if not possible.
 * @param {Array<unknown>} values
 * @return {Array<LH.OutputMode>}
 */
function coerceOutput(values) {
  const outputTypes = ['json', 'html', 'csv'];
  const errorMsg = `Invalid values. Argument 'output' must be an array from choices "${outputTypes.join('", "')}"`;
  if (!values.every(/** @return {item is string} */ item => typeof item === 'string')) {
    throw new Error(errorMsg);
  }
  // Allow parsing of comma-separated values.
  const strings = values.flatMap(value => value.split(','));
  if (!strings.every(/** @return {str is LH.OutputMode} */ str => outputTypes.includes(str))) {
    throw new Error(errorMsg);
  }
  return strings;
}

/**
 * Verifies value is a string, then coerces type to LH.Locale for convenience. However, don't
 * allowlist specific locales. Why? So we can support the user who requests 'es-MX' (unsupported)
 * and we'll fall back to 'es' (supported).
 * @param {unknown} value
 * @return {LH.Locale}
 */
function coerceLocale(value) {
  if (typeof value !== 'string') throw new Error(`Invalid value: Argument 'locale' must be a string`);
  return /** @type {LH.Locale} */ (value);
}

/**
 * `--extra-headers` comes in as a JSON string or a path to a JSON string, but the flag value
 * needs to be the parsed object. Load file (if necessary) and returns the parsed object.
 * @param {unknown} value
 * @return {LH.SharedFlagsSettings['extraHeaders']}
 */
function coerceExtraHeaders(value) {
  // TODO: this function does not actually verify the object type.
  if (value === undefined) return value;
  if (typeof value === 'object') return /** @type {LH.SharedFlagsSettings['extraHeaders']} */ (value);
  if (typeof value !== 'string') {
    throw new Error(`Invalid value: Argument 'extra-headers' must be a string`);
  }

  // (possibly) load and parse extra headers from JSON.
  if (!value.startsWith('{')) {
    // If not a JSON object, assume it's a path to a JSON file.
    return JSON.parse(fs.readFileSync(value, 'utf-8'));
  }
  return JSON.parse(value);
}

/**
 * Take yarg's unchecked object value and ensure it's proper throttling settings.
 * @param {unknown} value
 * @return {LH.ThrottlingSettings}
 */
function coerceThrottling(value) {
  if (!isObjectOfUnknownValues(value)) {
    throw new Error(`Invalid value: Argument 'throttling' must be an object, specified per-property ('throttling.rttMs', 'throttling.throughputKbps', etc)`);
  }

  /** @type {Array<keyof LH.ThrottlingSettings>} */
  const throttlingKeys = [
    'rttMs',
    'throughputKbps',
    'requestLatencyMs',
    'downloadThroughputKbps',
    'uploadThroughputKbps',
    'cpuSlowdownMultiplier',
  ];

  /** @type {LH.ThrottlingSettings} */
  const throttlingSettings = {};
  for (const key of throttlingKeys) {
    const possibleSetting = value[key];
    if (possibleSetting !== undefined && typeof possibleSetting !== 'number') {
      throw new Error(`Invalid value: 'throttling.${key}' must be a number`);
    }
    // Note: this works type-wise because the throttling settings all have the same type.
    throttlingSettings[key] = possibleSetting;
  }

  return throttlingSettings;
}

/**
 * Take yarg's unchecked object value and ensure it is a proper LH.screenEmulationSettings.
 * @param {unknown} value
 * @return {Partial<LH.ScreenEmulationSettings>}
 */
function coerceScreenEmulation(value) {
  if (!isObjectOfUnknownValues(value)) {
    throw new Error(`Invalid value: Argument 'screenEmulation' must be an object, specified per-property ('screenEmulation.width', 'screenEmulation.deviceScaleFactor', etc)`);
  }

  /** @type {Array<keyof LH.ScreenEmulationSettings>} */
  const keys = ['width', 'height', 'deviceScaleFactor', 'mobile', 'disabled'];
  /** @type {Partial<LH.ScreenEmulationSettings>} */
  const screenEmulationSettings = {};

  for (const key of keys) {
    const possibleSetting = value[key];
    switch (key) {
      case 'width':
      case 'height':
      case 'deviceScaleFactor':
        if (possibleSetting !== undefined && typeof possibleSetting !== 'number') {
          throw new Error(`Invalid value: 'screenEmulation.${key}' must be a number`);
        }
        screenEmulationSettings[key] = possibleSetting;

        break;
      case 'mobile':
      case 'disabled':
        if (possibleSetting !== undefined && typeof possibleSetting !== 'boolean') {
          throw new Error(`Invalid value: 'screenEmulation.${key}' must be a boolean`);
        }
        screenEmulationSettings[key] = possibleSetting;
        break;
      default:
        throw new Error(`Unrecognized screenEmulation option: ${key}`);
    }
  }

  return screenEmulationSettings;
}

module.exports = {
  getFlags,
};
