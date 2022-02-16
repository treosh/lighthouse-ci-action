/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

// go/lh-audit-metric-mapping
const fcpRelevantAudits = [
  'server-response-time',
  'render-blocking-resources',
  'redirects',
  'critical-request-chains',
  'uses-text-compression',
  'uses-rel-preconnect',
  'uses-rel-preload',
  'font-display',
  'unminified-javascript',
  'unminified-css',
  'unused-css-rules',
];

const lcpRelevantAudits = [
  ...fcpRelevantAudits,
  'largest-contentful-paint-element',
  'preload-lcp-image',
  'unused-javascript',
  'efficient-animated-content',
  'total-byte-weight',
];

const tbtRelevantAudits = [
  'long-tasks',
  'third-party-summary',
  'third-party-facades',
  'bootup-time',
  'mainthread-work-breakdown',
  'dom-size',
  'duplicated-javascript',
  'legacy-javascript',
  'viewport',
];

const clsRelevantAudits = [
  'layout-shift-elements',
  'non-composited-animations',
  'unsized-images',
  // 'preload-fonts', // actually in BP, rather than perf
];

module.exports = {
  fcpRelevantAudits,
  lcpRelevantAudits,
  tbtRelevantAudits,
  clsRelevantAudits,
};
