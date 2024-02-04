/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Base class for boolean audits that can have multiple reasons for failure
 */

import {Audit} from './audit.js';

class MultiCheckAudit extends Audit {
  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const multiProduct = await this.audit_(artifacts, context);
    return this.createAuditProduct(multiProduct);
  }

  /**
   * @param {{failures: Array<string>, manifestValues?: LH.Artifacts.ManifestValues}} result
   * @return {LH.Audit.Product}
   */
  static createAuditProduct(result) {
    /** @type {LH.Audit.MultiCheckAuditDetails} */
    const detailsItem = {
      ...result,
      ...result.manifestValues,
      manifestValues: undefined,
      allChecks: undefined,
    };

    if (result.manifestValues?.allChecks) {
      result.manifestValues.allChecks.forEach(check => {
        detailsItem[check.id] = check.passing;
      });
    }

    // Include the detailed pass/fail checklist as a diagnostic.
    /** @type {LH.Audit.Details.DebugData} */
    const details = {
      type: 'debugdata',
      // TODO: Consider not nesting detailsItem under `items`.
      items: [detailsItem],
    };

    // If we fail, share the failures
    if (result.failures.length > 0) {
      return {
        score: 0,
        // TODO(#11495): make this i18n-able.
        explanation: `Failures: ${result.failures.join(',\n')}.`,
        details,
      };
    }

    // Otherwise, we pass
    return {
      score: 1,
      details,
    };
  }

  /* eslint-disable no-unused-vars */

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<{failures: Array<string>, manifestValues?: LH.Artifacts.ManifestValues}>}
   */
  static audit_(artifacts, context) {
    throw new Error('audit_ unimplemented');
  }

  /* eslint-enable no-unused-vars */
}

export default MultiCheckAudit;
