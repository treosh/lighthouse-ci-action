/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');
const URL = require('../lib/url-shim.js');
const Util = require('../report/html/renderer/util.js');
const NetworkRecords = require('../computed/network-records.js');

/**
 * This audit checks which resources a page currently loads over HTTP which it
 * could instead load over HTTPS, and which resources are still HTTP only.
 * This audit uses two passes: one to see the current state of requests, and
 * one to attempt upgrading each request to HTTPS.
 */
class MixedContent extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'mixed-content',
      title: 'All resources loaded are secure',
      failureTitle: 'Some insecure resources can be upgraded to HTTPS',
      description: `Mixed content warnings can prevent you from upgrading to HTTPS.
      This audit shows which insecure resources this page uses that can be
      upgraded to HTTPS. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/mixed-content)`,
      requiredArtifacts: ['devtoolsLogs', 'MixedContent'],
    };
  }

  /**
   * Upgrades a URL to use HTTPS.
   *
   * @param {string} url
   * @return {string}
   */
  static upgradeURL(url) {
    const parsedURL = new URL(url);
    parsedURL.protocol = 'https:';
    return parsedURL.href;
  }

  /**
   * Simplifies a URL string by removing the query string and fragments.
   *
   * @param {string} url
   * @return {string}
   */
  static simplifyURL(url) {
    const parsedURL = new URL(url);
    parsedURL.hash = '';
    parsedURL.search = '';
    return parsedURL.href;
  }

  /**
   * Simplifies a URL string for display.
   *
   * @param {string=} url
   * @return {string}
   */
  static displayURL(url = '') {
    const displayOptions = {
      numPathParts: 4,
      preserveQuery: false,
      preserveHost: true,
    };
    return URL.getURLDisplayName(url, displayOptions);
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static audit(artifacts, context) {
    const defaultLogs = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const upgradeLogs = artifacts.devtoolsLogs['mixedContentPass'];
    const baseHostname = new URL(artifacts.MixedContent.url).host;

    const computedArtifacts = [
      NetworkRecords.request(defaultLogs, context),
      NetworkRecords.request(upgradeLogs, context),
    ];

    return Promise.all(computedArtifacts).then(([defaultRecords, upgradedRecords]) => {
      const insecureRecords = defaultRecords.filter(
          record => !record.isSecure);
      const secureRecords = defaultRecords.filter(
          record => record.isSecure);

      const upgradePassHosts = new Set();
      const upgradePassSecureHosts = new Set();
      upgradedRecords.forEach(record => {
        upgradePassHosts.add(new URL(record.url).hostname);
        if (record.isSecure && record.finished && !record.failed) {
          upgradePassSecureHosts.add(new URL(record.url).hostname);
        }
      });

      // De-duplicate records based on URL without fragment or query.
      // Some resources are requested multiple times with different parameters
      // but we only want to show them to the user once.
      const seen = new Set();
      const upgradeableResources = [];

      for (const record of insecureRecords) {
        const simpleUrl = this.simplifyURL(record.url);
        if (seen.has(simpleUrl)) continue;
        seen.add(simpleUrl);

        const resource = {
          host: new URL(record.url).hostname,
          fullUrl: record.url,
          referrerDocUrl: this.displayURL(record.documentURL),
        };
        // Exclude any records that aren't on an upgradeable secure host
        if (!upgradePassSecureHosts.has(resource.host)) continue;
        // Exclude iframe subresources
        if (!resource.referrerDocUrl.includes(baseHostname)) continue;

        upgradeableResources.push(resource);
      }

      const displayValue = `${Util.formatNumber(upgradeableResources.length)}
          ${upgradeableResources.length === 1 ? 'request' : 'requests'}`;

      /** @type {LH.Audit.Details.Table['headings']} */
      const headings = [
        {key: 'fullUrl', itemType: 'url', text: 'URL'},
      ];
      const details = Audit.makeTableDetails(headings, upgradeableResources);

      const totalRecords = defaultRecords.length;
      const score = (secureRecords.length + 0.5 * upgradeableResources.length) / totalRecords;

      return {
        score,
        displayValue: displayValue,
        details,
      };
    });
  }
}

module.exports = MixedContent;
