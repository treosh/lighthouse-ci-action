/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* global getNodeDetails */

const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');

/* eslint-env browser, node */

/**
 * @return {LH.Artifacts['Inputs']}
 */
/* c8 ignore start */
function collectElements() {
  /** @type {LH.Artifacts.InputElement[]} */
  const inputArtifacts = [];
  /** @type {Map<HTMLFormElement, LH.Artifacts.FormElement>} */
  const formElToArtifact = new Map();
  /** @type {Map<HTMLLabelElement, LH.Artifacts.LabelElement>} */
  const labelElToArtifact = new Map();

  /** @type {HTMLFormElement[]} */
  // @ts-expect-error - put into scope via stringification
  const formEls = getElementsInDocument('form'); // eslint-disable-line no-undef
  for (const formEl of formEls) {
    formElToArtifact.set(formEl, {
      id: formEl.id,
      name: formEl.name,
      autocomplete: formEl.autocomplete,
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(formEl),
    });
  }

  /** @type {HTMLLabelElement[]} */
  // @ts-expect-error - put into scope via stringification
  const labelEls = getElementsInDocument('label'); // eslint-disable-line no-undef
  for (const labelEl of labelEls) {
    labelElToArtifact.set(labelEl, {
      for: labelEl.htmlFor,
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(labelEl),
    });
  }

  /** @type {HTMLInputElement[]} */
  // @ts-expect-error - put into scope via stringification
  const inputEls = getElementsInDocument('textarea, input, select'); // eslint-disable-line no-undef
  for (const inputEl of inputEls) {
    // If the input element is in a form (either because an ancestor element is <form> or the
    // form= attribute is associated with a <form> element's id), this will be set.
    const parentFormEl = inputEl.form;
    const parentFormIndex = parentFormEl ?
      [...formElToArtifact.keys()].indexOf(parentFormEl) :
      undefined;
    const labelIndices = [...inputEl.labels || []].map((labelEl) => {
      return [...labelElToArtifact.keys()].indexOf(labelEl);
    });

    inputArtifacts.push({
      parentFormIndex,
      labelIndices,
      id: inputEl.id,
      name: inputEl.name,
      type: inputEl.type,
      placeholder: inputEl instanceof HTMLSelectElement ? undefined : inputEl.placeholder,
      autocomplete: {
        property: inputEl.autocomplete,
        attribute: inputEl.getAttribute('autocomplete'),
        // Requires `--enable-features=AutofillShowTypePredictions`.
        prediction: inputEl.getAttribute('autofill-prediction'),
      },
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(inputEl),
    });
  }

  return {
    inputs: inputArtifacts,
    forms: [...formElToArtifact.values()],
    labels: [...labelElToArtifact.values()],
  };
}
/* c8 ignore stop */

class Inputs extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<LH.Artifacts['Inputs']>}
   */
  async getArtifact(passContext) {
    return passContext.driver.executionContext.evaluate(collectElements, {
      args: [],
      useIsolation: true,
      deps: [
        pageFunctions.getElementsInDocumentString,
        pageFunctions.getNodeDetailsString,
      ],
    });
  }
}

module.exports = Inputs;
