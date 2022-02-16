/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * eslint does not support ESM rc files, so this must be a .cjs file.
 * @see https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats
 * @see https://github.com/eslint/eslint/issues/13481
 */

module.exports = {
  env: {
    browser: true,
  },
  rules: {
    // TODO(esmodules): move to root eslint when all code is ESM
    // or when this is resolved: https://github.com/import-js/eslint-plugin-import/issues/2214
    'import/order': [2, {
      'groups': [
        'builtin',
        'external',
        ['sibling', 'parent'],
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
    }],
    'import/group-exports': 2,
    'import/exports-last': 2,
  },
};
