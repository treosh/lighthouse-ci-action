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
declare module ImageSSIM {
    type Data = number[] | any[] | Uint8Array;
    /**
     * Grey = 1, GreyAlpha = 2, RGB = 3, RGBAlpha = 4
     */
    enum Channels {
        Grey = 1,
        GreyAlpha = 2,
        RGB = 3,
        RGBAlpha = 4,
    }
    interface IImage {
        data: Data;
        width: number;
        height: number;
        channels: Channels;
    }
    interface IResult {
        ssim: number;
        mcs: number;
    }
    /**
     * Entry point.
     * @throws new Error('Images have different sizes!')
     */
    function compare(image1: IImage, image2: IImage, windowSize?: number, K1?: number, K2?: number, luminance?: boolean, bitsPerComponent?: number): IResult;
}
export = ImageSSIM;
