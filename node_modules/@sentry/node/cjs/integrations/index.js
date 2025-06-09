Object.defineProperty(exports, '__esModule', { value: true });

const console = require('./console.js');
const http = require('./http.js');
const onuncaughtexception = require('./onuncaughtexception.js');
const onunhandledrejection = require('./onunhandledrejection.js');
const modules = require('./modules.js');
const contextlines = require('./contextlines.js');
const context = require('./context.js');
const core = require('@sentry/core');
const index = require('./local-variables/index.js');
const index$1 = require('./undici/index.js');
const spotlight = require('./spotlight.js');
const index$2 = require('./anr/index.js');
const index$3 = require('./hapi/index.js');

/* eslint-disable deprecation/deprecation */

exports.Console = console.Console;
exports.Http = http.Http;
exports.OnUncaughtException = onuncaughtexception.OnUncaughtException;
exports.OnUnhandledRejection = onunhandledrejection.OnUnhandledRejection;
exports.Modules = modules.Modules;
exports.ContextLines = contextlines.ContextLines;
exports.Context = context.Context;
exports.RequestData = core.RequestData;
exports.LocalVariables = index.LocalVariables;
exports.Undici = index$1.Undici;
exports.Spotlight = spotlight.Spotlight;
exports.Anr = index$2.Anr;
exports.Hapi = index$3.Hapi;
//# sourceMappingURL=index.js.map
