/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Construct the legacy default config from the standard default config.
 */

import defaultConfig from '../../config/default-config.js';

/** @type {LH.Config} */
const legacyDefaultConfig = JSON.parse(JSON.stringify(defaultConfig));
if (!legacyDefaultConfig.categories) {
  throw new Error('Default config should always have categories');
}

// These properties are ignored in Legacy navigations.
delete legacyDefaultConfig.artifacts;

// These audits don't work in Legacy navigation mode so we remove them.
const unsupportedAuditIds = [
  'experimental-interaction-to-next-paint',
  'uses-responsive-images-snapshot',
  'work-during-interaction',
];

legacyDefaultConfig.audits = legacyDefaultConfig.audits?.filter(audit =>
  !unsupportedAuditIds.find(auditId => audit.toString().endsWith(auditId)));

legacyDefaultConfig.categories['performance'].auditRefs =
  legacyDefaultConfig.categories['performance'].auditRefs.filter(auditRef =>
    !unsupportedAuditIds.includes(auditRef.id));

legacyDefaultConfig.passes = [{
  passName: 'defaultPass',
  recordTrace: true,
  useThrottling: true,
  pauseAfterFcpMs: 1000,
  pauseAfterLoadMs: 1000,
  networkQuietThresholdMs: 1000,
  cpuQuietThresholdMs: 1000,
  gatherers: [
    'css-usage',
    'js-usage',
    'viewport-dimensions',
    'console-messages',
    'anchor-elements',
    'image-elements',
    'link-elements',
    'meta-elements',
    'script-elements',
    'scripts',
    'iframe-elements',
    'inputs',
    'main-document-content',
    'global-listeners',
    'dobetterweb/doctype',
    'dobetterweb/domstats',
    'dobetterweb/optimized-images',
    'dobetterweb/response-compression',
    'dobetterweb/tags-blocking-first-paint',
    'seo/font-size',
    'seo/embedded-content',
    'seo/robots-txt',
    'seo/tap-targets',
    'accessibility',
    'trace-elements',
    'inspector-issues',
    'source-maps',
    'web-app-manifest',
    'installability-errors',
    'stacks',
    'full-page-screenshot',
    'bf-cache-failures',
  ],
},
{
  passName: 'offlinePass',
  loadFailureMode: 'ignore',
  gatherers: [
    'service-worker',
  ],
}];

export default legacyDefaultConfig;
