/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

import fs from 'fs';
import fetch from 'node-fetch';
import { LH_ROOT } from '../../root.js';

const inspectorIssuesGathererPath = LH_ROOT +
  '/core/gather/gatherers/inspector-issues.js';
const inspectorIssuesGathererSource = fs.readFileSync(inspectorIssuesGathererPath, 'utf-8');

describe('issueAdded types', () => {
  /** @type {Array<LH.Crdp.Audits.InspectorIssueDetails>} */
  let inspectorIssueDetailsTypes;

  before(async () => {
    const browserProtocolUrl =
      'https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json';
    const json = await fetch(browserProtocolUrl).then(r => r.json());

    inspectorIssueDetailsTypes = json.domains
      .find(d => d.domain === 'Audits').types
      .find(t => t.id === 'InspectorIssueDetails').properties
      .map(t => t.name)
      .sort();
  });

  it('should notify us if something changed', () => {
    expect(inspectorIssueDetailsTypes).toMatchInlineSnapshot(`
Array [
  "attributionReportingIssueDetails",
  "blockedByResponseIssueDetails",
  "clientHintIssueDetails",
  "contentSecurityPolicyIssueDetails",
  "cookieIssueDetails",
  "corsIssueDetails",
  "deprecationIssueDetails",
  "federatedAuthRequestIssueDetails",
  "genericIssueDetails",
  "heavyAdIssueDetails",
  "lowTextContrastIssueDetails",
  "mixedContentIssueDetails",
  "navigatorUserAgentIssueDetails",
  "quirksModeIssueDetails",
  "sharedArrayBufferIssueDetails",
  "twaQualityEnforcementDetails",
]
`);
  });

  // TODO: https://github.com/GoogleChrome/lighthouse/issues/13147
  it.skip('are each handled explicitly in the gatherer', () => {
    // Regex relies on the typecasts
    const sourceTypeMatches = inspectorIssuesGathererSource.matchAll(
      /LH\.Crdp\.Audits\.(.*?Details)>/g
    );

    const sourceTypeMatchIds = [...sourceTypeMatches]
      .map(match => match[1])
      // mapping TS type casing (TitleCase) to protocol types (camelCase)
      .map(id => `${id.slice(0, 1).toLowerCase()}${id.slice(1)}`)
      .sort();

    expect(sourceTypeMatchIds).toMatchObject(inspectorIssueDetailsTypes);
  });
});
