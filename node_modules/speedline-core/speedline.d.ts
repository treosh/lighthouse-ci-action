/// <reference types="node" />

/**
 * @param trace Trace file location or an array of traceEvents.
 */
declare function Speedline<I extends Speedline.IncludeType = 'all'>(trace: string|Speedline.TraceEvent[], opts: Speedline.Options<I>): Promise<Speedline.Output<I>>;

declare namespace Speedline {
  type IncludeType = 'all' | 'speedIndex' | 'perceptualSpeedIndex';

  interface Options<I extends IncludeType = 'all'> {
    /**
     * Provides the baseline timeStamp, typically navigationStart. Must be a monotonic clock
     * timestamp that matches the trace. E.g. `speedline('trace.json', {timeOrigin: 103205446186})`
     */
    timeOrigin?: number;
    /**
     * If the elapsed time and difference in similarity between two screenshots are small,
     * fastMode will skip decoding and evaluating the frames between them.
     */
    fastMode?: boolean;
    /**
     * Specifies which speed indexes to compute, can be one of
     * `all|speedIndex|perceptualSpeedIndex`. Defaults to `all`.
     */
    include?: I;
  }

  interface TraceEvent {
    name: string;
    cat: string;
    args: {
      data?: {
        url?: string
      };
      snapshot?: string;
    };
    tid: number;
    ts: number;
    dur: number;
  }

  interface Output<I extends (IncludeType | 'unknown') = 'unknown'> {
    /** Recording start timestamp. */
    beginning: number;
    /** Recording end timestamp. */
    end: number;
    /** Duration before the first visual change, in ms. */
    first: number;
    /** Duration before the last visual change, in ms. */
    complete: number;
    /** Timeline recording duration, in ms. */
    duration: number;

    /** Array of all the frames extracted from the timeline. */
    frames: Array<{
      /**
       * @return The frame histogram. Note that light pixels informations are removed
       * from the histogram for better speed index calculation accuracy.
       */
      getHistogram(): number[][];
      /** @return The frame timestamp. */
      getTimeStamp(): number;
      /** @return The frame content. */
      getImage(): Buffer;
      setProgress(progress: number, isInterpolated: boolean): void;
      setPerceptualProgress(progress: number, isInterpolated: boolean): void;
      /** @return The frame visual progress. */
      getProgress(): number;
      /** @return The frame perceptual visual progress. */
      getPerceptualProgress(): number;
      isProgressInterpolated(): boolean;
      isPerceptualProgressInterpolated(): boolean;
      getParsedImage(): {width: number, height: number, data: Buffer};
    }>;

    /** The Speed Index for the trace. Defined if opts.include was 'all' (default) or 'speedIndex'. */
    speedIndex: I extends 'all'|'speedIndex' ? number : (number | undefined);
    /** The Perceptual Speed Index for the trace. Defined if opts.include was 'all' (default) or 'perceptualSpeedIndex'. */
    perceptualSpeedIndex: I extends 'all'|'perceptualSpeedIndex' ? number : (number | undefined);
  }
}

export = Speedline;
