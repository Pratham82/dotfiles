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
class LeetCodeManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.successRegex = /(?:.*)Successfully .*login as (.*)/i;
        this.failRegex = /.*\[ERROR\].*/i;
        this.currentUser = undefined;
        this.userStatus = shared_1.UserStatus.SignedOut;
    }
    getLoginStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield leetCodeExecutor_1.leetCodeExecutor.getUserInfo();
                console.log("%c [ result ]-29", "font-size:13px; background:pink; color:#bf2c9f;", result);
                this.currentUser = this.tryParseUserName(result);
                this.userStatus = shared_1.UserStatus.SignedIn;
            }
            catch (error) {
                this.currentUser = undefined;
                this.userStatus = shared_1.UserStatus.SignedOut;
            }
            finally {
                this.emit("statusChanged");
            }
        });
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                uiUtils_1.openUrl(this.getAuthLoginUrl());
                const cookie = yield this.getCookieByAuthLogin();
                if (!cookie)
                    return;
                globalState_1.globalState.setCookie(cookie);
                const data = yield query_user_data_1.queryUserData();
                console.log("%c [ data ]-54", "font-size:13px; background:pink; color:#bf2c9f;", data);
                this.setCookieToCli(cookie, "");
                // if (userName) {
                //     vscode.window.showInformationMessage(`Successfully .`);
                //     this.currentUser = userName;
                //     this.userStatus = UserStatus.SignedIn;
                //     this.emit("statusChanged");
                // }
            }
            catch (error) {
                uiUtils_1.promptForOpenOutputChannel(`Failed to . Please open the output channel for details`, uiUtils_1.DialogType.error);
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
    getCookieByAuthLogin() {
        return new Promise((resolve) => {
            vscode.window.registerUriHandler({
                handleUri: (uri) => __awaiter(this, void 0, void 0, function* () {
                    const queryParams = new URLSearchParams(uri.query);
                    console.log("%c [ queryParams ]-47", "font-size:13px; background:pink; color:#bf2c9f;", queryParams, queryParams.has("cookie"), queryParams.get("cookie"));
                    if (queryParams.has("cookie")) {
                        resolve(queryParams.get("cookie"));
                    }
                }),
            });
        });
    }
    setCookieToCli(cookie, name) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const leetCodeBinaryPath = yield leetCodeExecutor_1.leetCodeExecutor.getLeetCodeBinaryPath();
            const childProc = wsl.useWsl()
                ? cp.spawn("wsl", [
                    leetCodeExecutor_1.leetCodeExecutor.node,
                    leetCodeBinaryPath,
                    "user",
                    (_a = shared_1.loginArgsMapping.get("Cookie")) !== null && _a !== void 0 ? _a : "",
                ], {
                    shell: true,
                })
                : cp.spawn(leetCodeExecutor_1.leetCodeExecutor.node, [leetCodeBinaryPath, "user", (_b = shared_1.loginArgsMapping.get("Cookie")) !== null && _b !== void 0 ? _b : ""], {
                    shell: true,
                    env: cpUtils_1.createEnvOption(),
                });
            (_c = childProc.stdout) === null || _c === void 0 ? void 0 : _c.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
                var _g, _h, _j;
                data = data.toString();
                console.log("%c [ data ]-92", "font-size:13px; background:pink; color:#bf2c9f;", data);
                leetCodeChannel_1.leetCodeChannel.append(data);
                if (data.includes("twoFactorCode")) {
                    const twoFactor = yield vscode.window.showInputBox({
                        prompt: "Enter two-factor code.",
                        ignoreFocusOut: true,
                        validateInput: (s) => s && s.trim() ? undefined : "The input must not be empty",
                    });
                    if (!twoFactor) {
                        childProc.kill();
                        return resolve(undefined);
                    }
                    (_g = childProc.stdin) === null || _g === void 0 ? void 0 : _g.write(`${twoFactor}\n`);
                }
                const successMatch = data.match(this.successRegex);
                if (successMatch && successMatch[1]) {
                    (_h = childProc.stdin) === null || _h === void 0 ? void 0 : _h.end();
                    return resolve();
                }
                else if (data.match(this.failRegex)) {
                    (_j = childProc.stdin) === null || _j === void 0 ? void 0 : _j.end();
                    return reject(new Error("Faile to login"));
                }
            }));
            (_d = childProc.stderr) === null || _d === void 0 ? void 0 : _d.on("data", (data) => leetCodeChannel_1.leetCodeChannel.append(data.toString()));
            childProc.on("error", reject);
            (_e = childProc.stdin) === null || _e === void 0 ? void 0 : _e.write(`${name}\n`);
            (_f = childProc.stdin) === null || _f === void 0 ? void 0 : _f.write(`${cookie}\n`);
        }));
    }
}
exports.leetCodeManager = new LeetCodeManager();
//# sourceMappingURL=temp.js.map