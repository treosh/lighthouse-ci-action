Object.defineProperty(exports, '__esModule', { value: true });

const util = require('util');
const core = require('@sentry/core');
const utils = require('@sentry/utils');

const INTEGRATION_NAME = 'Console';

const _consoleIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    // TODO v8: Remove this
    setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    setup(client) {
      utils.addConsoleInstrumentationHandler(({ args, level }) => {
        if (core.getClient() !== client) {
          return;
        }

        core.addBreadcrumb(
          {
            category: 'console',
            level: utils.severityLevelFromString(level),
            message: util.format.apply(undefined, args),
          },
          {
            input: [...args],
            level,
          },
        );
      });
    },
  };
}) ;

const consoleIntegration = core.defineIntegration(_consoleIntegration);

/**
 * Console module integration.
 * @deprecated Use `consoleIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const Console = core.convertIntegrationFnToClass(INTEGRATION_NAME, consoleIntegration)

;

// eslint-disable-next-line deprecation/deprecation

exports.Console = Console;
exports.consoleIntegration = consoleIntegration;
//# sourceMappingURL=console.js.map
