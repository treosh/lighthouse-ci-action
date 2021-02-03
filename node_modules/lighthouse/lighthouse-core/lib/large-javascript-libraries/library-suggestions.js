/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview This file contains a mapping of large JavaScript libraries to smaller alternatives.
 * These suggestions have been cherry-picked from BundlePhobia's open-source list of recommendations which can be found here (https://github.com/pastelsky/bundlephobia/blob/b244a53bc55af067bb0edfa3ace867c87fec17e7/server/middlewares/similar-packages/fixtures.js).
 */

'use strict';

/** @type {Record<string, string[]>} */
const suggestions = {
  // general-purpose-date-time
  'moment': ['date-fns', 'luxon', 'dayjs'],
};

module.exports = {suggestions};
