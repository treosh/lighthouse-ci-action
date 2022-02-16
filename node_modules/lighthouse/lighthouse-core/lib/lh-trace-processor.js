/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const LHError = require('../lib/lh-error.js');
const TraceProcessor = require('../lib/tracehouse/trace-processor.js');

// TraceProcessor throws generic errors, but we'd like our special localized and code-specific LHError
// objects to be thrown instead.
class LHTraceProcessor extends TraceProcessor {
  /**
   * @return {Error}
   */
  static createNoNavstartError() {
    return new LHError(LHError.errors.NO_NAVSTART);
  }

  /**
   * This isn't currently used, but will be when the time origin of trace processing is changed.
   * @see {TraceProcessor.computeTimeOrigin}
   * @see https://github.com/GoogleChrome/lighthouse/pull/11253#discussion_r507985527
   * @return {Error}
   */
  static createNoResourceSendRequestError() {
    return new LHError(LHError.errors.NO_RESOURCE_REQUEST);
  }

  /**
   * @return {Error}
   */
  static createNoTracingStartedError() {
    return new LHError(LHError.errors.NO_TRACING_STARTED);
  }

  /**
   * @return {Error}
   */
  static createNoFirstContentfulPaintError() {
    return new LHError(LHError.errors.NO_FCP);
  }
}

module.exports = LHTraceProcessor;
