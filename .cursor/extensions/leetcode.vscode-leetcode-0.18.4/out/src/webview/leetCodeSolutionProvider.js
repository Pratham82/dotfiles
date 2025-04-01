"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeSolutionProvider = void 0;
const vscode_1 = require("vscode");
const leetCodePreviewProvider_1 = require("./leetCodePreviewProvider");
const LeetCodeWebview_1 = require("./LeetCodeWebview");
const markdownEngine_1 = require("./markdownEngine");
class LeetCodeSolutionProvider extends LeetCodeWebview_1.LeetCodeWebview {
    constructor() {
        super(...arguments);
        this.viewType = "leetcode.solution";
    }
    show(solutionString) {
        this.solution = this.parseSolution(solutionString);
        this.showWebviewInternal();
    }
    getWebviewOption() {
        if (leetCodePreviewProvider_1.leetCodePreviewProvider.isSideMode()) {
            return {
                title: "Solution",
                viewColumn: vscode_1.ViewColumn.Two,
                preserveFocus: true,
            };
        }
        else {
            return {
                title: `Solution: ${this.problemName}`,
                viewColumn: vscode_1.ViewColumn.One,
            };
        }
    }
    getWebviewContent() {
        const styles = markdownEngine_1.markdownEngine.getStyles();
        const { title, url, lang, author, votes } = this.solution;
        const head = markdownEngine_1.markdownEngine.render(`# [${title}](${url})`);
        const auth = `[${author}](https://leetcode.com/${author}/)`;
        const info = markdownEngine_1.markdownEngine.render([
            `| Language |  Author  |  Votes   |`,
            `| :------: | :------: | :------: |`,
            `| ${lang}  | ${auth}  | ${votes} |`,
        ].join("\n"));
        const body = markdownEngine_1.markdownEngine.render(this.solution.body, {
            lang: this.solution.lang,
            host: "https://discuss.leetcode.com/",
        });
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src vscode-resource:; style-src vscode-resource:;"/>
                ${styles}
            </head>
            <body class="vscode-body 'scrollBeyondLastLine' 'wordWrap' 'showEditorSelection'" style="tab-size:4">
                ${head}
                ${info}
                ${body}
            </body>
            </html>
        `;
    }
    onDidDisposeWebview() {
        super.onDidDisposeWebview();
    }
    parseSolution(raw) {
        raw = raw.slice(1); // skip first empty line
        [this.problemName, raw] = raw.split(/\n\n([^]+)/); // parse problem name and skip one line
        const solution = new Solution();
        // [^] matches everything including \n, yet can be replaced by . in ES2018's `m` flag
        [solution.title, raw] = raw.split(/\n\n([^]+)/);
        [solution.url, raw] = raw.split(/\n\n([^]+)/);
        [solution.lang, raw] = raw.match(/\* Lang:\s+(.+)\n([^]+)/).slice(1);
        [solution.author, raw] = raw.match(/\* Author:\s+(.+)\n([^]+)/).slice(1);
        [solution.votes, raw] = raw.match(/\* Votes:\s+(\d+)\n\n([^]+)/).slice(1);
        solution.body = raw;
        return solution;
    }
}
// tslint:disable-next-line:max-classes-per-file
class Solution {
    constructor() {
        this.title = "";
        this.url = "";
        this.lang = "";
        this.author = "";
        this.votes = "";
        this.body = ""; // Markdown supported
    }
}
exports.leetCodeSolutionProvider = new LeetCodeSolutionProvider();
//# sourceMappingURL=leetCodeSolutionProvider.js.map