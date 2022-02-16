/**
 * @license
 * Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Logs messages via a UI butter.
 */
export class Logger {
  /**
   * @param {HTMLElement} element - expected to have id #lh-log
   */
  constructor(element) {
    this.el = element;
    const styleEl = document.createElement('style');
    styleEl.textContent = /* css */ `
      #lh-log {
        position: fixed;
        background-color: #323232;
        color: #fff;
        min-height: 48px;
        min-width: 288px;
        padding: 16px 24px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
        border-radius: 2px;
        margin: 12px;
        font-size: 14px;
        cursor: default;
        transition: transform 0.3s, opacity 0.3s;
        transform: translateY(100px);
        opacity: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      
      #lh-log.lh-show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    if (!this.el.parentNode) throw new Error('element needs to be in the DOM');
    this.el.parentNode.insertBefore(styleEl, this.el);
    this._id = undefined;
  }

  /**
   * Shows a butter bar.
   * @param {string} msg The message to show.
   * @param {boolean=} autoHide True to hide the message after a duration.
   *     Default is true.
   */
  log(msg, autoHide = true) {
    this._id && clearTimeout(this._id);

    this.el.textContent = msg;
    this.el.classList.add('lh-show');
    if (autoHide) {
      this._id = setTimeout(() => {
        this.el.classList.remove('lh-show');
      }, 7000);
    }
  }

  /**
   * @param {string} msg
   */
  warn(msg) {
    this.log('Warning: ' + msg);
  }

  /**
   * @param {string} msg
   */
  error(msg) {
    this.log(msg);

    // Rethrow to make sure it's auditable as an error, but in a setTimeout so page
    // recovers gracefully and user can try loading a report again.
    setTimeout(() => {
      throw new Error(msg);
    }, 0);
  }

  /**
   * Explicitly hides the butter bar.
   */
  hide() {
    this._id && clearTimeout(this._id);
    this.el.classList.remove('lh-show');
  }
}
