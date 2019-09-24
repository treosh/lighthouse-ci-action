/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * ssim.ts - part of Image Quantization Library
 */

/**
 * - Original TypeScript implementation:
 *   https://github.com/igor-bezkrovny/image-quantization/blob/9f62764ac047c3e53accdf1d7e4e424b0ef2fb60/src/quality/ssim.ts
 * - Based on Java implementation: https://github.com/rhys-e/structural-similarity
 * - For more information see: http://en.wikipedia.org/wiki/Structural_similarity
 */
module ImageSSIM {
	'use strict';

	export type Data = number[]|any[]|Uint8Array;

	/**
	 * Grey = 1, GreyAlpha = 2, RGB = 3, RGBAlpha = 4
	 */
	export enum Channels {
		Grey = 1,
		GreyAlpha = 2,
		RGB = 3,
		RGBAlpha = 4
	}

	export interface IImage {
		data:Data;
		width:number;
		height:number;
		channels:Channels;
	}

	export  interface IResult {
		ssim:number;
		mcs:number;
	}

	/**
	 * Entry point.
	 * @throws new Error('Images have different sizes!')
	 */
	export function compare(image1:IImage,
							image2:IImage,
							windowSize:number = 8,
							K1:number = 0.01,
							K2:number = 0.03,
							luminance:boolean = true,
							bitsPerComponent:number = 8):IResult {
		if (image1.width !== image2.width ||
			image1.height !== image2.height) {
			throw new Error('Images have different sizes!');
		}

		/* tslint:disable:no-bitwise */
		var L:number = (1 << bitsPerComponent) - 1;
		/* tslint:enable:no-bitwise */

		var c1:number = Math.pow((K1 * L), 2),
			c2:number = Math.pow((K2 * L), 2),
			numWindows:number = 0,
			mssim:number = 0.0;

		var mcs:number = 0.0;

		function iteration(lumaValues1:number[],
						   lumaValues2:number[],
						   averageLumaValue1:number,
						   averageLumaValue2:number):void {
			// calculate variance and covariance
			var sigxy:number,
				sigsqx:number,
				sigsqy:number;

			sigxy = sigsqx = sigsqy = 0.0;

			for (var i:number = 0; i < lumaValues1.length; i++) {
				sigsqx += Math.pow((lumaValues1[i] - averageLumaValue1), 2);
				sigsqy += Math.pow((lumaValues2[i] - averageLumaValue2), 2);
				sigxy += (lumaValues1[i] - averageLumaValue1) * (lumaValues2[i] - averageLumaValue2);
			}

			var numPixelsInWin:number = lumaValues1.length - 1;
			sigsqx /= numPixelsInWin;
			sigsqy /= numPixelsInWin;
			sigxy /= numPixelsInWin;

			// perform ssim calculation on window
			var numerator:number = (2 * averageLumaValue1 * averageLumaValue2 + c1) * (2 * sigxy + c2);

			var denominator:number = (Math.pow(averageLumaValue1, 2) +
				Math.pow(averageLumaValue2, 2) + c1) * (sigsqx + sigsqy + c2);

			mssim += numerator / denominator;
			mcs += (2 * sigxy + c2) / (sigsqx + sigsqy + c2);

			numWindows++;
		}

		// calculate SSIM for each window
		Internals._iterate(image1, image2, windowSize, luminance, iteration);

		return {ssim: mssim / numWindows, mcs: mcs / numWindows};
	}

	/**
	 * Internal functions.
	 */
	module Internals {
		export function _iterate(image1:IImage,
								 image2:IImage,
								 windowSize:number,
								 luminance:boolean,
								 callback:(lumaValues1:number[],
										   lumaValues2:number[],
										   averageLumaValue1:number,
										   averageLumaValue2:number) => void):void {
			var width:number = image1.width,
				height:number = image1.height;

			for (var y:number = 0; y < height; y += windowSize) {
				for (var x:number = 0; x < width; x += windowSize) {
					// avoid out-of-width/height
					var windowWidth:number = Math.min(windowSize, width - x),
						windowHeight:number = Math.min(windowSize, height - y);

					var lumaValues1:number[] = _lumaValuesForWindow(image1, x, y, windowWidth, windowHeight, luminance),
						lumaValues2:number[] = _lumaValuesForWindow(image2, x, y, windowWidth, windowHeight, luminance),
						averageLuma1:number = _averageLuma(lumaValues1),
						averageLuma2:number = _averageLuma(lumaValues2);

					callback(lumaValues1, lumaValues2, averageLuma1, averageLuma2);
				}
			}
		}

		function _lumaValuesForWindow(image:IImage,
									  x:number,
									  y:number,
									  width:number,
									  height:number,
									  luminance:boolean):number[] {
			var array:Data = image.data,
				lumaValues:number[] = <any>new Float32Array(new ArrayBuffer(width * height * 4)),
				counter:number = 0;

			var maxj:number = y + height;

			for (var j:number = y; j < maxj; j++) {
				var offset:number = j * image.width;
				var i:number = (offset + x) * image.channels;
				var maxi:number = (offset + x + width) * image.channels;

				switch (image.channels) {
					case Channels.Grey:
						while (i < maxi) {
							// (0.212655 +  0.715158 + 0.072187) === 1
							lumaValues[counter++] = array[i++];
						}
						break;
					case Channels.GreyAlpha:
						while (i < maxi) {
							lumaValues[counter++] = array[i++] * (array[i++] / 255);
						}
						break;
					case Channels.RGB:
						if (luminance) {
							while (i < maxi) {
								lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187);
							}
						} else {
							while (i < maxi) {
								lumaValues[counter++] = (array[i++] + array[i++] + array[i++]);
							}
						}
						break;
					case Channels.RGBAlpha:
						if (luminance) {
							while (i < maxi) {
								lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187) *
									(array[i++] / 255);
							}
						} else {
							while (i < maxi) {
								lumaValues[counter++] = (array[i++] + array[i++] + array[i++]) *
									(array[i++] / 255);
							}
						}
						break;
				}
			}

			return lumaValues;
		}

		function _averageLuma(lumaValues:number[]):number {
			var sumLuma:number = 0.0;

			for (var i:number = 0; i < lumaValues.length; i++) {
				sumLuma += lumaValues[i];
			}

			return sumLuma / lumaValues.length;
		}
	}
}

export = ImageSSIM;
