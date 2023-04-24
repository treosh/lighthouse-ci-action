/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// This file is used to generate a bundle that can be imported
// into an esmodules codebase to render the lighthouse report.
// Currently, embedders must handle some boilerplate themselves (like standalone.js)
// until we work out a common rendering interface.
// See: https://github.com/GoogleChrome/lighthouse/pull/12623

// Modify core/scripts/roll-to-devtools.sh if exports change.
export {DOM} from '../renderer/dom.js';
export {ReportRenderer} from '../renderer/report-renderer.js';
export {ReportUIFeatures} from '../renderer/report-ui-features.js';
export {renderReport} from '../renderer/api.js';
export {swapLocale, format} from '../../shared/localization/i18n-module.js';
