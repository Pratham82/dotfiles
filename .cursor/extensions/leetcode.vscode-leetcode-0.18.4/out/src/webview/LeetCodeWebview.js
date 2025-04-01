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
exports.LeetCodeWebview = void 0;
const vscode_1 = require("vscode");
const uiUtils_1 = require("../utils/uiUtils");
const markdownEngine_1 = require("./markdownEngine");
class LeetCodeWebview {
    constructor() {
        this.viewType = "leetcode.webview";
        this.listeners = [];
    }
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    showWebviewInternal() {
        const { title, viewColumn, preserveFocus } = this.getWebviewOption();
        if (!this.panel) {
            this.panel = vscode_1.window.createWebviewPanel(this.viewType, title, { viewColumn, preserveFocus }, {
                enableScripts: true,
                enableCommandUris: true,
                enableFindWidget: true,
                retainContextWhenHidden: true,
                localResourceRoots: markdownEngine_1.markdownEngine.localResourceRoots,
            });
            this.panel.onDidDispose(this.onDidDisposeWebview, this, this.listeners);
            this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, this, this.listeners);
            vscode_1.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.listeners);
        }
        else {
            this.panel.title = title;
            if (viewColumn === vscode_1.ViewColumn.Two) {
                // Make sure second group exists. See vscode#71608 issue
                vscode_1.commands.executeCommand("workbench.action.focusSecondEditorGroup").then(() => {
                    this.panel.reveal(viewColumn, preserveFocus);
                });
            }
            else {
                this.panel.reveal(viewColumn, preserveFocus);
            }
        }
        this.panel.webview.html = this.getWebviewContent();
        this.showMarkdownConfigHint();
    }
    onDidDisposeWebview() {
        this.panel = undefined;
        for (const listener of this.listeners) {
            listener.dispose();
        }
        this.listeners = [];
    }
    onDidChangeConfiguration(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.panel && event.affectsConfiguration("markdown")) {
                this.panel.webview.html = this.getWebviewContent();
            }
        });
    }
    onDidReceiveMessage(_message) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    showMarkdownConfigHint() {
        return __awaiter(this, void 0, void 0, function* () {
            yield uiUtils_1.promptHintMessage("hint.configWebviewMarkdown", 'You can change the webview appearance ("fontSize", "lineWidth" & "fontFamily") in "markdown.preview" configuration.', "Open settings", () => uiUtils_1.openSettingsEditor("markdown.preview"));
        });
    }
}
exports.LeetCodeWebview = LeetCodeWebview;
//# sourceMappingURL=LeetCodeWebview.js.map