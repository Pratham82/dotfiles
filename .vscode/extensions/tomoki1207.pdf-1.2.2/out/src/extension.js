"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const pdfProvider_1 = require("./pdfProvider");
function activate(context) {
    const extensionRoot = vscode.Uri.file(context.extensionPath);
    // Register our custom editor provider
    const provider = new pdfProvider_1.PdfCustomProvider(extensionRoot);
    context.subscriptions.push(vscode.window.registerCustomEditorProvider(pdfProvider_1.PdfCustomProvider.viewType, provider, {
        webviewOptions: {
            enableFindWidget: false,
            retainContextWhenHidden: true,
        },
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map