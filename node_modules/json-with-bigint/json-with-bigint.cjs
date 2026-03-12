const intRegex = /^-?\d+$/;
const noiseValue = /^-?\d+n+$/; // Noise - strings that match the custom format before being converted to it
const originalStringify = JSON.stringify;
const originalParse = JSON.parse;
const customFormat = /^-?\d+n$/;

const bigIntsStringify = /([\[:])?"(-?\d+)n"($|([\\n]|\s)*(\s|[\\n])*[,\}\]])/g;
const noiseStringify =
  /([\[:])?("-?\d+n+)n("$|"([\\n]|\s)*(\s|[\\n])*[,\}\]])/g;

/** @typedef {(key: string, value: any, context?: { source: string }) => any} Reviver */

/**
 * Function to serialize value to a JSON string.
 * Converts BigInt values to a custom format (strings with digits and "n" at the end) and then converts them to proper big integers in a JSON string.
 * @param {*} value - The value to convert to a JSON string.
 * @param {(Function|Array<string>|null)} [replacer] - A function that alters the behavior of the stringification process, or an array of strings to indicate properties to exclude.
 * @param {(string|number)} [space] - A string or number to specify indentation or pretty-printing.
 * @returns {string} The JSON string representation.
 */
const JSONStringify = (value, replacer, space) => {
  if ("rawJSON" in JSON) {
    return originalStringify(
      value,
      (key, value) => {
        if (typeof value === "bigint") return JSON.rawJSON(value.toString());

        if (typeof replacer === "function") return replacer(key, value);

        if (Array.isArray(replacer) && replacer.includes(key)) return value;

        return value;
      },
      space,
    );
  }

  if (!value) return originalStringify(value, replacer, space);

  const convertedToCustomJSON = originalStringify(
    value,
    (key, value) => {
      const isNoise =
        typeof value === "string" && Boolean(value.match(noiseValue));

      if (isNoise) return value.toString() + "n"; // Mark noise values with additional "n" to offset the deletion of one "n" during the processing

      if (typeof value === "bigint") return value.toString() + "n";

      if (typeof replacer === "function") return replacer(key, value);

      if (Array.isArray(replacer) && replacer.includes(key)) return value;

      return value;
    },
    space,
  );
  const processedJSON = convertedToCustomJSON.replace(
    bigIntsStringify,
    "$1$2$3",
  ); // Delete one "n" off the end of every BigInt value
  const denoisedJSON = processedJSON.replace(noiseStringify, "$1$2$3"); // Remove one "n" off the end of every noisy string

  return denoisedJSON;
};

/**
 * Support for JSON.parse's context.source feature detection.
 * @type {boolean}
 */
const isContextSourceSupported = () =>
  JSON.parse("1", (_, __, context) => !!context && context.source === "1");

/**
 * Convert marked big numbers to BigInt
 * @type {Reviver}
 */
const convertMarkedBigIntsReviver = (key, value, context, userReviver) => {
  const isCustomFormatBigInt =
    typeof value === "string" && value.match(customFormat);
  if (isCustomFormatBigInt) return BigInt(value.slice(0, -1));

  const isNoiseValue = typeof value === "string" && value.match(noiseValue);
  if (isNoiseValue) return value.slice(0, -1);

  if (typeof userReviver !== "function") return value;
  return userReviver(key, value, context);
};

/**
 * Faster (2x) and simpler function to parse JSON.
 * Based on JSON.parse's context.source feature, which is not universally available now.
 * Does not support the legacy custom format, used in the first version of this library.
 */
const JSONParseV2 = (text, reviver) => {
  return JSON.parse(text, (key, value, context) => {
    const isBigNumber =
      typeof value === "number" &&
      (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER);
    const isInt = context && intRegex.test(context.source);
    const isBigInt = isBigNumber && isInt;

    if (isBigInt) return BigInt(context.source);

    if (typeof reviver !== "function") return value;

    return reviver(key, value, context);
  });
};

const MAX_INT = Number.MAX_SAFE_INTEGER.toString();
const MAX_DIGITS = MAX_INT.length;
const stringsOrLargeNumbers =
  /"(?:\\.|[^"])*"|-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/g;
const noiseValueWithQuotes = /^"-?\d+n+"$/; // Noise - strings that match the custom format before being converted to it

/**
 * Function to parse JSON.
 * If JSON has number values greater than Number.MAX_SAFE_INTEGER, we convert those values to a custom format, then parse them to BigInt values.
 * Other types of values are not affected and parsed as native JSON.parse() would parse them.
 */
const JSONParse = (text, reviver) => {
  if (!text) return originalParse(text, reviver);

  if (isContextSourceSupported()) return JSONParseV2(text, reviver); // Shortcut to a faster (2x) and simpler version

  // Find and mark big numbers with "n"
  const serializedData = text.replace(
    stringsOrLargeNumbers,
    (text, digits, fractional, exponential) => {
      const isString = text[0] === '"';
      const isNoise = isString && Boolean(text.match(noiseValueWithQuotes));

      if (isNoise) return text.substring(0, text.length - 1) + 'n"'; // Mark noise values with additional "n" to offset the deletion of one "n" during the processing

      const isFractionalOrExponential = fractional || exponential;
      const isLessThanMaxSafeInt =
        digits &&
        (digits.length < MAX_DIGITS ||
          (digits.length === MAX_DIGITS && digits <= MAX_INT)); // With a fixed number of digits, we can correctly use lexicographical comparison to do a numeric comparison

      if (isString || isFractionalOrExponential || isLessThanMaxSafeInt)
        return text;

      return '"' + text + 'n"';
    },
  );

  return originalParse(serializedData, (key, value, context) =>
    convertMarkedBigIntsReviver(key, value, context, reviver),
  );
};

module.exports = { JSONStringify, JSONParse };
