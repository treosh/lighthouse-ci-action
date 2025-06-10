"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOptionParser = void 0;
/**
 * Create a function for parsing options from an options spec.
 */
function createOptionParser(optionSpecs) {
    validateSpecs(optionSpecs);
    return function parseOptions(input) {
        const options = defaultOptions(optionSpecs);
        const rawOptions = typeof input == "string" ? splitParameter(input) : input;
        const seen = new Set();
        for (const rawOption of rawOptions) {
            if (!Object.prototype.hasOwnProperty.call(optionSpecs, rawOption.key)) {
                throwOptionError(optionSpecs, `Option "${rawOption.key}" not recognized.`);
            }
            const key = rawOption.key;
            const spec = optionSpecs[key];
            switch (spec.kind) {
                case "flag":
                    if (seen.has(key)) {
                        throwOptionError(optionSpecs, `Option "${rawOption.key}" cannot be given more than once.`);
                    }
                    seen.add(key);
                    if (rawOption.value.length > 0) {
                        throwOptionError(optionSpecs, `Option "${key}" does not take a value.`);
                    }
                    options[key] = true;
                    break;
            }
        }
        validateOptions(options, optionSpecs);
        return options;
    };
}
exports.createOptionParser = createOptionParser;
/**
 * Split a raw parameter string (e.g. "foo,bar=baz,qux=123") into an
 * array of key/values.
 */
function splitParameter(parameter) {
    if (parameter.length == 0) {
        return [];
    }
    return parameter.split(",").map((raw) => {
        const i = raw.indexOf("=");
        return {
            key: i === -1 ? raw : raw.substring(0, i),
            value: i === -1 ? "" : raw.substring(i + 1),
        };
    });
}
function defaultOptions(optionSpecs) {
    const o = {};
    for (const [key, spec] of Object.entries(optionSpecs)) {
        switch (spec.kind) {
            case "flag":
                o[key] = false;
                break;
        }
    }
    return o;
}
function validateOptions(options, optionSpecs) {
    var _a, _b;
    for (const [key, spec] of Object.entries(optionSpecs)) {
        switch (spec.kind) {
            case "flag":
                const value = options[key];
                if (value) {
                    const requiredKeys = ((_a = spec.requires) !== null && _a !== void 0 ? _a : []);
                    const excludedKeys = ((_b = spec.excludes) !== null && _b !== void 0 ? _b : []);
                    const missingKeys = requiredKeys.filter(key => !options[key]);
                    if (missingKeys.length > 0) {
                        throwOptionError(optionSpecs, `Option "${key}" requires option "${missingKeys.join('", "')}" to be set.`);
                    }
                    const deniedKeys = excludedKeys.filter(key => options[key]);
                    if (deniedKeys.length > 0) {
                        throwOptionError(optionSpecs, `If option "${key}" is set, option "${deniedKeys.join('", "')}" cannot be set.`);
                    }
                }
                break;
        }
    }
}
function validateSpecs(spec) {
    var _a, _b;
    const known = Object.keys(spec);
    for (const [key, { excludes, requires }] of Object.entries(spec)) {
        let r = (_a = requires === null || requires === void 0 ? void 0 : requires.filter(i => !known.includes(i))) !== null && _a !== void 0 ? _a : [];
        if (r.length > 0) {
            throw new Error(`Invalid parameter spec for parameter "${key}". "requires" points to unknown parameters: ${r.join(', ')}`);
        }
        let e = (_b = excludes === null || excludes === void 0 ? void 0 : excludes.filter(i => !known.includes(i))) !== null && _b !== void 0 ? _b : [];
        if (e.length > 0) {
            throw new Error(`Invalid parameter spec for parameter "${key}". "excludes" points to unknown parameters: ${e.join(', ')}`);
        }
    }
}
function throwOptionError(optionSpecs, error) {
    let text = '';
    text += error + '\n';
    text += `\n`;
    text += `Available options:\n`;
    text += `\n`;
    for (let [key, val] of Object.entries(optionSpecs)) {
        text += `- "${key}"\n`;
        for (let l of val.description.split('\n')) {
            text += `  ${l}\n`;
        }
        text += `\n`;
    }
    let err = new Error(text);
    err.name = `ParameterError`;
    throw err;
}
