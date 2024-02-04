/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Checks that links, buttons, etc. are sufficiently large and that there's
 * no other tap target that's too close so that the user might accidentally tap on.
 */

import {Audit} from '../audit.js';
import {ViewportMeta} from '../../computed/viewport-meta.js';
import {
  rectsTouchOrOverlap,
  getRectOverlapArea,
  getRectAtCenter,
  allRectsContainedWithinEachOther,
  getLargestRect,
  getBoundingRectWithPadding,
} from '../../lib/rect-helpers.js';
import {getTappableRectsFromClientRects} from '../../lib/tappable-rects.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on whether tap targets (like buttons and links) on a page are big enough so they can easily be tapped on a mobile device. This descriptive title is shown when tap targets are easy to tap on. */
  title: 'Tap targets are sized appropriately',
  /** Descriptive title of a Lighthouse audit that provides detail on whether tap targets (like buttons and links) on a page are big enough so they can easily be tapped on a mobile device. This descriptive title is shown when tap targets are not easy to tap on. */
  failureTitle: 'Tap targets are not sized appropriately',
  /** Description of a Lighthouse audit that tells the user why buttons and links need to be big enough and what 'big enough' means. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Interactive elements like buttons and links should be large enough (48x48px), or have enough space around them, to be easy enough to tap without overlapping onto other elements. [Learn more about tap targets](https://developer.chrome.com/docs/lighthouse/seo/tap-targets/).',
  /** Label of a table column that identifies tap targets (like buttons and links) that have failed the audit and aren't easy to tap on. */
  tapTargetHeader: 'Tap Target',
  /** Label of a table column that identifies a tap target (like a link or button) that overlaps with another tap target. */
  overlappingTargetHeader: 'Overlapping Target',
  /** Explanatory message stating that there was a failure in an audit caused by the viewport meta tag not being optimized for mobile screens, which caused tap targets like buttons and links to be too small to tap on. */
  /* eslint-disable-next-line max-len */
  explanationViewportMetaNotOptimized: 'Tap targets are too small because there\'s no viewport meta tag optimized for mobile screens',
  /** Explanatory message stating that a certain percentage of the tap targets (like buttons and links) on the page are of an appropriately large size. */
  displayValue: '{decimalProportion, number, percent} appropriately sized tap targets',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

const FINGER_SIZE_PX = 48;
// Ratio of the finger area tapping on an unintended element
// to the finger area tapping on the intended element
const MAX_ACCEPTABLE_OVERLAP_SCORE_RATIO = 0.25;

/**
 * Returns a tap target augmented with a bounding rect for quick overlapping
 * rejections. Rect contains all the client rects, padded to half FINGER_SIZE_PX.
 * @param {LH.Artifacts.TapTarget[]} targets
 * @return {BoundedTapTarget[]}
 */
function getBoundedTapTargets(targets) {
  return targets.map(tapTarget => {
    return {
      tapTarget,
      paddedBoundsRect: getBoundingRectWithPadding(tapTarget.clientRects, FINGER_SIZE_PX),
    };
  });
}

/**
 * @param {LH.Artifacts.Rect} cr
 */
function clientRectBelowMinimumSize(cr) {
  return cr.width < FINGER_SIZE_PX || cr.height < FINGER_SIZE_PX;
}

/**
 * A target is "too small" if none of its clientRects are at least the size of a finger.
 * @param {BoundedTapTarget[]} targets
 * @return {BoundedTapTarget[]}
 */
function getTooSmallTargets(targets) {
  return targets.filter(target => {
    return target.tapTarget.clientRects.every(clientRectBelowMinimumSize);
  });
}

/**
 * @param {BoundedTapTarget[]} tooSmallTargets
 * @param {BoundedTapTarget[]} allTargets
 * @return {TapTargetOverlapFailure[]}
 */
function getAllOverlapFailures(tooSmallTargets, allTargets) {
  /** @type {TapTargetOverlapFailure[]} */
  const failures = [];

  tooSmallTargets.forEach(target => {
    // Convert client rects to unique tappable areas from a user's perspective
    const tappableRects = getTappableRectsFromClientRects(target.tapTarget.clientRects);

    for (const maybeOverlappingTarget of allTargets) {
      if (maybeOverlappingTarget === target) {
        // Checking the same target with itself, skip.
        continue;
      }

      if (!rectsTouchOrOverlap(target.paddedBoundsRect, maybeOverlappingTarget.paddedBoundsRect)) {
        // Bounding boxes (padded with half FINGER_SIZE_PX) don't overlap, skip.
        continue;
      }

      if (target.tapTarget.href === maybeOverlappingTarget.tapTarget.href) {
        const isHttpOrHttpsLink = /https?:\/\//.test(target.tapTarget.href);
        if (isHttpOrHttpsLink) {
          // No overlap because same target action, skip.
          continue;
        }
      }

      const maybeOverlappingRects = maybeOverlappingTarget.tapTarget.clientRects;
      if (allRectsContainedWithinEachOther(tappableRects, maybeOverlappingRects)) {
        // If one tap target is fully contained within the other that's
        // probably intentional (e.g. an item with a delete button inside).
        // We'll miss some problems because of this, but that's better
        // than falsely reporting a failure.
        continue;
      }

      const rectFailure = getOverlapFailureForTargetPair(tappableRects, maybeOverlappingRects);
      if (rectFailure) {
        failures.push({
          ...rectFailure,
          tapTarget: target.tapTarget,
          overlappingTarget: maybeOverlappingTarget.tapTarget,
        });
      }
    }
  });

  return failures;
}

/**
 * @param {LH.Artifacts.Rect[]} tappableRects
 * @param {LH.Artifacts.Rect[]} maybeOverlappingRects
 * @return {ClientRectOverlapFailure | null}
 */
function getOverlapFailureForTargetPair(tappableRects, maybeOverlappingRects) {
  /** @type ClientRectOverlapFailure | null */
  let greatestFailure = null;

  for (const targetCR of tappableRects) {
    const fingerRect = getRectAtCenter(targetCR, FINGER_SIZE_PX);
    // Score indicates how much of the finger area overlaps each target when the user
    // taps on the center of targetCR
    const tapTargetScore = getRectOverlapArea(fingerRect, targetCR);

    for (const maybeOverlappingCR of maybeOverlappingRects) {
      const overlappingTargetScore = getRectOverlapArea(fingerRect, maybeOverlappingCR);

      const overlapScoreRatio = overlappingTargetScore / tapTargetScore;
      if (overlapScoreRatio < MAX_ACCEPTABLE_OVERLAP_SCORE_RATIO) {
        // low score means it's clear that the user tried to tap on the targetCR,
        // rather than the other tap target client rect
        continue;
      }

      // only update our state if this was the biggest failure we've seen for this pair
      if (!greatestFailure || overlapScoreRatio > greatestFailure.overlapScoreRatio) {
        greatestFailure = {
          overlapScoreRatio,
          tapTargetScore,
          overlappingTargetScore,
        };
      }
    }
  }
  return greatestFailure;
}

/**
 * Only report one failure if two targets overlap each other
 * @param {TapTargetOverlapFailure[]} overlapFailures
 * @return {TapTargetOverlapFailure[]}
 */
function mergeSymmetricFailures(overlapFailures) {
  /** @type TapTargetOverlapFailure[] */
  const failuresAfterMerging = [];

  overlapFailures.forEach((failure, overlapFailureIndex) => {
    const symmetricFailure = overlapFailures.find(f =>
      f.tapTarget === failure.overlappingTarget &&
      f.overlappingTarget === failure.tapTarget
    );

    if (!symmetricFailure) {
      failuresAfterMerging.push(failure);
      return;
    }

    const {overlapScoreRatio: failureOSR} = failure;
    const {overlapScoreRatio: symmetricOSR} = symmetricFailure;
    // Push if:
    // - the current failure has a higher OSR
    // - OSRs are the same, and the current failure comes before its symmetric partner in the list
    // Otherwise do nothing and let the symmetric partner be pushed later.
    if (failureOSR > symmetricOSR || (
      failureOSR === symmetricOSR &&
      overlapFailureIndex < overlapFailures.indexOf(symmetricFailure)
    )) {
      failuresAfterMerging.push(failure);
    }
  });

  return failuresAfterMerging;
}

/**
 * @param {TapTargetOverlapFailure[]} overlapFailures
 * @return {TapTargetTableItem[]}
 */
function getTableItems(overlapFailures) {
  const tableItems = overlapFailures.map(failure => {
    const largestCR = getLargestRect(failure.tapTarget.clientRects);
    const width = Math.floor(largestCR.width);
    const height = Math.floor(largestCR.height);
    const size = width + 'x' + height;
    return {
      tapTarget: Audit.makeNodeItem(failure.tapTarget.node),
      overlappingTarget: Audit.makeNodeItem(failure.overlappingTarget.node),
      tapTargetScore: failure.tapTargetScore,
      overlappingTargetScore: failure.overlappingTargetScore,
      overlapScoreRatio: failure.overlapScoreRatio,
      size,
      width,
      height,
    };
  });

  tableItems.sort((a, b) => {
    return b.overlapScoreRatio - a.overlapScoreRatio;
  });

  return tableItems;
}

class TapTargets extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'tap-targets',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['MetaElements', 'TapTargets'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    if (context.settings.formFactor === 'desktop') {
      // Tap target sizes aren't important for desktop SEO, so disable the audit there.
      // On desktop people also tend to have more precise pointing devices than fingers.
      return {
        score: 1,
        notApplicable: true,
      };
    }

    const viewportMeta = await ViewportMeta.request(artifacts.MetaElements, context);
    if (!viewportMeta.isMobileOptimized) {
      return {
        score: 0,
        explanation: str_(UIStrings.explanationViewportMetaNotOptimized),
      };
    }

    // Augment the targets with padded bounding rects for quick intersection testing.
    const boundedTapTargets = getBoundedTapTargets(artifacts.TapTargets);

    const tooSmallTargets = getTooSmallTargets(boundedTapTargets);
    const overlapFailures = getAllOverlapFailures(tooSmallTargets, boundedTapTargets);
    const overlapFailuresForDisplay = mergeSymmetricFailures(overlapFailures);
    const tableItems = getTableItems(overlapFailuresForDisplay);

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'tapTarget', valueType: 'node', label: str_(UIStrings.tapTargetHeader)},
      {key: 'size', valueType: 'text', label: str_(i18n.UIStrings.columnSize)},
      {key: 'overlappingTarget', valueType: 'node', label: str_(UIStrings.overlappingTargetHeader)},
    ];

    const details = Audit.makeTableDetails(headings, tableItems);

    const tapTargetCount = artifacts.TapTargets.length;
    const failingTapTargetCount = new Set(overlapFailures.map(f => f.tapTarget)).size;
    const passingTapTargetCount = tapTargetCount - failingTapTargetCount;

    let score = 1;
    let passingTapTargetRatio = 1;
    if (failingTapTargetCount > 0) {
      passingTapTargetRatio = (passingTapTargetCount / tapTargetCount);
      // If there are any failures then we don't want the audit to pass,
      // so keep the score below 90.
      score = passingTapTargetRatio * 0.89;
    }
    const displayValue = str_(UIStrings.displayValue, {decimalProportion: passingTapTargetRatio});

    return {
      score,
      details,
      displayValue,
    };
  }
}

TapTargets.FINGER_SIZE_PX = FINGER_SIZE_PX;

export default TapTargets;
export {UIStrings};


/** @typedef {{
  overlapScoreRatio: number;
  tapTargetScore: number;
  overlappingTargetScore: number;
}} ClientRectOverlapFailure */

/** @typedef {{
  overlapScoreRatio: number;
  tapTargetScore: number;
  overlappingTargetScore: number;
  tapTarget: LH.Artifacts.TapTarget;
  overlappingTarget: LH.Artifacts.TapTarget;
}} TapTargetOverlapFailure */

/** @typedef {{
  paddedBoundsRect: LH.Artifacts.Rect;
  tapTarget: LH.Artifacts.TapTarget;
}} BoundedTapTarget */

/** @typedef {{
  tapTarget: LH.Audit.Details.NodeValue;
  overlappingTarget: LH.Audit.Details.NodeValue;
  size: string;
  overlapScoreRatio: number;
  height: number;
  width: number;
  tapTargetScore: number;
  overlappingTargetScore: number;
}} TapTargetTableItem */
