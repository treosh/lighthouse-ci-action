/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');

/* eslint-env browser, node */

/**
 * @return {LH.Artifacts['FormElements']}
 */
/* istanbul ignore next */
function collectFormElements() {
  // @ts-expect-error - put into scope via stringification
  const formChildren = getElementsInDocument('textarea, input, label, select'); // eslint-disable-line no-undef
  /** @type {Map<HTMLFormElement|string, LH.Artifacts.Form>} */
  const forms = new Map();
  /** @type {LH.Artifacts.Form} */
  const formlessObj = {
    inputs: [],
    labels: [],
  };
  for (const child of formChildren) {
    const isButton = child instanceof HTMLInputElement &&
      (child.type === 'submit' || child.type === 'button');
    if (isButton) continue;

    const parentFormElement = child.form;
    const hasForm = !!parentFormElement;
    if (hasForm && !forms.has(parentFormElement)) {
      const newFormObj = {
        attributes: {
          id: parentFormElement.id,
          name: parentFormElement.name,
          autocomplete: parentFormElement.autocomplete,
          // @ts-expect-error - put into scope via stringification
          nodeLabel: getNodeLabel(parentFormElement), // eslint-disable-line no-undef,
          // @ts-expect-error - put into scope via stringification
          snippet: getOuterHTMLSnippet(parentFormElement), // eslint-disable-line no-undef
        },
        inputs: [],
        labels: [],
      };
      forms.set(parentFormElement, newFormObj);
    }
    const formObj = forms.get(parentFormElement) || formlessObj;

    if (child instanceof HTMLInputElement || child instanceof HTMLTextAreaElement
      || child instanceof HTMLSelectElement) {
      formObj.inputs.push({
        id: child.id,
        name: child.name,
        placeholder: child instanceof HTMLSelectElement ? undefined : child.placeholder,
        autocomplete: child.autocomplete,
        // @ts-expect-error - put into scope via stringification
        nodeLabel: getNodeLabel(child), // eslint-disable-line no-undef,
        // @ts-expect-error - put into scope via stringification
        snippet: getOuterHTMLSnippet(child), // eslint-disable-line no-undef
      });
    }
    if (child instanceof HTMLLabelElement) {
      formObj.labels.push({
        for: child.htmlFor,
        // @ts-expect-error - put into scope via stringification
        nodeLabel: getNodeLabel(child), // eslint-disable-line no-undef,
        // @ts-expect-error - put into scope via stringification
        snippet: getOuterHTMLSnippet(child), // eslint-disable-line no-undef
      });
    }
  }

  if (formlessObj.inputs.length > 0 || formlessObj.labels.length > 0) {
    forms.set('formless', {
      inputs: formlessObj.inputs,
      labels: formlessObj.labels,
    });
  }
  return [...forms.values()];
}

class FormElements extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['FormElements']>}
   */
  async afterPass(passContext) {
    const driver = passContext.driver;

    const expression = `(() => {
      ${pageFunctions.getElementsInDocumentString};
      ${pageFunctions.getOuterHTMLSnippetString};
      ${pageFunctions.getNodeLabelString};
      return (${collectFormElements})();
    })()`;

    /** @type {LH.Artifacts['FormElements']} */
    const formElements = await driver.evaluateAsync(expression, {useIsolation: true});
    return formElements;
  }
}

module.exports = FormElements;
