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
exports.leetCodeSubmissionProvider = void 0;
const vscode_1 = require("vscode");
const uiUtils_1 = require("../utils/uiUtils");
const LeetCodeWebview_1 = require("./LeetCodeWebview");
const markdownEngine_1 = require("./markdownEngine");
class LeetCodeSubmissionProvider extends LeetCodeWebview_1.LeetCodeWebview {
    constructor() {
        super(...arguments);
        this.viewType = "leetcode.submission";
    }
    show(resultString) {
        this.result = this.parseResult(resultString);
        this.showWebviewInternal();
        this.showKeybindingsHint();
    }
    getWebviewOption() {
        return {
            title: "Submission",
            viewColumn: vscode_1.ViewColumn.Two,
        };
    }
    getWebviewContent() {
        const styles = markdownEngine_1.markdownEngine.getStyles();
        const title = `## ${this.result.messages[0]}`;
        const messages = this.result.messages.slice(1).map((m) => `* ${m}`);
        const sections = Object.keys(this.result)
            .filter((key) => key !== "messages")
            .map((key) => [
            `### ${key}`,
            "```",
            this.result[key].join("\n"),
            "```",
        ].join("\n"));
        const body = markdownEngine_1.markdownEngine.render([
            title,
            ...messages,
            ...sections,
        ].join("\n"));
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src vscode-resource:; style-src vscode-resource:;"/>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${styles}
            </head>
            <body class="vscode-body 'scrollBeyondLastLine' 'wordWrap' 'showEditorSelection'" style="tab-size:4">
                ${body}
            </body>
            </html>
        `;
    }
    onDidDisposeWebview() {
        super.onDidDisposeWebview();
    }
    showKeybindingsHint() {
        return __awaiter(this, void 0, void 0, function* () {
            yield uiUtils_1.promptHintMessage("hint.commandShortcut", 'You can customize shortcut key bindings in File > Preferences > Keyboard Shortcuts with query "leetcode".', "Open Keybindings", () => uiUtils_1.openKeybindingsEditor("leetcode solution"));
        });
    }
    parseResult(raw) {
        raw = raw.concat("  √ "); // Append a dummy sentinel to the end of raw string
        const regSplit = /  [√×✔✘vx] ([^]+?)\n(?=  [√×✔✘vx] )/g;
        const regKeyVal = /(.+?): ([^]*)/;
        const result = { messages: [] };
        let entry;
        do {
            entry = regSplit.exec(raw);
            if (!entry) {
                continue;
            }
            const kvMatch = regKeyVal.exec(entry[1]);
            if (kvMatch) {
                const [key, value] = kvMatch.slice(1);
                if (value) { // Do not show empty string
                    if (!result[key]) {
                        result[key] = [];
                    }
                    result[key].push(value);
                }
            }
            else {
                result.messages.push(entry[1]);
            }
        } while (entry);
        return result;
    }
}
exports.leetCodeSubmissionProvider = new LeetCodeSubmissionProvider();
//# sourceMappingURL=leetCodeSubmissionProvider.js.map