import * as util from 'util';
import { defineIntegration, convertIntegrationFnToClass, getClient, addBreadcrumb } from '@sentry/core';
import { addConsoleInstrumentationHandler, severityLevelFromString } from '@sentry/utils';

const INTEGRATION_NAME = 'Console';

const _consoleIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    // TODO v8: Remove this
    setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    setup(client) {
      addConsoleInstrumentationHandler(({ args, level }) => {
        if (getClient() !== client) {
          return;
        }

        addBreadcrumb(
          {
            category: 'console',
            level: severityLevelFromString(level),
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

const consoleIntegration = defineIntegration(_consoleIntegration);

/**
 * Console module integration.
 * @deprecated Use `consoleIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const Console = convertIntegrationFnToClass(INTEGRATION_NAME, consoleIntegration)

;

// eslint-disable-next-line deprecation/deprecation

export { Console, consoleIntegration };
//# sourceMappingURL=console.js.map
