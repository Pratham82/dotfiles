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
exports.serializer = void 0;
exports.toggle = toggle;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const webview_1 = require("../utils/webview");
const lw_1 = require("../lw");
const utils_1 = require("./hover/utils");
const hover_1 = require("./hover");
const cursor_1 = require("./hover/cursor");
const logger = lw_1.lw.log('Preview', 'Math');
function resourcesFolder(extensionRoot) {
    const folder = path.join(extensionRoot, 'resources', 'mathpreviewpanel');
    return lw_1.lw.file.toUri(folder);
}
class MathPreviewPanelSerializer {
    deserializeWebviewPanel(panel) {
        initializePanel(panel);
        panel.webview.options = {
            enableScripts: true,
            localResourceRoots: [resourcesFolder(lw_1.lw.extensionRoot)]
        };
        panel.webview.html = getHtml();
        logger.log('Math preview panel: restored');
        return Promise.resolve();
    }
}
const serializer = new MathPreviewPanelSerializer();
exports.serializer = serializer;
const state = {
    panel: undefined,
    prevEditTime: 0,
    prevDocumentUri: undefined,
    prevCursorPosition: undefined,
    prevMacros: undefined,
};
function open() {
    const activeDocument = vscode.window.activeTextEditor?.document;
    if (state.panel) {
        if (!state.panel.visible) {
            state.panel.reveal(undefined, true);
        }
        return;
    }
    const panel = vscode.window.createWebviewPanel('latex-workshop-mathpreview', 'Math Preview', { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, {
        enableScripts: true,
        localResourceRoots: [resourcesFolder(lw_1.lw.extensionRoot)],
        retainContextWhenHidden: true
    });
    initializePanel(panel);
    panel.webview.html = getHtml();
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const editorGroup = configuration.get('mathpreviewpanel.editorGroup');
    if (activeDocument) {
        void (0, webview_1.moveWebviewPanel)(panel, editorGroup);
    }
    logger.log('Math preview panel: opened');
}
function initializePanel(panel) {
    const disposable = vscode.Disposable.from(vscode.workspace.onDidChangeTextDocument((event) => {
        void update({ type: 'edit', event });
    }), vscode.window.onDidChangeTextEditorSelection((event) => {
        void update({ type: 'selection', event });
    }));
    state.panel = panel;
    panel.onDidDispose(() => {
        disposable.dispose();
        clearCache();
        state.panel = undefined;
        logger.log('Math preview panel: disposed');
    });
    panel.onDidChangeViewState((ev) => {
        if (ev.webviewPanel.visible) {
            void update();
        }
    });
    panel.webview.onDidReceiveMessage(() => {
        logger.log('Math preview panel: initialized');
        void update();
    });
}
function close() {
    state.panel?.dispose();
    state.panel = undefined;
    clearCache();
    logger.log('Math preview panel: closed');
}
function toggle(action) {
    if (action) {
        if (action === 'open') {
            open();
        }
        else {
            close();
        }
    }
    else if (state.panel) {
        close();
    }
    else {
        open();
    }
}
function clearCache() {
    state.prevEditTime = 0;
    state.prevDocumentUri = undefined;
    state.prevCursorPosition = undefined;
    state.prevMacros = undefined;
}
let serverHandlerInserted = false;
function getHtml() {
    if (serverHandlerInserted === false) {
        lw_1.lw.server.setHandler((url) => {
            if (url.startsWith('/mathpreviewpanel/')) {
                return path.resolve(lw_1.lw.extensionRoot, 'resources');
            }
            return undefined;
        });
        serverHandlerInserted = true;
    }
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; script-src 'self' http://127.0.0.1:*; img-src data:; style-src 'unsafe-inline';">
        <meta charset="UTF-8">
        <style>
            body {
                padding: 0;
                margin: 0;
            }
            #math {
                padding-top: 35px;
                padding-left: 50px;
            }
        </style>
        <script src='http://127.0.0.1:${lw_1.lw.server.getPort().toString()}/mathpreviewpanel/mathpreview.js' defer></script>
    </head>
    <body>
        <div id="mathBlock"><img src="" id="math" /></div>
    </body>
    </html>`;
}
async function update(ev) {
    if (!state.panel || !state.panel.visible) {
        return;
    }
    if (!vscode.workspace.getConfiguration('latex-workshop').get('mathpreviewpanel.cursor.enabled', false)) {
        if (ev?.type === 'edit') {
            state.prevEditTime = Date.now();
        }
        else if (ev?.type === 'selection') {
            if (Date.now() - state.prevEditTime < 100) {
                return;
            }
        }
    }
    const editor = vscode.window.activeTextEditor;
    const document = editor?.document;
    if (!editor || !document?.languageId || !lw_1.lw.file.hasTeXLangId(document.languageId)) {
        clearCache();
        return;
    }
    const documentUri = document.uri.toString();
    if (ev?.type === 'edit' && documentUri !== ev.event.document.uri.toString()) {
        return;
    }
    const position = editor.selection.active;
    const texMath = getTexMath(document, position);
    if (!texMath) {
        clearCache();
        return state.panel.webview.postMessage({ type: 'mathImage', src: '' });
    }
    let cachedMacros;
    if (position.line === state.prevCursorPosition?.line && documentUri === state.prevDocumentUri) {
        cachedMacros = state.prevMacros;
    }
    if (vscode.workspace.getConfiguration('latex-workshop').get('mathpreviewpanel.cursor.enabled', false)) {
        texMath.texString = await (0, cursor_1.renderCursor)(document, texMath, (0, utils_1.getColor)());
    }
    const result = await (0, hover_1.tex2svg)(texMath, cachedMacros).catch(() => undefined);
    if (!result) {
        return;
    }
    state.prevDocumentUri = documentUri;
    state.prevMacros = result.macros;
    state.prevCursorPosition = position;
    return state.panel.webview.postMessage({ type: 'mathImage', src: result.svgDataUrl });
}
function getTexMath(document, position) {
    const texMath = lw_1.lw.parser.find.math(document, position);
    if (texMath) {
        if (texMath.envname !== '$') {
            return texMath;
        }
        if (texMath.range.start.character !== position.character && texMath.range.end.character !== position.character) {
            return texMath;
        }
    }
    return;
}
//# sourceMappingURL=math-preview-panel.js.map