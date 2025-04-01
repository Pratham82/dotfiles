"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const tslib_1 = require("tslib");
const message_handler_1 = require("./message-handler");
const webview_content_1 = require("./webview-content");
const vscode = tslib_1.__importStar(require("vscode"));
const fileCache = {};
/** @see https://code.visualstudio.com/api/extension-guides/webview */
function activate(context) {
    let currentPanel = undefined;
    context.subscriptions.push(vscode.commands.registerCommand('lintel.start', () => {
        // what column to use?
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // only show one instance at a time
        if (currentPanel)
            currentPanel.reveal(columnToShowIn);
        else
            currentPanel = vscode.window.createWebviewPanel('lintel', 'Lintel', columnToShowIn, { enableScripts: true });
        // eslint files to process
        const filePattern = '**/{package.json,.eslintrc,.eslintrc.cjs,.eslintrc.js,.eslintrc.json,.eslintrc.yml,.eslintrc.yaml}';
        // handlers
        const messageHandler = message_handler_1.messageHandlerFactory(currentPanel, fileCache);
        const webviewContent = webview_content_1.webviewContentFactory(context, currentPanel, fileCache, filePattern);
        // watch for changes on ESLint files
        const watcher = vscode.workspace.createFileSystemWatcher(filePattern);
        watcher.onDidChange(() => webviewContent());
        watcher.onDidCreate(() => webviewContent());
        watcher.onDidDelete(() => webviewContent());
        // clean up when we're done
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
            Object.keys(fileCache).forEach((key) => delete fileCache[key]);
            watcher.dispose();
        }, null, context.subscriptions);
        // listen for messages from webview
        currentPanel.webview.onDidReceiveMessage(messageHandler);
        // fire 'em up!
        webviewContent();
    }));
}
exports.activate = activate;
//# sourceMappingURL=lintel.js.map