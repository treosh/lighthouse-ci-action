/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const stackPacks = require('lighthouse-stack-packs');
const i18n = require('./i18n/i18n.js');

/**
 * Pairs consisting of a stack pack's ID and the set of stacks needed to be
 * detected in a page to display that pack's advice.
 * @type {Array<{packId: string, requiredStacks: Array<string>}>}
 */
const stackPacksToInclude = [
  {
    packId: 'wordpress',
    requiredStacks: ['js:wordpress'],
  },
  {
    packId: 'ezoic',
    requiredStacks: ['js:ezoic'],
  },
  {
    packId: 'drupal',
    requiredStacks: ['js:drupal'],
  },
  {
    packId: 'amp',
    requiredStacks: ['js:amp'],
  },
  {
    packId: 'magento',
    requiredStacks: ['js:magento'],
  },
  {
    packId: 'octobercms',
    requiredStacks: ['js:octobercms'],
  },
  {
    packId: 'joomla',
    requiredStacks: ['js:joomla'],
  },
  {
    packId: 'next.js',
    requiredStacks: ['js:next'],
  },
  {
    packId: 'nuxt',
    requiredStacks: ['js:nuxt'],
  },
  {
    packId: 'angular',
    requiredStacks: ['js:@angular/core'],
  },
  {
    packId: 'react',
    requiredStacks: ['js:react'],
  },
];

/**
 * Returns all packs that match the stacks found in the page.
 * @param {LH.Artifacts['Stacks']} pageStacks
 * @return {LH.RawIcu<Array<LH.Result.StackPack>>}
 */
function getStackPacks(pageStacks) {
  /** @type {LH.RawIcu<Array<LH.Result.StackPack>>} */
  const packs = [];

  for (const pageStack of pageStacks) {
    const stackPackToIncl = stackPacksToInclude.find(stackPackToIncl =>
      stackPackToIncl.requiredStacks.includes(`${pageStack.detector}:${pageStack.id}`));
    if (!stackPackToIncl) {
      continue;
    }

    // Grab the full pack definition.
    const matchedPack = stackPacks.find(pack => pack.id === stackPackToIncl.packId);
    if (!matchedPack) {
      log.warn('StackPacks',
        `'${stackPackToIncl.packId}' stack pack was matched but is not found in stack-packs lib`);
      continue;
    }

    // Create i18n handler to get translated strings.
    const str_ = i18n.createMessageInstanceIdFn(
      `node_modules/lighthouse-stack-packs/packs/${matchedPack.id}.js`,
      matchedPack.UIStrings
    );

    /** @type {Record<string, LH.IcuMessage>} */
    const descriptions = {};
    /** @type {Record<string, string>} */
    const UIStrings = matchedPack.UIStrings;

    // Convert all strings into the correct translation.
    for (const key in UIStrings) {
      if (UIStrings[key]) {
        descriptions[key] = str_(UIStrings[key]);
      }
    }

    packs.push({
      id: matchedPack.id,
      title: matchedPack.title,
      iconDataURL: matchedPack.icon,
      descriptions,
    });
  }

  return packs;
}

module.exports = {
  getStackPacks,
  stackPacksToInclude,
};
