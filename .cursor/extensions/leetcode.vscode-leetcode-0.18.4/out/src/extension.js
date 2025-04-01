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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const CodeLensController_1 = require("./codelens/CodeLensController");
const cache = require("./commands/cache");
const language_1 = require("./commands/language");
const plugin = require("./commands/plugin");
const session = require("./commands/session");
const show = require("./commands/show");
const star = require("./commands/star");
const submit = require("./commands/submit");
const test = require("./commands/test");
const explorerNodeManager_1 = require("./explorer/explorerNodeManager");
const LeetCodeTreeDataProvider_1 = require("./explorer/LeetCodeTreeDataProvider");
const LeetCodeTreeItemDecorationProvider_1 = require("./explorer/LeetCodeTreeItemDecorationProvider");
const leetCodeChannel_1 = require("./leetCodeChannel");
const leetCodeExecutor_1 = require("./leetCodeExecutor");
const leetCodeManager_1 = require("./leetCodeManager");
const leetCodeStatusBarController_1 = require("./statusbar/leetCodeStatusBarController");
const uiUtils_1 = require("./utils/uiUtils");
const leetCodePreviewProvider_1 = require("./webview/leetCodePreviewProvider");
const leetCodeSolutionProvider_1 = require("./webview/leetCodeSolutionProvider");
const leetCodeSubmissionProvider_1 = require("./webview/leetCodeSubmissionProvider");
const markdownEngine_1 = require("./webview/markdownEngine");
const trackingUtils_1 = require("./utils/trackingUtils");
const globalState_1 = require("./globalState");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield leetCodeExecutor_1.leetCodeExecutor.meetRequirements(context))) {
                throw new Error("The environment doesn't meet requirements.");
            }
            leetCodeManager_1.leetCodeManager.on("statusChanged", () => {
                leetCodeStatusBarController_1.leetCodeStatusBarController.updateStatusBar(leetCodeManager_1.leetCodeManager.getStatus(), leetCodeManager_1.leetCodeManager.getUser());
                LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.refresh();
            });
            LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.initialize(context);
            globalState_1.globalState.initialize(context);
            context.subscriptions.push(leetCodeStatusBarController_1.leetCodeStatusBarController, leetCodeChannel_1.leetCodeChannel, leetCodePreviewProvider_1.leetCodePreviewProvider, leetCodeSubmissionProvider_1.leetCodeSubmissionProvider, leetCodeSolutionProvider_1.leetCodeSolutionProvider, leetCodeExecutor_1.leetCodeExecutor, markdownEngine_1.markdownEngine, CodeLensController_1.codeLensController, explorerNodeManager_1.explorerNodeManager, vscode.window.registerFileDecorationProvider(LeetCodeTreeItemDecorationProvider_1.leetCodeTreeItemDecorationProvider), vscode.window.createTreeView("leetCodeExplorer", { treeDataProvider: LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider, showCollapseAll: true }), vscode.commands.registerCommand("leetcode.deleteCache", () => cache.deleteCache()), vscode.commands.registerCommand("leetcode.toggleLeetCodeCn", () => plugin.switchEndpoint()), vscode.commands.registerCommand("leetcode.signin", () => leetCodeManager_1.leetCodeManager.signIn()), vscode.commands.registerCommand("leetcode.signout", () => leetCodeManager_1.leetCodeManager.signOut()), vscode.commands.registerCommand("leetcode.manageSessions", () => session.manageSessions()), vscode.commands.registerCommand("leetcode.previewProblem", (node) => {
                trackingUtils_1.default.report({
                    event_key: `vscode_open_problem`,
                    type: "click",
                    extra: JSON.stringify({
                        problem_id: node.id,
                        problem_name: node.name,
                    }),
                });
                show.previewProblem(node);
            }), vscode.commands.registerCommand("leetcode.showProblem", (node) => show.showProblem(node)), vscode.commands.registerCommand("leetcode.pickOne", () => show.pickOne()), vscode.commands.registerCommand("leetcode.searchProblem", () => show.searchProblem()), vscode.commands.registerCommand("leetcode.showSolution", (input) => show.showSolution(input)), vscode.commands.registerCommand("leetcode.refreshExplorer", () => LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.refresh()), vscode.commands.registerCommand("leetcode.testSolution", (uri) => {
                trackingUtils_1.default.report({
                    event_key: `vscode_runCode`,
                    type: "click",
                    extra: JSON.stringify({
                        path: uri === null || uri === void 0 ? void 0 : uri.path,
                    }),
                });
                return test.testSolution(uri);
            }), vscode.commands.registerCommand("leetcode.submitSolution", (uri) => {
                trackingUtils_1.default.report({
                    event_key: `vscode_submit`,
                    type: "click",
                    extra: JSON.stringify({
                        path: uri === null || uri === void 0 ? void 0 : uri.path,
                    }),
                });
                return submit.submitSolution(uri);
            }), vscode.commands.registerCommand("leetcode.switchDefaultLanguage", () => language_1.switchDefaultLanguage()), vscode.commands.registerCommand("leetcode.addFavorite", (node) => star.addFavorite(node)), vscode.commands.registerCommand("leetcode.removeFavorite", (node) => star.removeFavorite(node)), vscode.commands.registerCommand("leetcode.problems.sort", () => plugin.switchSortingStrategy()));
            yield leetCodeExecutor_1.leetCodeExecutor.switchEndpoint(plugin.getLeetCodeEndpoint());
            yield leetCodeManager_1.leetCodeManager.getLoginStatus();
            vscode.window.registerUriHandler({ handleUri: leetCodeManager_1.leetCodeManager.handleUriSignIn });
        }
        catch (error) {
            leetCodeChannel_1.leetCodeChannel.appendLine(error.toString());
            uiUtils_1.promptForOpenOutputChannel("Extension initialization failed. Please open output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.activate = activate;
function deactivate() {
    // Do nothing.
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map