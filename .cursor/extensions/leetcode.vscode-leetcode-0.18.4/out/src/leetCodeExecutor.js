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
exports.leetCodeExecutor = void 0;
const fse = require("fs-extra");
const os = require("os");
const path = require("path");
const requireFromString = require("require-from-string");
const vscode_1 = require("vscode");
const shared_1 = require("./shared");
const cpUtils_1 = require("./utils/cpUtils");
const uiUtils_1 = require("./utils/uiUtils");
const wsl = require("./utils/wslUtils");
const wslUtils_1 = require("./utils/wslUtils");
class LeetCodeExecutor {
    constructor() {
        this.leetCodeRootPath = path.join(__dirname, "..", "..", "node_modules", "vsc-leetcode-cli");
        this.nodeExecutable = this.getNodePath();
        this.configurationChangeListener = vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("leetcode.nodePath")) {
                this.nodeExecutable = this.getNodePath();
            }
        }, this);
    }
    getLeetCodeBinaryPath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                return `${yield wsl.toWslPath(`"${path.join(this.leetCodeRootPath, "bin", "leetcode")}"`)}`;
            }
            return `"${path.join(this.leetCodeRootPath, "bin", "leetcode")}"`;
        });
    }
    meetRequirements(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasInited = context.globalState.get(shared_1.leetcodeHasInited);
            if (!hasInited) {
                yield this.removeOldCache();
            }
            if (this.nodeExecutable !== "node") {
                if (!(yield fse.pathExists(this.nodeExecutable))) {
                    throw new Error(`The Node.js executable does not exist on path ${this.nodeExecutable}`);
                }
                // Wrap the executable with "" to avoid space issue in the path.
                this.nodeExecutable = `"${this.nodeExecutable}"`;
                if (wslUtils_1.useWsl()) {
                    this.nodeExecutable = yield wslUtils_1.toWslPath(this.nodeExecutable);
                }
            }
            try {
                yield this.executeCommandEx(this.nodeExecutable, ["-v"]);
            }
            catch (error) {
                const choice = yield vscode_1.window.showErrorMessage("LeetCode extension needs Node.js installed in environment path", uiUtils_1.DialogOptions.open);
                if (choice === uiUtils_1.DialogOptions.open) {
                    uiUtils_1.openUrl("https://nodejs.org");
                }
                return false;
            }
            for (const plugin of shared_1.supportedPlugins) {
                try { // Check plugin
                    yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-e", plugin]);
                }
                catch (error) { // Remove old cache that may cause the error download plugin and activate
                    yield this.removeOldCache();
                    yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-i", plugin]);
                }
            }
            // Set the global state HasInited true to skip delete old cache after init
            context.globalState.update(shared_1.leetcodeHasInited, true);
            return true;
        });
    }
    deleteCache() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "cache", "-d"]);
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "user"]);
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "user", "-L"]);
        });
    }
    listProblems(showLocked, needTranslation) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = [yield this.getLeetCodeBinaryPath(), "list"];
            if (!needTranslation) {
                cmd.push("-T"); // use -T to prevent translation
            }
            if (!showLocked) {
                cmd.push("-q");
                cmd.push("L");
            }
            return yield this.executeCommandEx(this.nodeExecutable, cmd);
        });
    }
    showProblem(problemNode, language, filePath, showDescriptionInComment = false, needTranslation) {
        return __awaiter(this, void 0, void 0, function* () {
            const templateType = showDescriptionInComment ? "-cx" : "-c";
            const cmd = [yield this.getLeetCodeBinaryPath(), "show", problemNode.id, templateType, "-l", language];
            if (!needTranslation) {
                cmd.push("-T"); // use -T to force English version
            }
            if (!(yield fse.pathExists(filePath))) {
                yield fse.createFile(filePath);
                const codeTemplate = yield this.executeCommandWithProgressEx("Fetching problem data...", this.nodeExecutable, cmd);
                yield fse.writeFile(filePath, codeTemplate);
            }
        });
    }
    /**
     * This function returns solution of a problem identified by input
     *
     * @remarks
     * Even though this function takes the needTranslation flag, it is important to note
     * that as of vsc-leetcode-cli 2.8.0, leetcode-cli doesn't support querying solution
     * on CN endpoint yet. So this flag doesn't have any effect right now.
     *
     * @param input - parameter to pass to cli that can identify a problem
     * @param language - the source code language of the solution desired
     * @param needTranslation - whether or not to use endPoint translation on solution query
     * @returns promise of the solution string
     */
    showSolution(input, language, needTranslation) {
        return __awaiter(this, void 0, void 0, function* () {
            // solution don't support translation
            const cmd = [yield this.getLeetCodeBinaryPath(), "show", input, "--solution", "-l", language];
            if (!needTranslation) {
                cmd.push("-T");
            }
            const solution = yield this.executeCommandWithProgressEx("Fetching top voted solution from discussions...", this.nodeExecutable, cmd);
            return solution;
        });
    }
    getDescription(problemNodeId, needTranslation) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = [yield this.getLeetCodeBinaryPath(), "show", problemNodeId, "-x"];
            if (!needTranslation) {
                cmd.push("-T");
            }
            return yield this.executeCommandWithProgressEx("Fetching problem description...", this.nodeExecutable, cmd);
        });
    }
    listSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session"]);
        });
    }
    enableSession(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session", "-e", name]);
        });
    }
    createSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session", "-c", id]);
        });
    }
    deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session", "-d", id]);
        });
    }
    submitSolution(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "submit", `"${filePath}"`]);
            }
            catch (error) {
                if (error.result) {
                    return error.result;
                }
                throw error;
            }
        });
    }
    testSolution(filePath, testString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (testString) {
                return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "test", `"${filePath}"`, "-t", `${testString}`]);
            }
            return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "test", `"${filePath}"`]);
        });
    }
    switchEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (endpoint) {
                case shared_1.Endpoint.LeetCodeCN:
                    return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-e", "leetcode.cn"]);
                case shared_1.Endpoint.LeetCode:
                default:
                    return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-d", "leetcode.cn"]);
            }
        });
    }
    toggleFavorite(node, addToFavorite) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandParams = [yield this.getLeetCodeBinaryPath(), "star", node.id];
            if (!addToFavorite) {
                commandParams.push("-d");
            }
            yield this.executeCommandWithProgressEx("Updating the favorite list...", "node", commandParams);
        });
    }
    getCompaniesAndTags() {
        return __awaiter(this, void 0, void 0, function* () {
            // preprocess the plugin source
            const companiesTagsPath = path.join(this.leetCodeRootPath, "lib", "plugins", "company.js");
            const companiesTagsSrc = (yield fse.readFile(companiesTagsPath, "utf8")).replace("module.exports = plugin", "module.exports = { COMPONIES, TAGS }");
            const { COMPONIES, TAGS } = requireFromString(companiesTagsSrc, companiesTagsPath);
            return { companies: COMPONIES, tags: TAGS };
        });
    }
    get node() {
        return this.nodeExecutable;
    }
    dispose() {
        this.configurationChangeListener.dispose();
    }
    getNodePath() {
        const extensionConfig = vscode_1.workspace.getConfiguration("leetcode", null);
        return extensionConfig.get("nodePath", "node" /* default value */);
    }
    executeCommandEx(command, args, options = { shell: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                return yield cpUtils_1.executeCommand("wsl", [command].concat(args), options);
            }
            return yield cpUtils_1.executeCommand(command, args, options);
        });
    }
    executeCommandWithProgressEx(message, command, args, options = { shell: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                return yield cpUtils_1.executeCommandWithProgress(message, "wsl", [command].concat(args), options);
            }
            return yield cpUtils_1.executeCommandWithProgress(message, command, args, options);
        });
    }
    removeOldCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const oldPath = path.join(os.homedir(), ".lc");
            if (yield fse.pathExists(oldPath)) {
                yield fse.remove(oldPath);
            }
        });
    }
}
exports.leetCodeExecutor = new LeetCodeExecutor();
//# sourceMappingURL=leetCodeExecutor.js.map