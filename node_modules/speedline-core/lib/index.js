'use strict';

const frame = require('./frame');
const speedIndex = require('./speed-index');

/**
 * @typedef {import('../speedline').TraceEvent} TraceEvent
 * @typedef {import('../speedline').IncludeType} IncludeType
 * @typedef {import('../speedline').Output['frames'][number]} Frame
 */

/**
 * @param {Array<Frame>} frames
 * @param {{startTs: number, endTs: number}} data
 */
function calculateValues(frames, data) {
	const indexes = speedIndex.calculateSpeedIndexes(frames, data);
	const duration = Math.floor(data.endTs - data.startTs);
	const first = Math.floor(indexes.firstPaintTs - data.startTs);
	const complete = Math.floor(indexes.visuallyCompleteTs - data.startTs);

	return {
		beginning: data.startTs,
		end: data.endTs,
		frames,
		first,
		complete,
		duration,
		speedIndex: indexes.speedIndex,
		perceptualSpeedIndex: indexes.perceptualSpeedIndex
	};
}

/** @type {{All: 'all', pSI: 'perceptualSpeedIndex', SI: 'speedIndex'}} */
const Include = {
	All: 'all',
	pSI: 'perceptualSpeedIndex',
	SI: 'speedIndex'
};

/**
 * Retrieve speed index informations
 * @template {IncludeType} I
 * @param {string|Array<TraceEvent>} timeline
 * @param {import('../speedline').Options<I>} opts
 * @return {Promise<import('../speedline').Output<I>>}
 */
module.exports = function (timeline, opts) {
	const include = opts && opts.include || Include.All;
	// Check for invalid `include` values
	if (!Object.keys(Include).some(key => Include[key] === include)) {
		throw new Error(`Unrecognized include option: ${include}`);
	}

	return frame.extractFramesFromTimeline(timeline, opts).then(function (data) {
		const frames = data.frames;

		if (include === Include.All || include === Include.SI) {
			speedIndex.calculateVisualProgress(frames, opts);
		}

		if (include === Include.All || include === Include.pSI) {
			speedIndex.calculatePerceptualProgress(frames, opts);
		}

		return calculateValues(frames, data);
	});
};
