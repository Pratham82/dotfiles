"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = exports.state = void 0;
exports.render = render;
const vscode = __importStar(require("vscode"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const lw_1 = require("../lw");
async function render(pdfFileUri, opts) {
    if (!state.view?.webview) {
        return;
    }
    const uri = state.view.webview.asWebviewUri(pdfFileUri).toString();
    const promise = new Promise((resolve) => {
        const rendered = (e) => {
            if (e.type !== 'png') {
                return;
            }
            if (e.uri === uri) {
                resolve(e);
            }
        };
        state.callbacks.add(rendered);
        setTimeout(() => {
            state.callbacks.delete(rendered);
            resolve(undefined);
        }, 3000);
        void state.view?.webview.postMessage({
            type: 'pdf',
            uri,
            opts
        });
    });
    try {
        const renderResult = await promise;
        return renderResult?.data;
    }
    catch (_) { }
    return;
}
function receive(message) {
    if (message.type === 'insertSnippet') {
        vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(message.snippet.replace(/\\\n/g, '\\n')))
            .then(() => { }, err => {
            void vscode.window.showWarningMessage(`Unable to insert symbol, ${err}`);
        });
    }
}
class SnippetViewProvider {
    constructor() {
        this.serverHandlerInserted = false;
    }
    async resolveWebviewView(webviewView) {
        if (this.serverHandlerInserted === false) {
            lw_1.lw.server.setHandler((url) => {
                if (url.startsWith('/snippetview/')) {
                    return path.resolve(lw_1.lw.extensionRoot, 'resources');
                }
                return undefined;
            });
            this.serverHandlerInserted = true;
        }
        state.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.onDidDispose(() => {
            state.view = undefined;
        });
        const webviewSourcePath = path.join(lw_1.lw.extensionRoot, 'resources', 'snippetview', 'snippetview.html');
        const htmlContent = (0, fs_1.readFileSync)(webviewSourcePath, { encoding: 'utf8' })
            .replaceAll('%SRC%', (await lw_1.lw.server.getUrl()).url)
            .replaceAll('%CSP%', webviewView.webview.cspSource + ' http://127.0.0.1:*');
        const replacements = await Promise.all(Array.from(htmlContent.matchAll(/\{%(.*?)%\}/g), match => lw_1.lw.language.getLocaleString(match[1])));
        let index = 0;
        webviewView.webview.html = htmlContent.replace(/\{%(.*?)%\}/g, () => replacements[index++]);
        webviewView.webview.onDidReceiveMessage((e) => {
            state.callbacks.forEach((cb) => void cb(e));
            receive(e);
        });
    }
}
const provider = new SnippetViewProvider();
exports.provider = provider;
const state = {
    view: undefined,
    callbacks: new Set()
};
exports.state = state;
//# sourceMappingURL=snippet-view.js.map