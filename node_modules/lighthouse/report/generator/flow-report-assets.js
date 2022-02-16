/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fs = require('fs');

/* eslint-disable max-len */
const FLOW_REPORT_TEMPLATE = fs.readFileSync(`${__dirname}/../../flow-report/assets/standalone-flow-template.html`, 'utf8');
const REGULAR_REPORT_CSS = fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8');
const FLOW_REPORT_CSS = fs.readFileSync(`${__dirname}/../../flow-report/assets/styles.css`, 'utf8');
const FLOW_REPORT_JAVASCRIPT = fs.readFileSync(`${__dirname}/../../dist/report/flow.js`, 'utf8');
/* eslint-enable max-len */

module.exports = {
  FLOW_REPORT_TEMPLATE,
  FLOW_REPORT_CSS: [REGULAR_REPORT_CSS, FLOW_REPORT_CSS].join('\n'),
  FLOW_REPORT_JAVASCRIPT,
};
