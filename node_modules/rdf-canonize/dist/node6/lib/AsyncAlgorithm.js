/**
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = require('./util');

module.exports = class AsyncAlgorithm {
  constructor({
    maxCallStackDepth = 500,
    maxTotalCallStackDepth = 0xFFFFFFFF,
    // milliseconds
    timeSlice = 10
  } = {}) {
    this.schedule = {};
    this.schedule.MAX_DEPTH = maxCallStackDepth;
    this.schedule.MAX_TOTAL_DEPTH = maxTotalCallStackDepth;
    this.schedule.depth = 0;
    this.schedule.totalDepth = 0;
    this.schedule.timeSlice = timeSlice;
  } // do some work in a time slice, but in serial


  doWork(fn, callback) {
    const schedule = this.schedule;

    if (schedule.totalDepth >= schedule.MAX_TOTAL_DEPTH) {
      return callback(new Error('Maximum total call stack depth exceeded; canonicalization aborting.'));
    }

    (function work() {
      if (schedule.depth === schedule.MAX_DEPTH) {
        // stack too deep, run on next tick
        schedule.depth = 0;
        schedule.running = false;
        return util.nextTick(work);
      } // if not yet running, force run


      const now = Date.now();

      if (!schedule.running) {
        schedule.start = Date.now();
        schedule.deadline = schedule.start + schedule.timeSlice;
      } // TODO: should also include an estimate of expectedWorkTime


      if (now < schedule.deadline) {
        schedule.running = true;
        schedule.depth++;
        schedule.totalDepth++;
        return fn((err, result) => {
          schedule.depth--;
          schedule.totalDepth--;
          callback(err, result);
        });
      } // not enough time left in this slice, run after letting browser
      // do some other things


      schedule.depth = 0;
      schedule.running = false;
      util.setImmediate(work);
    })();
  } // asynchronously loop


  forEach(iterable, fn, callback) {
    const self = this;
    let iterator;
    let idx = 0;
    let length;

    if (Array.isArray(iterable)) {
      length = iterable.length;

      iterator = () => {
        if (idx === length) {
          return false;
        }

        iterator.value = iterable[idx++];
        iterator.key = idx;
        return true;
      };
    } else {
      const keys = Object.keys(iterable);
      length = keys.length;

      iterator = () => {
        if (idx === length) {
          return false;
        }

        iterator.key = keys[idx++];
        iterator.value = iterable[iterator.key];
        return true;
      };
    }

    (function iterate(err) {
      if (err) {
        return callback(err);
      }

      if (iterator()) {
        return self.doWork(() => fn(iterator.value, iterator.key, iterate));
      }

      callback();
    })();
  } // asynchronous waterfall


  waterfall(fns, callback) {
    const self = this;
    self.forEach(fns, (fn, idx, callback) => self.doWork(fn, callback), callback);
  } // asynchronous while


  whilst(condition, fn, callback) {
    const self = this;

    (function loop(err) {
      if (err) {
        return callback(err);
      }

      if (!condition()) {
        return callback();
      }

      self.doWork(fn, loop);
    })();
  }

};