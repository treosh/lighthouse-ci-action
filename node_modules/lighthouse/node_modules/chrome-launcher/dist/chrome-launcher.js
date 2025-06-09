/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
import * as fs from 'fs';
import * as net from 'net';
import * as chromeFinder from './chrome-finder.js';
import { getRandomPort } from './random-port.js';
import { DEFAULT_FLAGS } from './flags.js';
import { makeTmpDir, defaults, delay, getPlatform, toWin32Path, InvalidUserDataDirectoryError, UnsupportedPlatformError, ChromeNotInstalledError } from './utils.js';
import { spawn, spawnSync } from 'child_process';
import log from 'lighthouse-logger';
const isWsl = getPlatform() === 'wsl';
const isWindows = getPlatform() === 'win32';
const _SIGINT = 'SIGINT';
const _SIGINT_EXIT_CODE = 130;
const _SUPPORTED_PLATFORMS = new Set(['darwin', 'linux', 'win32', 'wsl']);
const instances = new Set();
const sigintListener = () => {
    killAll();
    process.exit(_SIGINT_EXIT_CODE);
};
async function launch(opts = {}) {
    opts.handleSIGINT = defaults(opts.handleSIGINT, true);
    const instance = new Launcher(opts);
    // Kill spawned Chrome process in case of ctrl-C.
    if (opts.handleSIGINT && instances.size === 0) {
        process.on(_SIGINT, sigintListener);
    }
    instances.add(instance);
    await instance.launch();
    const kill = () => {
        instances.delete(instance);
        if (instances.size === 0) {
            process.removeListener(_SIGINT, sigintListener);
        }
        instance.kill();
    };
    return {
        pid: instance.pid,
        port: instance.port,
        process: instance.chromeProcess,
        remoteDebuggingPipes: instance.remoteDebuggingPipes,
        kill,
    };
}
/** Returns Chrome installation path that chrome-launcher will launch by default. */
function getChromePath() {
    const installation = Launcher.getFirstInstallation();
    if (!installation) {
        throw new ChromeNotInstalledError();
    }
    return installation;
}
function killAll() {
    let errors = [];
    for (const instance of instances) {
        try {
            instance.kill();
            // only delete if kill did not error
            // this means erroring instances remain in the Set
            instances.delete(instance);
        }
        catch (err) {
            errors.push(err);
        }
    }
    return errors;
}
class Launcher {
    constructor(opts = {}, moduleOverrides = {}) {
        this.opts = opts;
        this.tmpDirandPidFileReady = false;
        this.remoteDebuggingPipes = null;
        this.fs = moduleOverrides.fs || fs;
        this.spawn = moduleOverrides.spawn || spawn;
        log.setLevel(defaults(this.opts.logLevel, 'silent'));
        // choose the first one (default)
        this.startingUrl = defaults(this.opts.startingUrl, 'about:blank');
        this.chromeFlags = defaults(this.opts.chromeFlags, []);
        this.prefs = defaults(this.opts.prefs, {});
        this.requestedPort = defaults(this.opts.port, 0);
        this.portStrictMode = opts.portStrictMode;
        this.chromePath = this.opts.chromePath;
        this.ignoreDefaultFlags = defaults(this.opts.ignoreDefaultFlags, false);
        this.connectionPollInterval = defaults(this.opts.connectionPollInterval, 500);
        this.maxConnectionRetries = defaults(this.opts.maxConnectionRetries, 50);
        this.envVars = defaults(opts.envVars, Object.assign({}, process.env));
        if (typeof this.opts.userDataDir === 'boolean') {
            if (!this.opts.userDataDir) {
                this.useDefaultProfile = true;
                this.userDataDir = undefined;
            }
            else {
                throw new InvalidUserDataDirectoryError();
            }
        }
        else {
            this.useDefaultProfile = false;
            this.userDataDir = this.opts.userDataDir;
        }
        // Using startsWith because it could also be --remote-debugging-pipe=cbor
        this.useRemoteDebuggingPipe =
            this.chromeFlags.some(f => f.startsWith('--remote-debugging-pipe'));
    }
    get flags() {
        const flags = this.ignoreDefaultFlags ? [] : DEFAULT_FLAGS.slice();
        // When useRemoteDebuggingPipe is true, this.port defaults to 0.
        if (this.port) {
            flags.push(`--remote-debugging-port=${this.port}`);
        }
        if (!this.ignoreDefaultFlags && getPlatform() === 'linux') {
            flags.push('--disable-setuid-sandbox');
        }
        if (!this.useDefaultProfile) {
            // Place Chrome profile in a custom location we'll rm -rf later
            // If in WSL, we need to use the Windows format
            flags.push(`--user-data-dir=${isWsl ? toWin32Path(this.userDataDir) : this.userDataDir}`);
        }
        if (process.env.HEADLESS)
            flags.push('--headless');
        flags.push(...this.chromeFlags);
        flags.push(this.startingUrl);
        return flags;
    }
    static defaultFlags() {
        return DEFAULT_FLAGS.slice();
    }
    /** Returns the highest priority chrome installation. */
    static getFirstInstallation() {
        if (getPlatform() === 'darwin')
            return chromeFinder.darwinFast();
        return chromeFinder[getPlatform()]()[0];
    }
    /** Returns all available chrome installations in decreasing priority order. */
    static getInstallations() {
        return chromeFinder[getPlatform()]();
    }
    // Wrapper function to enable easy testing.
    makeTmpDir() {
        return makeTmpDir();
    }
    prepare() {
        const platform = getPlatform();
        if (!_SUPPORTED_PLATFORMS.has(platform)) {
            throw new UnsupportedPlatformError();
        }
        this.userDataDir = this.userDataDir || this.makeTmpDir();
        this.outFile = this.fs.openSync(`${this.userDataDir}/chrome-out.log`, 'a');
        this.errFile = this.fs.openSync(`${this.userDataDir}/chrome-err.log`, 'a');
        this.setBrowserPrefs();
        // fix for Node4
        // you can't pass a fd to fs.writeFileSync
        this.pidFile = `${this.userDataDir}/chrome.pid`;
        log.verbose('ChromeLauncher', `created ${this.userDataDir}`);
        this.tmpDirandPidFileReady = true;
    }
    setBrowserPrefs() {
        // don't set prefs if not defined
        if (Object.keys(this.prefs).length === 0) {
            return;
        }
        const profileDir = `${this.userDataDir}/Default`;
        if (!this.fs.existsSync(profileDir)) {
            this.fs.mkdirSync(profileDir, { recursive: true });
        }
        const preferenceFile = `${profileDir}/Preferences`;
        try {
            if (this.fs.existsSync(preferenceFile)) {
                // overwrite existing file
                const file = this.fs.readFileSync(preferenceFile, 'utf-8');
                const content = JSON.parse(file);
                this.fs.writeFileSync(preferenceFile, JSON.stringify({ ...content, ...this.prefs }), 'utf-8');
            }
            else {
                // create new Preference file
                this.fs.writeFileSync(preferenceFile, JSON.stringify({ ...this.prefs }), 'utf-8');
            }
        }
        catch (err) {
            log.log('ChromeLauncher', `Failed to set browser prefs: ${err.message}`);
        }
    }
    async launch() {
        if (this.requestedPort !== 0) {
            this.port = this.requestedPort;
            // If an explict port is passed first look for an open connection...
            try {
                await this.isDebuggerReady();
                log.log('ChromeLauncher', `Found existing Chrome already running using port ${this.port}, using that.`);
                return;
            }
            catch (err) {
                if (this.portStrictMode) {
                    throw new Error(`found no Chrome at port ${this.requestedPort}`);
                }
                log.log('ChromeLauncher', `No debugging port found on port ${this.port}, launching a new Chrome.`);
            }
        }
        if (this.chromePath === undefined) {
            const installation = Launcher.getFirstInstallation();
            if (!installation) {
                throw new ChromeNotInstalledError();
            }
            this.chromePath = installation;
        }
        if (!this.tmpDirandPidFileReady) {
            this.prepare();
        }
        this.pid = await this.spawnProcess(this.chromePath);
        return Promise.resolve();
    }
    async spawnProcess(execPath) {
        const spawnPromise = (async () => {
            if (this.chromeProcess) {
                log.log('ChromeLauncher', `Chrome already running with pid ${this.chromeProcess.pid}.`);
                return this.chromeProcess.pid;
            }
            // If a zero value port is set, it means the launcher
            // is responsible for generating the port number.
            // We do this here so that we can know the port before
            // we pass it into chrome.
            if (this.requestedPort === 0) {
                if (this.useRemoteDebuggingPipe) {
                    // When useRemoteDebuggingPipe is true, this.port defaults to 0.
                    this.port = 0;
                }
                else {
                    this.port = await getRandomPort();
                }
            }
            log.verbose('ChromeLauncher', `Launching with command:\n"${execPath}" ${this.flags.join(' ')}`);
            this.chromeProcess = this.spawn(execPath, this.flags, {
                // On non-windows platforms, `detached: true` makes child process a leader of a new
                // process group, making it possible to kill child process tree with `.kill(-pid)` command.
                // @see https://nodejs.org/api/child_process.html#child_process_options_detached
                detached: process.platform !== 'win32',
                stdio: this.useRemoteDebuggingPipe ?
                    ['ignore', this.outFile, this.errFile, 'pipe', 'pipe'] :
                    ['ignore', this.outFile, this.errFile],
                env: this.envVars
            });
            if (this.chromeProcess.pid) {
                this.fs.writeFileSync(this.pidFile, this.chromeProcess.pid.toString());
            }
            if (this.useRemoteDebuggingPipe) {
                this.remoteDebuggingPipes = {
                    incoming: this.chromeProcess.stdio[4],
                    outgoing: this.chromeProcess.stdio[3],
                };
            }
            log.verbose('ChromeLauncher', `Chrome running with pid ${this.chromeProcess.pid} on port ${this.port}.`);
            return this.chromeProcess.pid;
        })();
        const pid = await spawnPromise;
        // When useRemoteDebuggingPipe is true, this.port defaults to 0.
        if (this.port !== 0) {
            await this.waitUntilReady();
        }
        return pid;
    }
    cleanup(client) {
        if (client) {
            client.removeAllListeners();
            client.end();
            client.destroy();
            client.unref();
        }
    }
    // resolves if ready, rejects otherwise
    isDebuggerReady() {
        return new Promise((resolve, reject) => {
            // Note: only meaningful when this.port is set.
            // When useRemoteDebuggingPipe is true, this.port defaults to 0. In that
            // case, we could consider ping-ponging over the pipe, but that may get
            // in the way of the library user, so we do not.
            const client = net.createConnection(this.port, '127.0.0.1');
            client.once('error', err => {
                this.cleanup(client);
                reject(err);
            });
            client.once('connect', () => {
                this.cleanup(client);
                resolve();
            });
        });
    }
    // resolves when debugger is ready, rejects after 10 polls
    waitUntilReady() {
        const launcher = this;
        return new Promise((resolve, reject) => {
            let retries = 0;
            let waitStatus = 'Waiting for browser.';
            const poll = () => {
                if (retries === 0) {
                    log.log('ChromeLauncher', waitStatus);
                }
                retries++;
                waitStatus += '..';
                log.log('ChromeLauncher', waitStatus);
                launcher.isDebuggerReady()
                    .then(() => {
                    log.log('ChromeLauncher', waitStatus + `${log.greenify(log.tick)}`);
                    resolve();
                })
                    .catch(err => {
                    if (retries > launcher.maxConnectionRetries) {
                        log.error('ChromeLauncher', err.message);
                        const stderr = this.fs.readFileSync(`${this.userDataDir}/chrome-err.log`, { encoding: 'utf-8' });
                        log.error('ChromeLauncher', `Logging contents of ${this.userDataDir}/chrome-err.log`);
                        log.error('ChromeLauncher', stderr);
                        return reject(err);
                    }
                    delay(launcher.connectionPollInterval).then(poll);
                });
            };
            poll();
        });
    }
    kill() {
        if (!this.chromeProcess) {
            return;
        }
        this.chromeProcess.on('close', () => {
            delete this.chromeProcess;
            this.destroyTmp();
        });
        log.log('ChromeLauncher', `Killing Chrome instance ${this.chromeProcess.pid}`);
        try {
            if (isWindows) {
                // https://github.com/GoogleChrome/chrome-launcher/issues/266
                const taskkillProc = spawnSync(`taskkill /pid ${this.chromeProcess.pid} /T /F`, { shell: true, encoding: 'utf-8' });
                const { stderr } = taskkillProc;
                if (stderr)
                    log.error('ChromeLauncher', `taskkill stderr`, stderr);
            }
            else {
                if (this.chromeProcess.pid) {
                    process.kill(-this.chromeProcess.pid, 'SIGKILL');
                }
            }
        }
        catch (err) {
            const message = `Chrome could not be killed ${err.message}`;
            log.warn('ChromeLauncher', message);
        }
        this.destroyTmp();
    }
    destroyTmp() {
        if (this.outFile) {
            this.fs.closeSync(this.outFile);
            delete this.outFile;
        }
        // Only clean up the tmp dir if we created it.
        if (this.userDataDir === undefined || this.opts.userDataDir !== undefined) {
            return;
        }
        if (this.errFile) {
            this.fs.closeSync(this.errFile);
            delete this.errFile;
        }
        // backwards support for node v12 + v14.14+
        // https://nodejs.org/api/deprecations.html#DEP0147
        const rmSync = this.fs.rmSync || this.fs.rmdirSync;
        rmSync(this.userDataDir, { recursive: true, force: true, maxRetries: 10 });
    }
}
;
export default Launcher;
export { Launcher, launch, killAll, getChromePath };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWxhdW5jaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Nocm9tZS1sYXVuY2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gsWUFBWSxDQUFDO0FBR2IsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDekIsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDM0IsT0FBTyxLQUFLLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSw2QkFBNkIsRUFBRSx3QkFBd0IsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVuSyxPQUFPLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztBQUVwQyxNQUFNLEtBQUssR0FBRyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUM7QUFDdEMsTUFBTSxTQUFTLEdBQUcsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDO0FBQzVDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUN6QixNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUM5QixNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUkxRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBWSxDQUFDO0FBcUN0QyxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDMUIsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLENBQUMs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