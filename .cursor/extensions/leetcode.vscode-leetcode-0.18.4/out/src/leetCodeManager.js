"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
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
exports.leetCodeManager = void 0;
const cp = require("child_process");
const events_1 = require("events");
const vscode = require("vscode");
const leetCodeChannel_1 = require("./leetCodeChannel");
const leetCodeExecutor_1 = require("./leetCodeExecutor");
const shared_1 = require("./shared");
const cpUtils_1 = require("./utils/cpUtils");
const uiUtils_1 = require("./utils/uiUtils");
const wsl = require("./utils/wslUtils");
const plugin_1 = require("./commands/plugin");
const globalState_1 = require("./globalState");
const query_user_data_1 = require("./request/query-user-data");
const toolUtils_1 = require("./utils/toolUtils");
class LeetCodeManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.successRegex = /(?:.*)Successfully .*login as (.*)/i;
        this.failRegex = /.*\[ERROR\].*/i;
        this.currentUser = undefined;
        this.userStatus = shared_1.UserStatus.SignedOut;
        this.handleUriSignIn = this.handleUriSignIn.bind(this);
    }
    getLoginStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield leetCodeExecutor_1.leetCodeExecutor.getUserInfo();
                this.currentUser = this.tryParseUserName(result);
                this.userStatus = shared_1.UserStatus.SignedIn;
            }
            catch (error) {
                this.currentUser = undefined;
                this.userStatus = shared_1.UserStatus.SignedOut;
                globalState_1.globalState.removeAll();
            }
            finally {
                this.emit("statusChanged");
            }
        });
    }
    updateUserStatusWithCookie(cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            globalState_1.globalState.setCookie(cookie);
            const data = yield query_user_data_1.queryUserData();
            globalState_1.globalState.setUserStatus(data);
            yield this.setCookieToCli(cookie, data.username);
            if (data.username) {
                vscode.window.showInformationMessage(`Successfully ${data.username}.`);
                this.currentUser = data.username;
                this.userStatus = shared_1.UserStatus.SignedIn;
                this.emit("statusChanged");
            }
        });
    }
    handleUriSignIn(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, (progress) => __awaiter(this, void 0, void 0, function* () {
                    progress.report({ message: "Fetching user data..." });
                    const queryParams = toolUtils_1.parseQuery(uri.query);
                    const cookie = queryParams["cookie"];
                    if (!cookie) {
                        uiUtils_1.promptForOpenOutputChannel(`Failed to get cookie. Please log in again`, uiUtils_1.DialogType.error);
                        return;
                    }
                    yield this.updateUserStatusWithCookie(cookie);
                }));
            }
            catch (error) {
                uiUtils_1.promptForOpenOutputChannel(`Failed to log in. Please open the output channel for details`, uiUtils_1.DialogType.error);
            }
        });
    }
    handleInputCookieSignIn() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookie = yield vscode.window.showInputBox({
                prompt: 'Enter LeetCode Cookie',
                password: true,
                ignoreFocusOut: true,
                validateInput: (s) => s ? undefined : 'Cookie must not be empty',
            });
            yield this.updateUserStatusWithCookie(cookie || '');
        });
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            const picks = [];
            picks.push({
                label: 'Web Authorization',
                detail: 'Open browser to authorize login on the website',
                value: 'WebAuth',
                description: '[Recommended]'
            }, {
                label: 'LeetCode Cookie',
                detail: 'Use LeetCode cookie copied from browser to login',
                value: 'Cookie',
            });
            const choice = yield vscode.window.showQuickPick(picks);
            if (!choice) {
                return;
            }
            const loginMethod = choice.value;
            if (loginMethod === 'WebAuth') {
                uiUtils_1.openUrl(this.getAuthLoginUrl());
                return;
            }
            try {
                yield vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Fetching user data..." }, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.handleInputCookieSignIn();
                }));
            }
            catch (error) {
                uiUtils_1.promptForOpenOutputChannel(`Failed to log in. Please open the output channel for details`, uiUtils_1.DialogType.error);
            }
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield leetCodeExecutor_1.leetCodeExecutor.signOut();
                vscode.window.showInformationMessage("Successfully signed out.");
                this.currentUser = undefined;
                this.userStatus = shared_1.UserStatus.SignedOut;
                globalState_1.globalState.removeAll();
                this.emit("statusChanged");
            }
            catch (error) {
                // swallow the error when sign out.
            }
        });
    }
    getStatus() {
        return this.userStatus;
    }
    getUser() {
        return this.currentUser;
    }
    tryParseUserName(output) {
        const reg = /^\s*.\s*(.+?)\s*https:\/\/leetcode/m;
        const match = output.match(reg);
        if (match && match.length === 2) {
            return match[1].trim();
        }
        return "Unknown";
    }
    getAuthLoginUrl() {
        switch (plugin_1.getLeetCodeEndpoint()) {
            case shared_1.Endpoint.LeetCodeCN:
                return shared_1.urlsCn.authLoginUrl;
            case shared_1.Endpoint.LeetCode:
            default:
                return shared_1.urls.authLoginUrl;
        }
    }
    setCookieToCli(cookie, name) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const leetCodeBinaryPath = yield leetCodeExecutor_1.leetCodeExecutor.getLeetCodeBinaryPath();
            const childProc = wsl.useWsl()
                ? cp.spawn("wsl", [leetCodeExecutor_1.leetCodeExecutor.node, leetCodeBinaryPath, "user", (_a = shared_1.loginArgsMapping.get("Cookie")) !== null && _a !== void 0 ? _a : ""], {
                    shell: true,
                })
                : cp.spawn(leetCodeExecutor_1.leetCodeExecutor.node, [leetCodeBinaryPath, "user", (_b = shared_1.loginArgsMapping.get("Cookie")) !== null && _b !== void 0 ? _b : ""], {
                    shell: true,
                    env: cpUtils_1.createEnvOption(),
                });
            (_c = childProc.stdout) === null || _c === void 0 ? void 0 : _c.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
                var _e, _f, _g, _h;
                data = data.toString();
                leetCodeChannel_1.leetCodeChannel.append(data);
                const successMatch = data.match(this.successRegex);
                if (successMatch && successMatch[1]) {
                    (_e = childProc.stdin) === null || _e === void 0 ? void 0 : _e.end();
                    return resolve();
                }
                else if (data.match(this.failRegex)) {
                    (_f = childProc.stdin) === null || _f === void 0 ? void 0 : _f.end();
                    return reject(new Error("Faile to login"));
                }
                else if (data.match(/login: /)) {
                    (_g = childProc.stdin) === null || _g === void 0 ? void 0 : _g.write(`${name}\n`);
                }
                else if (data.match(/cookie: /)) {
                    (_h = childProc.stdin) === null || _h === void 0 ? void 0 : _h.write(`${cookie}\n`);
                }
            }));
            (_d = childProc.stderr) === null || _d === void 0 ? void 0 : _d.on("data", (data) => leetCodeChannel_1.leetCodeChannel.append(data.toString()));
            childProc.on("error", reject);
        }));
    }
}
exports.leetCodeManager = new LeetCodeManager();
//# sourceMappingURL=leetCodeManager.js.map