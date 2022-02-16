/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fetch = require('node-fetch');

const InstallableManifestAudit = require('../../lighthouse-core/audits/installable-manifest.js');

/* eslint-env jest */

jest.setTimeout(20_000);

describe('installabilityErrors', () => {
  let chromiumErrorIds;

  beforeAll(async () => {
    const installableLoggingGitTilesUrl =
      'https://chromium.googlesource.com/chromium/src/+/main/components/webapps/browser/installable/installable_logging.cc?format=TEXT';
    const resp = await fetch(installableLoggingGitTilesUrl);
    if (!resp.ok) {
      throw new Error(`Chromium source fetch failed: ${resp.status} ${resp.statusText}`);
    }
    const base64 = await resp.text();
    const buff = Buffer.from(base64, 'base64');
    const text = buff.toString('utf-8');

    // Apply some *beautiful* regexes to parse the C++ of https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/installable/installable_logging.cc
    const handledErrorConsts = [...text.matchAll(/error_id = (k.*?);/g)].map(([_, match]) => match);
    const errorConstsToIdsCode = [...text.matchAll(/static const char k.*?Id\[\](.|\n)*?;/g)].map(
      ([match]) => match.replace(/\n/, '')
    );
    const errorConstsToIds = errorConstsToIdsCode.map(txt => [
      txt.match(/char (k.*?)\[/)[1],
      txt.match(/ "(.*?)"/)[1],
    ]);
    const errorConstsToIdsDict = Object.fromEntries(errorConstsToIds);

    chromiumErrorIds = handledErrorConsts.map(varName => {
      if (!errorConstsToIdsDict[varName]) throw new Error(`Error const (${varName}) not found!`);
      return errorConstsToIdsDict[varName];
    }).sort();
  });

  it('should notify us if something changed', () => {
    expect(chromiumErrorIds).toMatchInlineSnapshot(`
Array [
  "already-installed",
  "cannot-download-icon",
  "ids-do-not-match",
  "in-incognito",
  "manifest-display-not-supported",
  "manifest-display-override-not-supported",
  "manifest-empty",
  "manifest-location-changed",
  "manifest-missing-name-or-short-name",
  "manifest-missing-suitable-icon",
  "no-acceptable-icon",
  "no-icon-available",
  "no-id-specified",
  "no-manifest",
  "no-matching-service-worker",
  "no-url-for-service-worker",
  "not-from-secure-origin",
  "not-offline-capable",
  "pipeline-restarted",
  "platform-not-supported-on-android",
  "prefer-related-applications",
  "prefer-related-applications-only-beta-stable",
  "start-url-not-valid",
  "url-not-supported-for-webapk",
  "warn-not-offline-capable",
]
`);
  });

  it('are each handled explicitly in the gatherer', () => {
    const errorStrings = Object.keys(InstallableManifestAudit.UIStrings)
      .filter(key => chromiumErrorIds.includes(key))
      .sort();
    expect(errorStrings).toEqual(chromiumErrorIds);
  });
});
