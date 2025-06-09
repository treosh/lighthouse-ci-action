import { LocalVariablesSync, localVariablesSyncIntegration } from './local-variables-sync.js';

/**
 * Adds local variables to exception frames.
 *
 * @deprecated Use `localVariablesIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const LocalVariables = LocalVariablesSync;
// eslint-disable-next-line deprecation/deprecation

const localVariablesIntegration = localVariablesSyncIntegration;

export { LocalVariables, localVariablesIntegration };
//# sourceMappingURL=index.js.map
