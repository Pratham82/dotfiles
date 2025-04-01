"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownEngine = void 0;
const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const leetCodeChannel_1 = require("../leetCodeChannel");
const osUtils_1 = require("../utils/osUtils");
class MarkdownEngine {
    constructor() {
        this.reload();
        this.listener = vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("markdown")) {
                this.reload();
            }
        }, this);
    }
    get localResourceRoots() {
        return [vscode.Uri.file(path.join(this.config.extRoot, "media"))];
    }
    dispose() {
        this.listener.dispose();
    }
    reload() {
        this.engine = this.initEngine();
        this.config = new MarkdownConfiguration();
    }
    render(md, env) {
        return this.engine.render(md, env);
    }
    getStyles() {
        return [
            this.getBuiltinStyles(),
            this.getSettingsStyles(),
        ].join(os.EOL);
    }
    getBuiltinStyles() {
        let styles = [];
        try {
            const stylePaths = require(path.join(this.config.extRoot, "package.json"))["contributes"]["markdown.previewStyles"];
            styles = stylePaths.map((p) => vscode.Uri.file(path.join(this.config.extRoot, p)).with({ scheme: "vscode-resource" }));
        }
        catch (error) {
            leetCodeChannel_1.leetCodeChannel.appendLine("[Error] Fail to load built-in markdown style file.");
        }
        return styles.map((style) => `<link rel="stylesheet" type="text/css" href="${style.toString()}">`).join(os.EOL);
    }
    getSettingsStyles() {
        return [
            `<style>`,
            `body {`,
            `    ${this.config.fontFamily ? `font-family: ${this.config.fontFamily};` : ``}`,
            `    ${isNaN(this.config.fontSize) ? `` : `font-size: ${this.config.fontSize}px;`}`,
            `    ${isNaN(this.config.lineHeight) ? `` : `line-height: ${this.config.lineHeight};`}`,
            `}`,
            `</style>`,
        ].join(os.EOL);
    }
    initEngine() {
        const md = new MarkdownIt({
            linkify: true,
            typographer: true,
            highlight: (code, lang) => {
                switch (lang && lang.toLowerCase()) {
                    case "mysql":
                        lang = "sql";
                        break;
                    case "json5":
                        lang = "json";
                        break;
                    case "python3":
                        lang = "python";
                        break;
                }
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, code, true).value;
                    }
                    catch (error) { /* do not highlight */ }
                }
                return ""; // use external default escaping
            },
        });
        this.addCodeBlockHighlight(md);
        this.addImageUrlCompletion(md);
        this.addLinkValidator(md);
        return md;
    }
    addCodeBlockHighlight(md) {
        const codeBlock = md.renderer.rules["code_block"];
        // tslint:disable-next-line:typedef
        md.renderer.rules["code_block"] = (tokens, idx, options, env, self) => {
            // if any token uses lang-specified code fence, then do not highlight code block
            if (tokens.some((token) => token.type === "fence")) {
                return codeBlock(tokens, idx, options, env, self);
            }
            // otherwise, highlight with default lang in env object.
            const highlighted = options.highlight(tokens[idx].content, env.lang);
            return [
                `<pre><code ${self.renderAttrs(tokens[idx])} >`,
                highlighted || md.utils.escapeHtml(tokens[idx].content),
                "</code></pre>",
            ].join(os.EOL);
        };
    }
    addImageUrlCompletion(md) {
        const image = md.renderer.rules["image"];
        // tslint:disable-next-line:typedef
        md.renderer.rules["image"] = (tokens, idx, options, env, self) => {
            const imageSrc = tokens[idx].attrs.find((value) => value[0] === "src");
            if (env.host && imageSrc && imageSrc[1].startsWith("/")) {
                imageSrc[1] = `${env.host}${imageSrc[1]}`;
            }
            return image(tokens, idx, options, env, self);
        };
    }
    addLinkValidator(md) {
        const validateLink = md.validateLink;
        md.validateLink = (link) => {
            // support file:// protocal link
            return validateLink(link) || link.startsWith("file:");
        };
    }
}
// tslint:disable-next-line: max-classes-per-file
class MarkdownConfiguration {
    constructor() {
        const markdownConfig = vscode.workspace.getConfiguration("markdown", null);
        this.extRoot = path.join(vscode.env.appRoot, "extensions", "markdown-language-features");
        this.lineHeight = Math.max(0.6, +markdownConfig.get("preview.lineHeight", NaN));
        this.fontSize = Math.max(8, +markdownConfig.get("preview.fontSize", NaN));
        this.fontFamily = this.resolveFontFamily(markdownConfig);
    }
    resolveFontFamily(config) {
        let fontFamily = config.get("preview.fontFamily", "");
        if (osUtils_1.isWindows() && fontFamily === config.inspect("preview.fontFamily").defaultValue) {
            fontFamily = `${fontFamily}, 'Microsoft Yahei UI'`;
        }
        return fontFamily;
    }
}
exports.markdownEngine = new MarkdownEngine();
//# sourceMappingURL=markdownEngine.js.map