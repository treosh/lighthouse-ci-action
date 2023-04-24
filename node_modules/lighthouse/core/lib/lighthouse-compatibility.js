/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Util} from '../../shared/util.js';

const SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';

/** @typedef {import('../../types/lhr/audit-details').default.ItemValueType} ItemValueType */

/**
 * Upgrades an lhr object in-place to account for changes in the data structure over major versions.
 * @param {LH.Result} lhr
 */
function upgradeLhrForCompatibility(lhr) {
  // If LHR is older (≤3.0.3), it has no locale setting. Set default.
  if (!lhr.configSettings.locale) {
    lhr.configSettings.locale = 'en';
  }
  if (!lhr.configSettings.formFactor) {
    // @ts-expect-error fallback handling for emulatedFormFactor
    lhr.configSettings.formFactor = lhr.configSettings.emulatedFormFactor;
  }

  lhr.finalDisplayedUrl = Util.getFinalDisplayedUrl(lhr);
  lhr.mainDocumentUrl = Util.getMainDocumentUrl(lhr);

  for (const audit of Object.values(lhr.audits)) {
    // Turn 'not-applicable' (LHR <4.0) and 'not_applicable' (older proto versions)
    // into 'notApplicable' (LHR ≥4.0).
    // @ts-expect-error tsc rightly flags that these values shouldn't occur.
    // eslint-disable-next-line max-len
    if (audit.scoreDisplayMode === 'not_applicable' || audit.scoreDisplayMode === 'not-applicable') {
      audit.scoreDisplayMode = 'notApplicable';
    }

    if (audit.details) {
      // Turn `auditDetails.type` of undefined (LHR <4.2) and 'diagnostic' (LHR <5.0)
      // into 'debugdata' (LHR ≥5.0).
      // @ts-expect-error tsc rightly flags that these values shouldn't occur.
      if (audit.details.type === undefined || audit.details.type === 'diagnostic') {
        // @ts-expect-error details is of type never.
        audit.details.type = 'debugdata';
      }

      // Add the jpg data URL prefix to filmstrip screenshots without them (LHR <5.0).
      if (audit.details.type === 'filmstrip') {
        for (const screenshot of audit.details.items) {
          if (!screenshot.data.startsWith(SCREENSHOT_PREFIX)) {
            screenshot.data = SCREENSHOT_PREFIX + screenshot.data;
          }
        }
      }

      // Circa 10.0, table items were refactored.
      if (audit.details.type === 'table') {
        for (const heading of audit.details.headings) {
          /** @type {{itemType: ItemValueType|undefined, text: string|undefined}} */
          // @ts-expect-error
          const {itemType, text} = heading;
          if (itemType !== undefined) {
            heading.valueType = itemType;
            // @ts-expect-error
            delete heading.itemType;
          }
          if (text !== undefined) {
            heading.label = text;
            // @ts-expect-error
            delete heading.text;
          }

          // @ts-expect-error
          const subItemsItemType = heading.subItemsHeading?.itemType;
          if (heading.subItemsHeading && subItemsItemType !== undefined) {
            heading.subItemsHeading.valueType = subItemsItemType;
            // @ts-expect-error
            delete heading.subItemsHeading.itemType;
          }
        }
      }

      // In 10.0, third-party-summary deprecated entity: LinkValue and switched to entity name string
      if (audit.id === 'third-party-summary') {
        if (audit.details.type === 'opportunity' || audit.details.type === 'table') {
          const {headings, items} = audit.details;
          if (headings[0].valueType === 'link') {
            // Apply upgrade only if we are dealing with an older version (valueType=link marker).
            headings[0].valueType = 'text';
            for (const item of items) {
              if (typeof item.entity === 'object' && item.entity.type === 'link') {
                item.entity = item.entity.text;
              }
            }
            audit.details.isEntityGrouped = true;
          }
        }
      }

      // TODO: convert printf-style displayValue.
      // Added:   #5099, v3
      // Removed: #6767, v4
    }
  }

  // This backcompat converts old LHRs (<9.0.0) to use the new "hidden" group.
  // Old LHRs used "no group" to identify audits that should be hidden in performance instead of the "hidden" group.
  // Newer LHRs use "no group" to identify opportunities and diagnostics whose groups are assigned by details type.
  const [majorVersion] = lhr.lighthouseVersion.split('.').map(Number);
  const perfCategory = lhr.categories['performance'];
  if (majorVersion < 9 && perfCategory) {
    if (!lhr.categoryGroups) lhr.categoryGroups = {};
    lhr.categoryGroups['hidden'] = {title: ''};
    for (const auditRef of perfCategory.auditRefs) {
      if (!auditRef.group) {
        auditRef.group = 'hidden';
      } else if (['load-opportunities', 'diagnostics'].includes(auditRef.group)) {
        delete auditRef.group;
      }
    }
  }

  // Add some minimal stuff so older reports still work.
  if (!lhr.environment) {
    lhr.environment = {
      benchmarkIndex: 0,
      networkUserAgent: lhr.userAgent,
      hostUserAgent: lhr.userAgent,
    };
  }
  if (!lhr.configSettings.screenEmulation) {
    lhr.configSettings.screenEmulation = {
      width: -1,
      height: -1,
      deviceScaleFactor: -1,
      mobile: /mobile/i.test(lhr.environment.hostUserAgent),
      disabled: false,
    };
  }
  if (!lhr.i18n) {
    // @ts-expect-error
    lhr.i18n = {};
  }

  // In 10.0, full-page-screenshot became a top-level property on the LHR.
  if (lhr.audits['full-page-screenshot']) {
    const details = /** @type {LH.Result.FullPageScreenshot=} */ (
      lhr.audits['full-page-screenshot'].details);
    if (details) {
      lhr.fullPageScreenshot = {
        screenshot: details.screenshot,
        nodes: details.nodes,
      };
    } else {
      lhr.fullPageScreenshot = null;
    }
    delete lhr.audits['full-page-screenshot'];
  }
}

export {
  upgradeLhrForCompatibility,
};
