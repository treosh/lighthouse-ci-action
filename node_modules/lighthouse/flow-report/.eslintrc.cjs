/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

module.exports = {
  extends: '../.eslintrc.js',
  env: {
    node: true,
    browser: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
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
    '@typescript-eslint/type-annotation-spacing': 2,
  },
  overrides: [
    // TS already handles this issue.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
};
