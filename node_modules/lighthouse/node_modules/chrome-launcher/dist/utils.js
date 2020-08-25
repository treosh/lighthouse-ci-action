/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalAppDataPath = exports.toWinDirFormat = exports.makeTmpDir = exports.getPlatform = exports.ChromeNotInstalledError = exports.UnsupportedPlatformError = exports.InvalidUserDataDirectoryError = exports.ChromePathNotSetError = exports.LauncherError = exports.delay = exports.defaults = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const mkdirp = require("mkdirp");
const isWsl = require('is-wsl');
function defaults(val, def) {
    return typeof val === 'undefined' ? def : val;
}
exports.defaults = defaults;
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, time));
    });
}
exports.delay = delay;
class LauncherError extends Error {
    constructor(message = 'Unexpected error', code) {
        super();
        this.message = message;
        this.code = code;
        this.stack = new Error().stack;
        return this;
    }
}
exports.LauncherError = LauncherError;
class ChromePathNotSetError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'The environment variable CHROME_PATH must be set to executable of a build of Chromium version 54.0 or later.';
        this.code = "ERR_LAUNCHER_PATH_NOT_SET" /* ERR_LAUNCHER_PATH_NOT_SET */;
    }
}
exports.ChromePathNotSetError = ChromePathNotSetError;
class InvalidUserDataDirectoryError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'userDataDir must be false or a path.';
        this.code = "ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY" /* ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY */;
    }
}
exports.InvalidUserDataDirectoryError = InvalidUserDataDirectoryError;
class UnsupportedPlatformError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = `Platform ${getPlatform()} is not supported.`;
        this.code = "ERR_LAUNCHER_UNSUPPORTED_PLATFORM" /* ERR_LAUNCHER_UNSUPPORTED_PLATFORM */;
    }
}
exports.UnsupportedPlatformError = UnsupportedPlatformError;
class ChromeNotInstalledError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'No Chrome installations found.';
        this.code = "ERR_LAUNCHER_NOT_INSTALLED" /* ERR_LAUNCHER_NOT_INSTALLED */;
    }
}
exports.ChromeNotInstalledError = ChromeNotInstalledError;
function getPlatform() {
    return isWsl ? 'wsl' : process.platform;
}
exports.getPlatform = getPlatform;
function makeTmpDir() {
    switch (getPlatform()) {
        case 'darwin':
        case 'linux':
            return makeUnixTmpDir();
        case 'wsl':
            // We populate the user's Windows temp dir so the folder is correctly created later
            process.env.TEMP = getLocalAppDataPath(`${process.env.PATH}`);
        case 'win32':
            return makeWin32TmpDir();
        default:
            throw new UnsupportedPlatformError();
    }
}
exports.makeTmpDir = makeTmpDir;
function toWinDirFormat(dir = '') {
    const results = /\/mnt\/([a-z])\//.exec(dir);
    if (!results) {
        return dir;
    }
    const driveLetter = results[1];
    return dir.replace(`/mnt/${driveLetter}/`, `${driveLetter.toUpperCase()}:\\`)
        .replace(/\//g, '\\');
}
exports.toWinDirFormat = toWinDirFormat;
function getLocalAppDataPath(path) {
    const userRegExp = /\/mnt\/([a-z])\/Users\/([^\/:]+)\/AppData\//;
    const results = userRegExp.exec(path) || [];
    return `/mnt/${results[1]}/Users/${results[2]}/AppData/Local`;
}
exports.getLocalAppDataPath = getLocalAppDataPath;
function makeUnixTmpDir() {
    return child_process_1.execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
}
function makeWin32TmpDir() {
    const winTmpPath = process.env.TEMP || process.env.TMP ||
        (process.env.SystemRoot || process.env.windir) + '\\temp';
    const randomNumber = Math.floor(Math.random() * 9e7 + 1e7);
    const tmpdir = path_1.join(winTmpPath, 'lighthouse.' + randomNumber);
    mkdirp.sync(tmpdir);
    return tmpdir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0FBRWIsK0JBQTBCO0FBQzFCLGlEQUF1QztBQUN2QyxpQ0FBaUM7QUFDakMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBU2hDLFNBQWdCLFFBQVEsQ0FBSSxHQUFnQixFQUFFLEdBQU07SUFDbEQsT0FBTyxPQUFPLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0QkFFQztBQUVELFNBQXNCLEtBQUssQ0FBQyxJQUFZOztRQUN0QyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FBQTtBQUZELHNCQUVDO0FBRUQsTUFBYSxhQUFjLFNBQVEsS0FBSztJQUN0QyxZQUFtQixVQUFrQixrQkFBa0IsRUFBUyxJQUFhO1FBQzNFLEtBQUssRUFBRSxDQUFDO1FBRFMsWUFBTyxHQUFQLE9BQU8sQ0FBNkI7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFTO1FBRTNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFORCxzQ0FNQztBQUVELE1BQWEscUJBQXNCLFNBQVEsYUFBYTtJQUF4RDs7UUFDRSxZQUFPLEdBQ0gsOEdBQThHLENBQUM7UUFDbkgsU0FBSSwrREFBOEM7SUFDcEQsQ0FBQztDQUFBO0FBSkQsc0RBSUM7QUFFRCxNQUFhLDZCQUE4QixTQUFRLGFBQWE7SUFBaEU7O1FBQ0UsWUFBTyxHQUFHLHNDQUFzQyxDQUFD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