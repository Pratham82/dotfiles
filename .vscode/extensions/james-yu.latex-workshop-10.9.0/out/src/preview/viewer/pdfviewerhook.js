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
exports.hook = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const pdfviewermanager_1 = require("./pdfviewermanager");
const pdfviewerpanel_1 = require("./pdfviewerpanel");
class PdfViewerHookProvider {
    openCustomDocument(uri) {
        return {
            uri,
            dispose: () => { }
        };
    }
    async resolveCustomEditor(document, webviewPanel) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const viewerLocation = configuration.get('view.pdf.viewer', 'tab');
        if (viewerLocation === 'tab') {
            webviewPanel.webview.options = {
                ...webviewPanel.webview.options,
                enableScripts: true
            };
            const pdfPanel = await (0, pdfviewerpanel_1.populate)(document.uri, webviewPanel);
            void (0, pdfviewermanager_1.insert)(pdfPanel);
        }
        else {
            webviewPanel.onDidChangeViewState(e => { e.webviewPanel.dispose(); });
            if (document.uri === undefined || !document.uri.fsPath.toLocaleLowerCase().endsWith('.pdf')) {
                return;
            }
            void lw_1.lw.viewer.viewInWebviewPanel(document.uri, 'current', false);
        }
    }
}
const hook = new PdfViewerHookProvider();
exports.hook = hook;
//# sourceMappingURL=pdfviewerhook.js.map