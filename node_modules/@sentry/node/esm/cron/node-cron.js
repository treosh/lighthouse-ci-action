import { _optionalChain } from '@sentry/utils';
import { withMonitor } from '@sentry/core';
import { replaceCronNames } from './common.js';

/**
 * Wraps the `node-cron` library with check-in monitoring.
 *
 * ```ts
 * import * as Sentry from "@sentry/node";
 * import cron from "node-cron";
 *
 * const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);
 *
 * cronWithCheckIn.schedule(
 *   "* * * * *",
 *   () => {
 *     console.log("running a task every minute");
 *   },
 *   { name: "my-cron-job" },
 * );
 * ```
 */
function instrumentNodeCron(lib) {
  return new Proxy(lib, {
    get(target, prop) {
      if (prop === 'schedule' && target.schedule) {
        // When 'get' is called for schedule, return a proxied version of the schedule function
        return new Proxy(target.schedule, {
          apply(target, thisArg, argArray) {
            const [expression, , options] = argArray;

            if (!_optionalChain([options, 'optionalAccess', _ => _.name])) {
              throw new Error('Missing "name" for scheduled job. A name is required for Sentry check-in monitoring.');
            }

            return withMonitor(
              options.name,
              () => {
                return target.apply(thisArg, argArray);
              },
              {
                schedule: { type: 'crontab', value: replaceCronNames(expression) },
                timezone: _optionalChain([options, 'optionalAccess', _2 => _2.timezone]),
              },
            );
          },
        });
      } else {
        return target[prop];
      }
    },
  });
}

export { instrumentNodeCron };
//# sourceMappingURL=node-cron.js.map
