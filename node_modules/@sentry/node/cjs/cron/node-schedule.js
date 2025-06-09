Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const common = require('./common.js');

/**
 * Instruments the `node-schedule` library to send a check-in event to Sentry for each job execution.
 *
 * ```ts
 * import * as Sentry from '@sentry/node';
 * import * as schedule from 'node-schedule';
 *
 * const scheduleWithCheckIn = Sentry.cron.instrumentNodeSchedule(schedule);
 *
 * const job = scheduleWithCheckIn.scheduleJob('my-cron-job', '* * * * *', () => {
 *  console.log('You will see this message every minute');
 * });
 * ```
 */
function instrumentNodeSchedule(lib) {
  return new Proxy(lib, {
    get(target, prop) {
      if (prop === 'scheduleJob') {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        return new Proxy(target.scheduleJob, {
          apply(target, thisArg, argArray) {
            const [nameOrExpression, expressionOrCallback] = argArray;

            if (typeof nameOrExpression !== 'string' || typeof expressionOrCallback !== 'string') {
              throw new Error(
                "Automatic instrumentation of 'node-schedule' requires the first parameter of 'scheduleJob' to be a job name string and the second parameter to be a crontab string",
              );
            }

            const monitorSlug = nameOrExpression;
            const expression = expressionOrCallback;

            return core.withMonitor(
              monitorSlug,
              () => {
                return target.apply(thisArg, argArray);
              },
              {
                schedule: { type: 'crontab', value: common.replaceCronNames(expression) },
              },
            );
          },
        });
      }

      return target[prop];
    },
  });
}

exports.instrumentNodeSchedule = instrumentNodeSchedule;
//# sourceMappingURL=node-schedule.js.map
