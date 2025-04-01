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
exports.leetCodePreviewProvider = void 0;
const vscode_1 = require("vscode");
const plugin_1 = require("../commands/plugin");
const shared_1 = require("../shared");
const LeetCodeWebview_1 = require("./LeetCodeWebview");
const markdownEngine_1 = require("./markdownEngine");
class LeetCodePreviewProvider extends LeetCodeWebview_1.LeetCodeWebview {
    constructor() {
        super(...arguments);
        this.viewType = "leetcode.preview";
        this.sideMode = false;
    }
    isSideMode() {
        return this.sideMode;
    }
    show(descString, node, isSideMode = false) {
        this.description = this.parseDescription(descString, node);
        this.node = node;
        this.sideMode = isSideMode;
        this.showWebviewInternal();
    }
    getWebviewOption() {
        if (!this.sideMode) {
            return {
                title: `${this.node.name}: Preview`,
                viewColumn: vscode_1.ViewColumn.One,
            };
        }
        else {
            return {
                title: "Description",
                viewColumn: vscode_1.ViewColumn.Two,
                preserveFocus: true,
            };
        }
    }
    getWebviewContent() {
        const button = {
            element: `<button id="solve">Code Now</button>`,
            script: `const button = document.getElementById('solve');
                    button.onclick = () => vscode.postMessage({
                        command: 'ShowProblem',
                    });`,
            style: `<style>
                #solve {
                    position: fixed;
                    bottom: 1rem;
                    right: 1rem;
                    border: 0;
                    margin: 1rem 0;
                    padding: 0.2rem 1rem;
                    color: white;
                    background-color: var(--vscode-button-background);
                }
                #solve:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                #solve:active {
                    border: 0;
                }
                </style>`,
        };
        const { title, url, category, difficulty, likes, dislikes, body } = this.description;
        const head = markdownEngine_1.markdownEngine.render(`# [${title}](${url})`);
        const info = markdownEngine_1.markdownEngine.render([
            `| Category | Difficulty | Likes | Dislikes |`,
            `| :------: | :--------: | :---: | :------: |`,
            `| ${category} | ${difficulty} | ${likes} | ${dislikes} |`,
        ].join("\n"));
        const tags = [
            `<details>`,
            `<summary><strong>Tags</strong></summary>`,
            markdownEngine_1.markdownEngine.render(this.description.tags.map((t) => `[\`${t}\`](${this.getTagLink(t)})`).join(" | ")),
            `</details>`,
        ].join("\n");
        const companies = [
            `<details>`,
            `<summary><strong>Companies</strong></summary>`,
            markdownEngine_1.markdownEngine.render(this.description.companies.map((c) => `\`${c}\``).join(" | ")),
            `</details>`,
        ].join("\n");
        const links = markdownEngine_1.markdownEngine.render(`[Submissions](${this.getSubmissionsLink(url)}) | [Solution](${this.getSolutionsLink(url)})`);
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src vscode-resource: 'unsafe-inline'; style-src vscode-resource: 'unsafe-inline';"/>
                ${markdownEngine_1.markdownEngine.getStyles()}
                ${!this.sideMode ? button.style : ""}
                <style>
                    code { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                ${head}
                ${info}
                ${tags}
                ${companies}
                ${body}
                <hr />
                ${links}
                ${!this.sideMode ? button.element : ""}
                <script>
                    const vscode = acquireVsCodeApi();
                    ${!this.sideMode ? button.script : ""}
                </script>
            </body>
            </html>
        `;
    }
    onDidDisposeWebview() {
        super.onDidDisposeWebview();
        this.sideMode = false;
    }
    onDidReceiveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message.command) {
                case "ShowProblem": {
                    yield vscode_1.commands.executeCommand("leetcode.showProblem", this.node);
                    break;
                }
            }
        });
    }
    // private async hideSideBar(): Promise<void> {
    //     await commands.executeCommand("workbench.action.focusSideBar");
    //     await commands.executeCommand("workbench.action.toggleSidebarVisibility");
    // }
    parseDescription(descString, problem) {
        const [, , 
        /* title */ url, , , , , , 
        /* tags */ /* langs */ category, difficulty, likes, dislikes, , , , , 
        /* accepted */ /* submissions */ /* testcase */ ...body] = descString.split("\n");
        return {
            title: problem.name,
            url,
            tags: problem.tags,
            companies: problem.companies,
            category: category.slice(2),
            difficulty: difficulty.slice(2),
            likes: likes.split(": ")[1].trim(),
            dislikes: dislikes.split(": ")[1].trim(),
            body: body.join("\n").replace(/<pre>[\r\n]*([^]+?)[\r\n]*<\/pre>/g, "<pre><code>$1</code></pre>"),
        };
    }
    getTagLink(tag) {
        const endPoint = plugin_1.getLeetCodeEndpoint();
        if (endPoint === shared_1.Endpoint.LeetCodeCN) {
            return `https://leetcode.cn/tag/${tag}?source=vscode`;
        }
        else if (endPoint === shared_1.Endpoint.LeetCode) {
            return `https://leetcode.com/tag/${tag}?source=vscode`;
        }
        return "https://leetcode.com?source=vscode";
    }
    getSolutionsLink(url) {
        return url.replace("/description/", "/solutions/") + "?source=vscode";
    }
    getSubmissionsLink(url) {
        return url.replace("/description/", "/submissions/") + "?source=vscode";
    }
}
exports.leetCodePreviewProvider = new LeetCodePreviewProvider();
//# sourceMappingURL=leetCodePreviewProvider.js.map