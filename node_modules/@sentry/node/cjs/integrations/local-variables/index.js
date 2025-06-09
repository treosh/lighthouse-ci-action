Object.defineProperty(exports, '__esModule', { value: true });

const localVariablesSync = require('./local-variables-sync.js');

/**
 * Adds local variables to exception frames.
 *
 * @deprecated Use `localVariablesIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const LocalVariables = localVariablesSync.LocalVariablesSync;
// eslint-disable-next-line deprecation/deprecation

const localVariablesIntegration = localVariablesSync.localVariablesSyncIntegration;

exports.LocalVariables = LocalVariables;
exports.localVariablesIntegration = localVariablesIntegration;
//# sourceMappingURL=index.js.map
