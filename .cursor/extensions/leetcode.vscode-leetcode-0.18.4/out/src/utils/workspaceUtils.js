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
exports.getActiveFilePath = exports.selectWorkspaceFolder = void 0;
const fse = require("fs-extra");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const settingUtils_1 = require("./settingUtils");
const uiUtils_1 = require("./uiUtils");
const wsl = require("./wslUtils");
function selectWorkspaceFolder() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let workspaceFolderSetting = settingUtils_1.getWorkspaceFolder();
        if (workspaceFolderSetting.trim() === "") {
            workspaceFolderSetting = yield determineLeetCodeFolder();
            if (workspaceFolderSetting === "") {
                // User cancelled
                return workspaceFolderSetting;
            }
        }
        let needAsk = true;
        yield fse.ensureDir(workspaceFolderSetting);
        for (const folder of vscode.workspace.workspaceFolders || []) {
            if (isSubFolder(folder.uri.fsPath, workspaceFolderSetting)) {
                needAsk = false;
            }
        }
        if (needAsk) {
            const choice = yield vscode.window.showQuickPick([
                OpenOption.justOpenFile,
                OpenOption.openInCurrentWindow,
                OpenOption.openInNewWindow,
                OpenOption.addToWorkspace,
            ], { placeHolder: "The LeetCode workspace folder is not opened in VS Code, would you like to open it?" });
            // Todo: generate file first
            switch (choice) {
                case OpenOption.justOpenFile:
                    return workspaceFolderSetting;
                case OpenOption.openInCurrentWindow:
                    yield vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(workspaceFolderSetting), false);
                    return "";
                case OpenOption.openInNewWindow:
                    yield vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(workspaceFolderSetting), true);
                    return "";
                case OpenOption.addToWorkspace:
                    vscode.workspace.updateWorkspaceFolders((_b = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, 0, { uri: vscode.Uri.file(workspaceFolderSetting) });
                    break;
                default:
                    return "";
            }
        }
        return wsl.useWsl() ? wsl.toWslPath(workspaceFolderSetting) : workspaceFolderSetting;
    });
}
exports.selectWorkspaceFolder = selectWorkspaceFolder;
function getActiveFilePath(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let textEditor;
        if (uri) {
            textEditor = yield vscode.window.showTextDocument(uri, { preview: false });
        }
        else {
            textEditor = vscode.window.activeTextEditor;
        }
        if (!textEditor) {
            return undefined;
        }
        if (textEditor.document.isDirty && !(yield textEditor.document.save())) {
            vscode.window.showWarningMessage("Please save the solution file first.");
            return undefined;
        }
        return wsl.useWsl() ? wsl.toWslPath(textEditor.document.uri.fsPath) : textEditor.document.uri.fsPath;
    });
}
exports.getActiveFilePath = getActiveFilePath;
function isSubFolder(from, to) {
    const relative = path.relative(from, to);
    if (relative === "") {
        return true;
    }
    return !relative.startsWith("..") && !path.isAbsolute(relative);
}
function determineLeetCodeFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        const picks = [];
        picks.push({
            label: `Default location`,
            detail: `${path.join(os.homedir(), ".leetcode")}`,
            value: `${path.join(os.homedir(), ".leetcode")}`,
        }, {
            label: "$(file-directory) Browse...",
            value: ":browse",
        });
        const choice = yield vscode.window.showQuickPick(picks, { placeHolder: "Select where you would like to save your LeetCode files" });
        if (!choice) {
            result = "";
        }
        else if (choice.value === ":browse") {
            const directory = yield uiUtils_1.showDirectorySelectDialog();
            if (!directory || directory.length < 1) {
                result = "";
            }
            else {
                result = directory[0].fsPath;
            }
        }
        else {
            result = choice.value;
        }
        settingUtils_1.getWorkspaceConfiguration().update("workspaceFolder", result, vscode.ConfigurationTarget.Global);
        return result;
    });
}
var OpenOption;
(function (OpenOption) {
    OpenOption["justOpenFile"] = "Just open the problem file";
    OpenOption["openInCurrentWindow"] = "Open in current window";
    OpenOption["openInNewWindow"] = "Open in new window";
    OpenOption["addToWorkspace"] = "Add to workspace";
})(OpenOption || (OpenOption = {}));
//# sourceMappingURL=workspaceUtils.js.map