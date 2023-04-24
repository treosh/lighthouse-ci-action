/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChromePath = exports.killAll = exports.launch = exports.Launcher = void 0;
const fs = require("fs");
const net = require("net");
const chromeFinder = require("./chrome-finder");
const random_port_1 = require("./random-port");
const flags_1 = require("./flags");
const utils_1 = require("./utils");
const child_process_1 = require("child_process");
const log = require('lighthouse-logger');
const isWsl = utils_1.getPlatform() === 'wsl';
const isWindows = utils_1.getPlatform() === 'win32';
const _SIGINT = 'SIGINT';
const _SIGINT_EXIT_CODE = 130;
const _SUPPORTED_PLATFORMS = new Set(['darwin', 'linux', 'win32', 'wsl']);
const instances = new Set();
const sigintListener = () => {
    killAll();
    process.exit(_SIGINT_EXIT_CODE);
};
async function launch(opts = {}) {
    opts.handleSIGINT = utils_1.defaults(opts.handleSIGINT, true);
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
    return { pid: instance.pid, port: instance.port, kill, process: instance.chromeProcess };
}
exports.launch = launch;
/** Returns Chrome installation path that chrome-launcher will launch by default. */
function getChromePath() {
    const installation = Launcher.getFirstInstallation();
    if (!installation) {
        throw new utils_1.ChromeNotInstalledError();
    }
    return installation;
}
exports.getChromePath = getChromePath;
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
exports.killAll = killAll;
class Launcher {
    constructor(opts = {}, moduleOverrides = {}) {
        this.opts = opts;
        this.tmpDirandPidFileReady = false;
        this.fs = moduleOverrides.fs || fs;
        this.spawn = moduleOverrides.spawn || child_process_1.spawn;
        log.setLevel(utils_1.defaults(this.opts.logLevel, 'silent'));
        // choose the first one (default)
        this.startingUrl = utils_1.defaults(this.opts.startingUrl, 'about:blank');
        this.chromeFlags = utils_1.defaults(this.opts.chromeFlags, []);
        this.prefs = utils_1.defaults(this.opts.prefs, {});
        this.requestedPort = utils_1.defaults(this.opts.port, 0);
        this.chromePath = this.opts.chromePath;
        this.ignoreDefaultFlags = utils_1.defaults(this.opts.ignoreDefaultFlags, false);
        this.connectionPollInterval = utils_1.defaults(this.opts.connectionPollInterval, 500);
        this.maxConnectionRetries = utils_1.defaults(this.opts.maxConnectionRetries, 50);
        this.envVars = utils_1.defaults(opts.envVars, Object.assign({}, process.env));
        if (typeof this.opts.userDataDir === 'boolean') {
            if (!this.opts.userDataDir) {
                this.useDefaultProfile = true;
                this.userDataDir = undefined;
            }
            else {
                throw new utils_1.InvalidUserDataDirectoryError();
            }
        }
        else {
            this.useDefaultProfile = false;
            this.userDataDir = this.opts.userDataDir;
        }
    }
    get flags() {
        const flags = this.ignoreDefaultFlags ? [] : flags_1.DEFAULT_FLAGS.slice();
        flags.push(`--remote-debugging-port=${this.port}`);
        if (!this.ignoreDefaultFlags && utils_1.getPlatform() === 'linux') {
            flags.push('--disable-setuid-sandbox');
        }
        if (!this.useDefaultProfile) {
            // Place Chrome profile in a custom location we'll rm -rf later
            // If in WSL, we need to use the Windows format
            flags.push(`--user-data-dir=${isWsl ? utils_1.toWin32Path(this.userDataDir) : this.userDataDir}`);
        }
        if (process.env.HEADLESS)
            flags.push('--headless');
        flags.push(...this.chromeFlags);
        flags.push(this.startingUrl);
        return flags;
    }
    static defaultFlags() {
        return flags_1.DEFAULT_FLAGS.slice();
    }
    /** Returns the highest priority chrome installation. */
    static getFirstInstallation() {
        if (utils_1.getPlatform() === 'darwin')
            return chromeFinder.darwinFast();
        return chromeFinder[utils_1.getPlatform()]()[0];
    }
    /** Returns all available chrome installations in decreasing priority order. */
    static getInstallations() {
        return chromeFinder[utils_1.getPlatform()]();
    }
    // Wrapper function to enable easy testing.
    makeTmpDir() {
        return utils_1.makeTmpDir();
    }
    prepare() {
        const platform = utils_1.getPlatform();
        if (!_SUPPORTED_PLATFORMS.has(platform)) {
            throw new utils_1.UnsupportedPlatformError();
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
        const preferenceFile = `${this.userDataDir}/Preferences`;
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
                log.log('ChromeLauncher', `No debugging port found on port ${this.port}, launching a new Chrome.`);
            }
        }
        if (this.chromePath === undefined) {
            const installation = Launcher.getFirstInstallation();
            if (!installation) {
                throw new utils_1.ChromeNotInstalledError();
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
                this.port = await random_port_1.getRandomPort();
            }
            log.verbose('ChromeLauncher', `Launching with command:\n"${execPath}" ${this.flags.join(' ')}`);
            this.chromeProcess = this.spawn(execPath, this.flags, {
                // On non-windows platforms, `detached: true` makes child process a leader of a new
                // process group, making it possible to kill child process tree with `.kill(-pid)` command.
                // @see https://nodejs.org/api/child_process.html#child_process_options_detached
                detached: process.platform !== 'win32',
                stdio: ['ignore', this.outFile, this.errFile],
                env: this.envVars
            });
            if (this.chromeProcess.pid) {
                this.fs.writeFileSync(this.pidFile, this.chromeProcess.pid.toString());
            }
            log.verbose('ChromeLauncher', `Chrome running with pid ${this.chromeProcess.pid} on port ${this.port}.`);
            return this.chromeProcess.pid;
        })();
        const pid = await spawnPromise;
        await this.waitUntilReady();
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
                    utils_1.delay(launcher.connectionPollInterval).then(poll);
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
                const taskkillProc = child_process_1.spawnSync(`taskkill /pid ${this.chromeProcess.pid} /T /F`, { shell: true, encoding: 'utf-8' });
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
        // Only clean up the tmp dir if we created it.
        if (this.userDataDir === undefined || this.opts.userDataDir !== undefined) {
            return;
        }
        if (this.outFile) {
            this.fs.closeSync(this.outFile);
            delete this.outFile;
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
exports.Launcher = Launcher;
;
exports.default = Launcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWxhdW5jaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Nocm9tZS1sYXVuY2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gsWUFBWSxDQUFDOzs7QUFHYix5QkFBeUI7QUFDekIsMkJBQTJCO0FBQzNCLGdEQUFnRDtBQUNoRCwrQ0FBNEM7QUFDNUMsbUNBQXNDO0FBQ3RDLG1DQUFnSztBQUVoSyxpREFBK0M7QUFDL0MsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekMsTUFBTSxLQUFLLEdBQUcsbUJBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztBQUN0QyxNQUFNLFNBQVMsR0FBRyxtQkFBVyxFQUFFLEtBQUssT0FBTyxDQUFDO0FBQzVDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUN6QixNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUM5QixNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUkxRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBWSxDQUFDO0FBK0J0QyxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDMUIsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBRUYsS0FBSyxVQUFVLE1BQU0sQ0FBQyxPQUFnQixFQUFFO0lBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXRELE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBDLGlEQUFpRDtJQUNqRCxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksU0FBUyxD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