/**
 * Creates a rate limiter that will call the disable callback when the rate limit is reached and the enable callback
 * when a timeout has occurred.
 * @param maxPerSecond Maximum number of calls per second
 * @param enable Callback to enable capture
 * @param disable Callback to disable capture
 * @returns A function to call to increment the rate limiter count
 */
function createRateLimiter(
  maxPerSecond,
  enable,
  disable,
) {
  let count = 0;
  let retrySeconds = 5;
  let disabledTimeout = 0;

  setInterval(() => {
    if (disabledTimeout === 0) {
      if (count > maxPerSecond) {
        retrySeconds *= 2;
        disable(retrySeconds);

        // Cap at one day
        if (retrySeconds > 86400) {
          retrySeconds = 86400;
        }
        disabledTimeout = retrySeconds;
      }
    } else {
      disabledTimeout -= 1;

      if (disabledTimeout === 0) {
        enable();
      }
    }

    count = 0;
  }, 1000).unref();

  return () => {
    count += 1;
  };
}

// Add types for the exception event data

/** Could this be an anonymous function? */
function isAnonymous(name) {
  return name !== undefined && (name.length === 0 || name === '?' || name === '<anonymous>');
}

/** Do the function names appear to match? */
function functionNamesMatch(a, b) {
  return a === b || (isAnonymous(a) && isAnonymous(b));
}

/** Creates a unique hash from stack frames */
function hashFrames(frames) {
  if (frames === undefined) {
    return;
  }

  // Only hash the 10 most recent frames (ie. the last 10)
  return frames.slice(-10).reduce((acc, frame) => `${acc},${frame.function},${frame.lineno},${frame.colno}`, '');
}

/**
 * We use the stack parser to create a unique hash from the exception stack trace
 * This is used to lookup vars when the exception passes through the event processor
 */
function hashFromStack(stackParser, stack) {
  if (stack === undefined) {
    return undefined;
  }

  return hashFrames(stackParser(stack, 1));
}

export { createRateLimiter, functionNamesMatch, hashFrames, hashFromStack, isAnonymous };
//# sourceMappingURL=common.js.map
