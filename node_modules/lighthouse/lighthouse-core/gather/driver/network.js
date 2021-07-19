/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const NetworkRequest = require('../../lib/network-request.js');

/**
 * Return the body of the response with the given ID. Rejects if getting the
 * body times out.
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {string} requestId
 * @param {number} [timeout]
 * @return {Promise<string>}
 */
async function fetchResponseBodyFromCache(session, requestId, timeout = 1000) {
  requestId = NetworkRequest.getRequestIdForBackend(requestId);

  // Encoding issues may lead to hanging getResponseBody calls: https://github.com/GoogleChrome/lighthouse/pull/4718
  // session.sendCommand will handle timeout after 1s.
  session.setNextProtocolTimeout(timeout);
  const result = await session.sendCommand('Network.getResponseBody', {requestId});
  return result.body;
}

module.exports = {fetchResponseBodyFromCache};
