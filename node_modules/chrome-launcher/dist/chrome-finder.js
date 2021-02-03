/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.win32 = exports.wsl = exports.linux = exports.darwin = exports.darwinFast = void 0;
const fs = require('fs');
const path = require('path');
const { homedir } = require('os');
const { execSync, execFileSync } = require('child_process');
const escapeRegExp = require('escape-string-regexp');
const log = require('lighthouse-logger');
const utils_1 = require("./utils");
const newLineRegex = /\r?\n/;
/**
 * check for MacOS default app paths first to avoid waiting for the slow lsregister command
 */
function darwinFast() {
    const priorityOptions = [
        process.env.CHROME_PATH,
        process.env.LIGHTHOUSE_CHROMIUM_PATH,
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];
    for (const chromePath of priorityOptions) {
        if (chromePath && canAccess(chromePath))
            return chromePath;
    }
    return darwin()[0];
}
exports.darwinFast = darwinFast;
function darwin() {
    const suffixes = ['/Contents/MacOS/Google Chrome Canary', '/Contents/MacOS/Google Chrome'];
    const LSREGISTER = '/System/Library/Frameworks/CoreServices.framework' +
        '/Versions/A/Frameworks/LaunchServices.framework' +
        '/Versions/A/Support/lsregister';
    const installations = [];
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    execSync(`${LSREGISTER} -dump` +
        ' | grep -i \'google chrome\\( canary\\)\\?\\.app\'' +
        ' | awk \'{$1=""; print $0}\'')
        .toString()
        .split(newLineRegex)
        .forEach((inst) => {
        suffixes.forEach(suffix => {
            const execPath = path.join(inst.substring(0, inst.indexOf('.app') + 4).trim(), suffix);
            if (canAccess(execPath) && installations.indexOf(execPath) === -1) {
                installations.push(execPath);
            }
        });
    });
    // Retains one per line to maintain readability.
    // clang-format off
    const home = escapeRegExp(process.env.HOME || homedir());
    const priorities = [
        { regex: new RegExp(`^${home}/Applications/.*Chrome\\.app`), weight: 50 },
        { regex: new RegExp(`^${home}/Applications/.*Chrome Canary\\.app`), weight: 51 },
        { regex: /^\/Applications\/.*Chrome.app/, weight: 100 },
        { regex: /^\/Applications\/.*Chrome Canary.app/, weight: 101 },
        { regex: /^\/Volumes\/.*Chrome.app/, weight: -2 },
        { regex: /^\/Volumes\/.*Chrome Canary.app/, weight: -1 },
    ];
    if (process.env.LIGHTHOUSE_CHROMIUM_PATH) {
        priorities.unshift({ regex: new RegExp(escapeRegExp(process.env.LIGHTHOUSE_CHROMIUM_PATH)), weight: 150 });
    }
    if (process.env.CHROME_PATH) {
        priorities.unshift({ regex: new RegExp(escapeRegExp(process.env.CHROME_PATH)), weight: 151 });
    }
    // clang-format on
    return sort(installations, priorities);
}
exports.darwin = darwin;
function resolveChromePath() {
    if (canAccess(process.env.CHROME_PATH)) {
        return process.env.CHROME_PATH;
    }
    if (canAccess(process.env.LIGHTHOUSE_CHROMIUM_PATH)) {
        log.warn('ChromeLauncher', 'LIGHTHOUSE_CHROMIUM_PATH is deprecated, use CHROME_PATH env variable instead.');
        return process.env.LIGHTHOUSE_CHROMIUM_PATH;
    }
    return undefined;
}
/**
 * Look for linux executables in 3 ways
 * 1. Look into CHROME_PATH env variable
 * 2. Look into the directories where .desktop are saved on gnome based distro's
 * 3. Look for google-chrome-stable & google-chrome executables by using the which command
 */
function linux() {
    let installations = [];
    // 1. Look into CHROME_PATH env variable
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    // 2. Look into the directories where .desktop are saved on gnome based distro's
    const desktopInstallationFolders = [
        path.join(homedir(), '.local/share/applications/'),
        '/usr/share/applications/',
    ];
    desktopInstallationFolders.forEach(folder => {
        installations = installations.concat(findChromeExecutables(folder));
    });
    // Look for google-chrome(-stable) & chromium(-browser) executables by using the which command
    const executables = [
        'google-chrome-stable',
        'google-chrome',
        'chromium-browser',
        'chromium',
    ];
    executables.forEach((executable) => {
        try {
            const chromePath = execFileSync('which', [executable], { stdio: 'pipe' }).toString().split(newLineRegex)[0];
            if (canAccess(chromePath)) {
                installations.push(chromePath);
            }
        }
        catch (e) {
            // Not installed.
        }
    });
    if (!installations.length) {
        throw new utils_1.ChromePathNotSetError();
    }
    const priorities = [
        { regex: /chrome-wrapper$/, weight: 51 },
        { regex: /google-chrome-stable$/, weight: 50 },
        { regex: /google-chrome$/, weight: 49 },
        { regex: /chromium-browser$/, weight: 48 },
        { regex: /chromium$/, weight: 47 },
    ];
    if (process.env.LIGHTHOUSE_CHROMIUM_PATH) {
        priorities.unshift({ regex: new RegExp(escapeRegExp(process.env.LIGHTHOUSE_CHROMIUM_PATH)), weight: 100 });
    }
    if (process.env.CHROME_PATH) {
        priorities.unshift({ regex: new RegExp(escapeRegExp(process.env.CHROME_PATH)), weight: 101 });
    }
    return sort(uniq(installations.filter(Boolean)), priorities);
}
exports.linux = linux;
function wsl() {
    // Manually populate the environment variables assuming it's the default config
    process.env.LOCALAPPDATA = utils_1.getLocalAppDataPath(`${process.env.PATH}`);
    process.env.PROGRAMFILES = '/mnt/c/Program Files';
    process.env['PROGRAMFILES(X86)'] = '/mnt/c/Program Files (x86)';
    return win32();
}
exports.wsl = wsl;
function win32() {
    const installations = [];
    const suffixes = [
        `${path.sep}Google${path.sep}Chrome SxS${path.sep}Application${path.sep}chrome.exe`,
        `${path.sep}Google${path.sep}Chrome${path.sep}Application${path.sep}chrome.exe`
    ];
    const prefixes = [
        process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']
    ].filter(Boolean);
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    prefixes.forEach(prefix => suffixes.forEach(suffix => {
        const chromePath = path.join(prefix, suffix);
        if (canAccess(chromePath)) {
            installations.push(chromePath);
        }
    }));
    return installations;
}
exports.win32 = win32;
function sort(installations, priorities) {
    const defaultPriority = 10;
    return installations
        // assign priorities
        .map((inst) => {
        for (const pair of priorities) {
            if (pair.regex.test(inst)) {
                return { path: inst, weight: pair.weight };
            }
        }
        return { path: inst, weight: defaultPriority };
    })
        // sort based on priorities
        .sort((a, b) => (b.weight - a.weight))
        // remove priority flag
        .map(pair => pair.path);
}
function canAccess(file) {
    if (!file) {
        return false;
    }
    try {
        fs.accessSync(file);
        return true;
    }
    catch (e) {
        return false;
    }
}
function uniq(arr) {
    return Array.from(new Set(arr));
}
function findChromeExecutables(folder) {
    const argumentsRegex = /(^[^ ]+).*/; // Take everything up to the first space
    const chromeExecRegex = '^Exec=\/.*\/(google-chrome|chrome|chromium)-.*';
    let installations = [];
    if (canAccess(folder)) {
        // Output of the grep & print looks like:
        //    /opt/google/chrome/google-chrome --profile-directory
        //    /home/user/Downloads/chrome-linux/chrome-wrapper %U
        let execPaths;
        // Some systems do not support grep -R so fallback to -r.
        // See https://github.com/GoogleChrome/chrome-launcher/issues/46 for more context.
        try {
            execPaths = execSync(`grep -ER "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`, { stdio: 'pipe' });
        }
        catch (e) {
            execPaths = execSync(`grep -Er "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`, { stdio: 'pipe' });
        }
        execPaths = execPaths.toString()
            .split(newLineRegex)
            .map((execPath) => execPath.replace(argumentsRegex, '$1'));
        execPaths.forEach((execPath) => canAccess(execPath) && installations.push(execPath));
    }
    return installations;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWZpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaHJvbWUtZmluZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxZQUFZLENBQUM7OztBQUViLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBQyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNyRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUV6QyxtQ0FBbUU7QUFFbkUsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDO0FBSTdCOztHQUVHO0FBQ0gsU0FBZ0IsVUFBVTtJQUN4QixNQUFNLGVBQWUsR0FBNEI7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCO1FBQ3BDLDRFQUE0RTtRQUM1RSw4REFBOEQ7S0FDL0QsQ0FBQztJQUVGLEtBQUssTUFBTSxVQUFVLElBQUksZUFBZSxFQUFFO1FBQ3hDLElBQUksVUFBVSxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFBRSxPQUFPLFVBQVUsQ0FBQztLQUM1RDtJQUVELE9BQU8sTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEIsQ0FBQztBQWJELGdDQWFDO0FBRUQsU0FBZ0IsTUFBTTtJQUNwQixNQUFNLFFBQVEsR0FBRyxDQUFDLHNDQUFzQyxFQUFFLCtCQUErQixDQUFDLENBQUM7SUFFM0YsTUFBTSxVQUFV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