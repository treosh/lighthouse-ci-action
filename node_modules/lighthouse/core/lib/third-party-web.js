/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import thirdPartyWeb from 'third-party-web/nostats-subset.js';

/** @typedef {import("third-party-web").IEntity} ThirdPartyEntity */
/** @typedef {import("third-party-web").IProduct} ThirdPartyProduct */

/**
 * @param {string} url
 * @return {ThirdPartyEntity|undefined}
 */
function getEntity(url) {
  return thirdPartyWeb.getEntity(url);
}

/**
 * @param {string} url
 * @return {ThirdPartyProduct|undefined}
 */
function getProduct(url) {
  return thirdPartyWeb.getProduct(url);
}

/**
 * @param {string} url
 * @param {ThirdPartyEntity | undefined} mainDocumentEntity
 */
function isThirdParty(url, mainDocumentEntity) {
  const entity = getEntity(url);
  if (!entity) return false;
  if (entity === mainDocumentEntity) return false;
  return true;
}

/**
 * @param {string} url
 * @param {ThirdPartyEntity | undefined} mainDocumentEntity
 */
function isFirstParty(url, mainDocumentEntity) {
  return !isThirdParty(url, mainDocumentEntity);
}

export default {
  getEntity,
  getProduct,
  isThirdParty,
  isFirstParty,
};
