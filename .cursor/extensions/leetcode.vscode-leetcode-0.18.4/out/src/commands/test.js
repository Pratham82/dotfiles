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
exports.testSolution = void 0;
const fse = require("fs-extra");
const vscode = require("vscode");
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const leetCodeManager_1 = require("../leetCodeManager");
const shared_1 = require("../shared");
const osUtils_1 = require("../utils/osUtils");
const uiUtils_1 = require("../utils/uiUtils");
const workspaceUtils_1 = require("../utils/workspaceUtils");
const wsl = require("../utils/wslUtils");
const leetCodeSubmissionProvider_1 = require("../webview/leetCodeSubmissionProvider");
function testSolution(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (leetCodeManager_1.leetCodeManager.getStatus() === shared_1.UserStatus.SignedOut) {
                return;
            }
            const filePath = yield workspaceUtils_1.getActiveFilePath(uri);
            if (!filePath) {
                return;
            }
            const picks = [];
            picks.push({
                label: "$(three-bars) Default test cases",
                description: "",
                detail: "Test with the default cases",
                value: ":default",
            }, {
                label: "$(pencil) Write directly...",
                description: "",
                detail: "Write test cases in input box",
                value: ":direct",
            }, {
                label: "$(file-text) Browse...",
                description: "",
                detail: "Test with the written cases in file",
                value: ":file",
            });
            const choice = yield vscode.window.showQuickPick(picks);
            if (!choice) {
                return;
            }
            let result;
            switch (choice.value) {
                case ":default":
                    result = yield leetCodeExecutor_1.leetCodeExecutor.testSolution(filePath);
                    break;
                case ":direct":
                    const testString = yield vscode.window.showInputBox({
                        prompt: "Enter the test cases.",
                        validateInput: (s) => s && s.trim() ? undefined : "Test case must not be empty.",
                        placeHolder: "Example: [1,2,3]\\n4",
                        ignoreFocusOut: true,
                    });
                    if (testString) {
                        result = yield leetCodeExecutor_1.leetCodeExecutor.testSolution(filePath, parseTestString(testString));
                    }
                    break;
                case ":file":
                    const testFile = yield uiUtils_1.showFileSelectDialog(filePath);
                    if (testFile && testFile.length) {
                        const input = (yield fse.readFile(testFile[0].fsPath, "utf-8")).trim();
                        if (input) {
                            result = yield leetCodeExecutor_1.leetCodeExecutor.testSolution(filePath, parseTestString(input.replace(/\r?\n/g, "\\n")));
                        }
                        else {
                            vscode.window.showErrorMessage("The selected test file must not be empty.");
                        }
                    }
                    break;
                default:
                    break;
            }
            if (!result) {
                return;
            }
            leetCodeSubmissionProvider_1.leetCodeSubmissionProvider.show(result);
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to test the solution. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.testSolution = testSolution;
function parseTestString(test) {
    if (wsl.useWsl() || !osUtils_1.isWindows()) {
        return `'${test}'`;
    }
    // In windows and not using WSL
    if (osUtils_1.usingCmd()) {
        return `"${test.replace(/"/g, '\\"')}"`;
    }
    else {
        // Assume using PowerShell
        return `'${test.replace(/"/g, '\\"')}'`;
    }
}
//# sourceMappingURL=test.js.map