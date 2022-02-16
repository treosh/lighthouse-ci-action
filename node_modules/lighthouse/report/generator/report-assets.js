/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fs = require('fs');

const flowReportAssets = require('./flow-report-assets.js');

const REPORT_TEMPLATE = fs.readFileSync(__dirname + '/../assets/standalone-template.html',
    'utf8');
const REPORT_JAVASCRIPT = fs.readFileSync(__dirname + '/../../dist/report/standalone.js', 'utf8');

module.exports = {
  REPORT_TEMPLATE,
  REPORT_JAVASCRIPT,
  // Flow report assets are not needed for every bundle.
  // Replacing/ignoring flow-report-assets.js (e.g. `rollupPlugins.shim`) will
  // remove the flow assets from the bundle.
  ...flowReportAssets,
};
