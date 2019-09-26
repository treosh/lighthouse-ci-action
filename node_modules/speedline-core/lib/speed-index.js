'use strict';

const imageSSIM = require('image-ssim');

/* BEGIN FAST MODE CONSTANTS - See function doc for explanation */
const fastModeAllowableChangeMax = 5;
const fastModeAllowableChangeMedian = 3;
const fastModeAllowableChangeMin = -1;

const fastModeConstant = fastModeAllowableChangeMin;
const fastModeMultiplier = fastModeAllowableChangeMax - fastModeConstant;
const fastModeExponentiationCoefficient = Math.log((fastModeAllowableChangeMedian - fastModeConstant) / fastModeMultiplier);
/* END FAST MODE CONSTANTS - See function doc for explanation */

/** @typedef {import('../speedline').Output['frames'][number]} Frame */

/**
 * This computes the allowed percentage of change between two frames in fast mode where we won't examine the frames in between them.
 * It follows an exponential function such that:
 *  - We allow up to FAST_MODE_ALLOWABLE_CHANGE_MAX percent difference when the frames are ~0s apart.
 *  - We allow up to FAST_MODE_ALLOWABLE_CHANGE_MEDIAN percent difference when the frames are ~1s apart.
 *  - We allow up to FAST_MODE_ALLOWABLE_CHANGE_MIN percent difference when the frames are very far apart.
 *
 *  f(t) = FAST_MODE_MULTIPLIER * e^(FAST_MODE_EXPONENTIATION_COEFFICIENT * t) + FAST_MODE_CONSTANT
 * @param {number} elapsedTime
 */
function calculateFastModeAllowableChange(elapsedTime) {
	const elapsedTimeInSeconds = elapsedTime / 1000;
	const allowableChange = fastModeMultiplier * Math.exp(fastModeExponentiationCoefficient * elapsedTimeInSeconds) + fastModeConstant;
	return allowableChange;
}

/**
 * @param {Frame} current
 * @param {Frame} initial
 * @param {Frame} target
 */
function calculateFrameProgress(current, initial, target) {
	let total = 0;
	let match = 0;

	const currentHist = current.getHistogram();
	const initialHist = initial.getHistogram();
	const targetHist = target.getHistogram();

	for (let channel = 0; channel < 3; channel++) {
		for (let pixelVal = 0; pixelVal < 256; pixelVal++) {
			const currentCount = currentHist[channel][pixelVal];
			const initialCount = initialHist[channel][pixelVal];
			const targetCount = targetHist[channel][pixelVal];

			const currentDiff = Math.abs(currentCount - initialCount);
			const targetDiff = Math.abs(targetCount - initialCount);

			match += Math.min(currentDiff, targetDiff);
			total += targetDiff;
		}
	}

	let progress;
	if (match === 0 && total === 0) {	// All images are the same
		progress = 100;
	} else {													// When images differs
		progress = Math.floor(match / total * 100);
	}
	return progress;
}

/**
 * @param {Array<Frame>} frames
 * @param {number} lowerBound
 * @param {number} upperBound
 * @param {boolean} isFastMode
 * @param {function(Frame): number} getProgress
 * @param {function(Frame, number, boolean): void} setProgress
 */
function calculateProgressBetweenFrames(frames, lowerBound, upperBound, isFastMode, getProgress, setProgress) {
	if (!isFastMode) {
		frames.forEach(frame => setProgress(frame, getProgress(frame), false));
		return;
	}

	const lowerFrame = frames[lowerBound];
	const upperFrame = frames[upperBound];
	const elapsedTime = upperFrame.getTimeStamp() - lowerFrame.getTimeStamp();

	const lowerProgress = getProgress(lowerFrame);
	const upperProgress = getProgress(upperFrame);

	setProgress(lowerFrame, lowerProgress, false);
	setProgress(upperFrame, upperProgress, false);

	if (Math.abs(lowerProgress - upperProgress) < calculateFastModeAllowableChange(elapsedTime)) {
		for (let i = lowerBound + 1; i < upperBound; i++) {
			setProgress(frames[i], lowerProgress, true);
		}
	} else if (upperBound - lowerBound > 1) {
		const midpoint = Math.floor((lowerBound + upperBound) / 2);
		calculateProgressBetweenFrames(frames, lowerBound, midpoint, isFastMode, getProgress, setProgress);
		calculateProgressBetweenFrames(frames, midpoint, upperBound, isFastMode, getProgress, setProgress);
	}
}

/**
 * @param {Array<Frame>} frames
 * @param {{fastMode?: boolean}} opts
 */
function calculateVisualProgress(frames, opts) {
	const initial = frames[0];
	const target = frames[frames.length - 1];

	/** @param {Frame} frame */
	function getProgress(frame) {
		if (typeof frame.getProgress() === 'number') {
			return frame.getProgress();
		}

		return calculateFrameProgress(frame, initial, target);
	}

	/**
	 * @param {Frame} frame
	 * @param {number} progress
	 * @param {boolean} isInterpolated
	 */
	function setProgress(frame, progress, isInterpolated) {
		return frame.setProgress(progress, isInterpolated);
	}

	calculateProgressBetweenFrames(
		frames,
		0,
		frames.length - 1,
		opts && opts.fastMode,
		getProgress,
		setProgress
	);

	return frames;
}

/**
 * @param {Frame} frame
 * @param {Frame} target
 * @return {number}
 */
function calculateFrameSimilarity(frame, target) {
	const defaultImageConfig = {
		// image-ssim uses this to interpret the arraybuffer NOT the desired channels to consider
		// jpeg-js encodes each pixel with an alpha channel set to 0xFF, so 4 channel interpretation is required
		channels: 4
	};

	const frameData = Object.assign(frame.getParsedImage(), defaultImageConfig);
	const targetData = Object.assign(target.getParsedImage(), defaultImageConfig);

	const diff = imageSSIM.compare(frameData, targetData);
	return diff.ssim;
}

/**
 * @param {Array<Frame>} frames
 * @param {{fastMode?: boolean}} opts
 */
function calculatePerceptualProgress(frames, opts) {
	const initial = frames[0];
	const target = frames[frames.length - 1];
	const initialSimilarity = calculateFrameSimilarity(initial, target);

	/** @param {Frame} frame */
	function getProgress(frame) {
		if (typeof frame.getPerceptualProgress() === 'number') {
			return frame.getPerceptualProgress();
		}

		const ssim = calculateFrameSimilarity(frame, target);
		return Math.max(100 * (ssim - initialSimilarity) / (1 - initialSimilarity), 0);
	}

	/**
	 * @param {Frame} frame
	 * @param {number} progress
	 * @param {boolean} isInterpolated
	 */
	function setProgress(frame, progress, isInterpolated) {
		return frame.setPerceptualProgress(progress, isInterpolated);
	}

	calculateProgressBetweenFrames(
		frames,
		0,
		frames.length - 1,
		opts && opts.fastMode,
		getProgress,
		setProgress
	);

	return frames;
}

/**
 * @param {Array<Frame>} frames
 * @param {{startTs: number}} data
 * @return {{firstPaintTs: number, visuallyCompleteTs: number, speedIndex?: number, perceptualSpeedIndex?: number}}
 */
function calculateSpeedIndexes(frames, data) {
	const hasVisualProgress = typeof frames[0].getProgress() === 'number';
	const hasPerceptualProgress = typeof frames[0].getPerceptualProgress() === 'number';
	const progressToUse = hasVisualProgress ? 'getProgress' : 'getPerceptualProgress';
	const startTs = data.startTs;
	let visuallyCompleteTs;
	/** @type {number|undefined} */
	let firstPaintTs;

	// find first paint
	for (let i = 0; i < frames.length && !firstPaintTs; i++) {
		if (frames[i][progressToUse]() > 0) {
			firstPaintTs = frames[i].getTimeStamp();
		}
	}

	// find visually complete
	for (let i = 0; i < frames.length && !visuallyCompleteTs; i++) {
		if (frames[i][progressToUse]() >= 100) {
			visuallyCompleteTs = frames[i].getTimeStamp();
		}
	}

	let prevFrameTs = frames[0].getTimeStamp();
	let prevProgress = frames[0].getProgress();
	let prevPerceptualProgress = frames[0].getPerceptualProgress();

	// SI = firstPaint + sum(fP to VC){1-VC%}
	//     github.com/pmdartus/speedline/issues/28#issuecomment-244127192
	/** @type {number|undefined} */
	let speedIndex = firstPaintTs - startTs;
	/** @type {number|undefined} */
	let perceptualSpeedIndex = firstPaintTs - startTs;

	frames.forEach(function (frame) {
		// skip frames from 0 to fP
		if (frame.getTimeStamp() > firstPaintTs) {
			const elapsed = frame.getTimeStamp() - prevFrameTs;
			speedIndex += elapsed * (1 - prevProgress);
			perceptualSpeedIndex += elapsed * (1 - prevPerceptualProgress);
		}

		prevFrameTs = frame.getTimeStamp();
		prevProgress = frame.getProgress() / 100;
		prevPerceptualProgress = frame.getPerceptualProgress() / 100;
	});

	speedIndex = hasVisualProgress ? speedIndex : undefined;
	perceptualSpeedIndex = hasPerceptualProgress ? perceptualSpeedIndex : undefined;

	return {
		firstPaintTs,
		visuallyCompleteTs,
		speedIndex,
		perceptualSpeedIndex
	};
}

module.exports = {
	calculateFastModeAllowableChange,
	calculateFrameSimilarity,
	calculateVisualProgress,
	calculatePerceptualProgress,
	calculateSpeedIndexes
};
