/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');
const ManifestValues = require('../computed/manifest-values.js');

/* eslint-disable max-len */
const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on if a website is installable as an application. This descriptive title is shown to users when a webapp is installable. */
  'title': 'Web app manifest and service worker meet the installability requirements',
  /** Title of a Lighthouse audit that provides detail on if a website is installable as an application. This descriptive title is shown to users when a webapp is not installable. */
  'failureTitle': 'Web app manifest or service worker do not meet the installability requirements',
  /** Description of a Lighthouse audit that tells the user why installability is important for webapps. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  'description': `Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more](https://web.dev/installable-manifest/).`,
  /** Description Table column header for the observed value of the Installability failure reason statistic. */
  'columnValue': 'Failure reason',
  /**
   * @description [ICU Syntax] Label for an audit identifying the number of installability errors found in the page.
   */
  'displayValue': `{itemCount, plural,
    =1 {1 reason}
    other {# reasons}
    }`,
  /**
   * @description Error message describing a DevTools error id that was found and has not been identified by this audit.
   * @example {platform-not-supported-on-android} errorId
   */
  'noErrorId': `Installability error id '{errorId}' is not recognized`,
  /** Error message explaining that the page is not loaded in the frame.  */
  'not-in-main-frame': `Page is not loaded in the main frame`,
  /** Error message explaining that the page is served from a secure origin. */
  'not-from-secure-origin': 'Page is not served from a secure origin',
  /** Error message explaining that the page has no manifest URL. */
  'no-manifest': 'Page has no manifest <link> URL',
  /** Error message explaining that the provided manifest URL is invalid. */
  'start-url-not-valid': `Manifest start URL is not valid`,
  /** Error message explaining that the provided manifest does not contain a name or short_name field. */
  'manifest-missing-name-or-short-name': `Manifest does not contain a 'name' or 'short_name' field`,
  /** Error message explaining that the manifest display property must be one of 'standalone', 'fullscreen', or 'minimal-ui'. */
  'manifest-display-not-supported': `Manifest 'display' property must be one of 'standalone', 'fullscreen', or 'minimal-ui'`,
  /** Error message explaining that the manifest could not be fetched, might be empty, or could not be parsed. */
  'manifest-empty': `Manifest could not be fetched, is empty, or could not be parsed`,
  /** Error message explaining that no matching service worker was detected,
   * and provides a suggestion to reload the page or check whether the scope of the service worker
   * for the current page encloses the scope and start URL from the manifest. */
  'no-matching-service-worker': `No matching service worker detected. You may need to reload the page, or check that the scope of the service worker for the current page encloses the scope and start URL from the manifest.`,
  /**
   * @description Error message explaining that the manifest does not contain a suitable icon.
   * @example {192} value0
   */
  'manifest-missing-suitable-icon': `Manifest does not contain a suitable icon - PNG, SVG or WebP format of at least {value0}\xa0px is required, the sizes attribute must be set, and the purpose attribute, if set, must include "any".`,

  /**
   * @description Error message explaining that the manifest does not supply an icon of the correct format.
   * @example {192} value0
   */
  'no-acceptable-icon': `No supplied icon is at least {value0}\xa0px square in PNG, SVG or WebP format, with the purpose attribute unset or set to "any"`,

  /** Error message explaining that the icon could not be downloaded. */
  'cannot-download-icon': `Could not download a required icon from the manifest`,
  /** Error message explaining that the downloaded icon was empty or corrupt. */
  'no-icon-available': `Downloaded icon was empty or corrupted`,
  /** Error message explaining that the specified application platform is not supported on Android. */
  'platform-not-supported-on-android': `The specified application platform is not supported on Android`,
  /** Error message explaining that a Play store ID was not provided. */
  'no-id-specified': `No Play store ID provided`,
  /** Error message explaining that the Play Store app URL and Play Store ID do not match. */
  'ids-do-not-match': `The Play Store app URL and Play Store ID do not match`,
  /** Error message explaining that the app is already installed. */
  'already-installed': `The app is already installed`,
  /** Error message explaining that a URL in the manifest contains a username, password, or port. */
  'url-not-supported-for-webapk': `A URL in the manifest contains a username, password, or port`,
  /** Error message explaining that the page is loaded in an incognito window. */
  'in-incognito': `Page is loaded in an incognito window`,
  // TODO: perhaps edit this message to make it more actionable for LH users
  /** Error message explaining that the page does not work offline. */
  'not-offline-capable': `Page does not work offline`,
  /** Error message explaining that service worker could not be checked without a start_url. */
  'no-url-for-service-worker': `Could not check service worker without a 'start_url' field in the manifest`,
  /** Error message explaining that the manifest specifies prefer_related_applications: true. */
  'prefer-related-applications': `Manifest specifies prefer_related_applications: true`,
  /** Error message explaining that prefer_related_applications is only supported on Chrome Beta and Stable channels on Android. */
  'prefer-related-applications-only-beta-stable': `prefer_related_applications is only supported on Chrome Beta and Stable channels on Android.`,
  /** Error message explaining that the manifest contains 'display_override' field, and the
      first supported display mode must be one of 'standalone', 'fullscreen', or 'minimal-ui'. */
  'manifest-display-override-not-supported': `Manifest contains 'display_override' field, and the first supported display mode must be one of 'standalone', 'fullscreen', or 'minimal-ui'`,
  /** Error message explaining that the web manifest's URL changed while the manifest was being downloaded by the browser. */
  'manifest-location-changed': `Manifest URL changed while the manifest was being fetched.`,
  /** Warning message explaining that the page does not work offline. */
  'warn-not-offline-capable': `Page does not work offline. The page will not be regarded as installable after Chrome 93, stable release August 2021.`,
  /** Error message explaining that Lighthouse failed while detecting a service worker, and directing the user to try again in a new Chrome. */
  'protocol-timeout': `Lighthouse could not determine if there was a service worker. Please try with a newer version of Chrome.`,
  /** Message logged when the web app has been uninstalled o desktop, signalling that the install banner state is being reset. */
  'pipeline-restarted': 'PWA has been uninstalled and installability checks resetting.',
};
/* eslint-enable max-len */

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * @fileoverview
 * Audits if the page's web app manifest and service worker qualify for triggering a beforeinstallprompt event.
 * https://github.com/GoogleChrome/lighthouse/issues/23#issuecomment-270453303
 *
 * Requirements based on Chrome Devtools' installability requirements.
 * Origin of logging:
 * https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/installable/installable_logging.cc
 * DevTools InstallabilityError implementation:
 * https://source.chromium.org/search?q=getInstallabilityErrorMessages&ss=chromium%2Fchromium%2Fsrc:third_party%2Fdevtools-frontend%2Fsrc%2Ffront_end%2Fresources%2F
 */

class InstallableManifest extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'installable-manifest',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      supportedModes: ['navigation'],
      requiredArtifacts: ['URL', 'WebAppManifest', 'InstallabilityErrors'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {{i18nErrors: Array<LH.IcuMessage | string>; warnings: Array<LH.IcuMessage>}}
   */
  static getInstallabilityErrors(artifacts) {
    const installabilityErrors = artifacts.InstallabilityErrors.errors;
    const i18nErrors = [];
    const warnings = [];
    const errorArgumentsRegex = /{([^}]+)}/g;

    for (const err of installabilityErrors) {
      // Filter out errorId 'in-incognito' since Lighthouse recommends incognito.
      if (err.errorId === 'in-incognito') continue;

      if (err.errorId === 'warn-not-offline-capable') {
        warnings.push(str_(UIStrings[err.errorId]));
        continue;
      }

      // Filter out errorId 'pipeline-restarted' since it only applies when the PWA is uninstalled.
      if (err.errorId === 'pipeline-restarted') {
        continue;
      }

      // @ts-expect-error errorIds from protocol should match up against the strings dict
      const matchingString = UIStrings[err.errorId];

      // Handle an errorId we don't recognize.
      if (matchingString === undefined) {
        i18nErrors.push(str_(UIStrings.noErrorId, {errorId: err.errorId}));
        continue;
      }

      // Get the i18m argument names of the installability error message, if any.
      const UIStringArguments = matchingString.match(errorArgumentsRegex) || [];

      /**
       * If there is an argument value, get it.
       * We only expect a `minimum-icon-size-in-pixels` errorArg[0] for two errorIds, currently.
       */
      const value0 = err.errorArguments?.length && err.errorArguments[0].value;

      if (matchingString && err.errorArguments.length !== UIStringArguments.length) {
        // Matching string, but have the incorrect number of arguments for the message.
        const stringArgs = JSON.stringify(err.errorArguments);
        const msg = err.errorArguments.length > UIStringArguments.length ?
          `${err.errorId} has unexpected arguments ${stringArgs}` :
          `${err.errorId} does not have the expected number of arguments.`;
        i18nErrors.push(msg);
      } else if (matchingString && value0) {
        i18nErrors.push(str_(matchingString, {value0}));
      } else if (matchingString) {
        i18nErrors.push(str_(matchingString));
      }
    }

    return {i18nErrors, warnings};
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   *
   */
  static async audit(artifacts, context) {
    const manifestValues = await ManifestValues.request(artifacts, context);
    const {i18nErrors, warnings} = InstallableManifest.getInstallabilityErrors(artifacts);

    const manifestUrl = artifacts.WebAppManifest ? artifacts.WebAppManifest.url : null;

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'reason', itemType: 'text', text: str_(UIStrings.columnValue)},
    ];

    // Errors for report table.
    /** @type {LH.Audit.Details.Table['items']} */
    const errorReasons = i18nErrors.map(reason => {
      return {reason};
    });
    /** DevTools InstallabilityErrors does not emit an error unless there is a manifest, so include manifestValues's error */
    if (manifestValues.isParseFailure) {
      errorReasons.push({
        reason: manifestValues.parseFailureReason});
    }

    // Include the detailed pass/fail checklist as a diagnostic.
    /** @type {LH.Audit.Details.DebugData} */
    const debugData = {
      type: 'debugdata',
      manifestUrl,
    };

    if (errorReasons.length > 0) {
      return {
        score: 0,
        warnings,
        numericValue: errorReasons.length,
        numericUnit: 'element',
        displayValue: str_(UIStrings.displayValue, {itemCount: errorReasons.length}),
        details: {...Audit.makeTableDetails(headings, errorReasons), debugData},
      };
    }
    return {
      score: 1,
      warnings,
      details: {...Audit.makeTableDetails(headings, errorReasons), debugData},
    };
  }
}

module.exports = InstallableManifest;
module.exports.UIStrings = UIStrings;
