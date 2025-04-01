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
exports.hook = exports.serializer = exports.isViewing = void 0;
exports.getParams = getParams;
exports.getViewerState = getViewerState;
exports.handler = handler;
exports.locate = locate;
exports.viewInWebviewPanel = viewInWebviewPanel;
exports.refresh = refresh;
exports.view = view;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const cs = __importStar(require("cross-spawn"));
const lw_1 = require("../lw");
const manager = __importStar(require("./viewer/pdfviewermanager"));
const pdfviewerpanel_1 = require("./viewer/pdfviewerpanel");
const client_1 = require("./viewer/client");
const webview_1 = require("../utils/webview");
const logger = lw_1.lw.log('Viewer');
var pdfviewerpanel_2 = require("./viewer/pdfviewerpanel");
Object.defineProperty(exports, "serializer", { enumerable: true, get: function () { return pdfviewerpanel_2.serializer; } });
var pdfviewerhook_1 = require("./viewer/pdfviewerhook");
Object.defineProperty(exports, "hook", { enumerable: true, get: function () { return pdfviewerhook_1.hook; } });
lw_1.lw.watcher.pdf.onChange(pdfUri => {
    if (lw_1.lw.compile.compiledPDFWriting === 0 || path.relative(lw_1.lw.compile.compiledPDFPath, pdfUri.fsPath) !== '') {
        refresh(pdfUri);
    }
});
lw_1.lw.onConfigChange(['view.pdf.toolbar.hide.timeout', 'view.pdf.invert', 'view.pdf.invertMode', 'view.pdf.color', 'view.pdf.internal', 'view.pdf.reload.transition'], () => {
    reload();
});
const isViewing = (fileUri) => manager.getClients(fileUri) !== undefined;
exports.isViewing = isViewing;
function reload() {
    manager.getClients()?.forEach(client => {
        client.send({ type: 'reload' });
    });
}
/**
 * Refreshes PDF viewers of `pdfFile`.
 *
 * @param pdfFile The path of a PDF file. If `pdfFile` is `undefined`,
 * refreshes all the PDF viewers.
 */
function refresh(pdfUri) {
    logger.log(`Call refreshExistingViewer: ${pdfUri ?? 'undefined'} .`);
    if (pdfUri === undefined) {
        manager.getClients()?.forEach(client => {
            client.send({ type: 'refresh', pdfFileUri: client.pdfFileUri });
        });
        return;
    }
    let clientSet = manager.getClients(pdfUri);
    clientSet = lw_1.lw.extra.liveshare.handle.viewer.refresh(pdfUri.fsPath, clientSet);
    if (!clientSet) {
        logger.log(`Not found PDF viewers to refresh: ${pdfUri}`);
        return;
    }
    logger.log(`Refresh PDF viewer: ${pdfUri}`);
    clientSet.forEach(client => {
        client.send({ type: 'refresh', pdfFileUri: client.pdfFileUri });
    });
}
async function getUrl(pdfUri) {
    if (!await lw_1.lw.file.exists(pdfUri)) {
        logger.log(`Cannot find PDF file ${pdfUri}`);
        logger.refreshStatus('check', 'statusBar.foreground', `Cannot view file PDF file. File not found: ${pdfUri}`, 'warning');
        return;
    }
    return (await lw_1.lw.server.getUrl(pdfUri)).url;
}
async function view(pdfUri, mode) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const tabEditorGroup = configuration.get('view.pdf.tab.editorGroup');
    let viewerMode = mode ?? configuration.get('view.pdf.viewer', 'tab');
    if (mode === 'tab' && configuration.get('view.pdf.viewer', 'tab') === 'legacy') {
        viewerMode = 'legacy';
    }
    if (viewerMode === 'browser') {
        return viewInBrowser(pdfUri);
    }
    else if (viewerMode === 'tab') {
        return viewInCustomEditor(pdfUri);
    }
    else if (viewerMode === 'legacy' || viewerMode === 'singleton') {
        return viewInWebviewPanel(pdfUri, tabEditorGroup, true);
    }
    else if (viewerMode === 'external') {
        return viewInExternal(pdfUri);
    }
    else {
        return viewInCustomEditor(pdfUri);
    }
}
/**
 * Opens the PDF uri in the browser.
 *
 * @param pdfUri The path of a PDF file.
 */
async function viewInBrowser(pdfUri) {
    const url = await getUrl(pdfUri);
    if (!url) {
        return;
    }
    manager.create(pdfUri);
    lw_1.lw.watcher.pdf.add(pdfUri);
    try {
        logger.log(`Serving PDF file at ${url}`);
        await vscode.env.openExternal(vscode.Uri.parse(url, true));
        logger.log(`Open PDF viewer for ${pdfUri.toString(true)}`);
    }
    catch (e) {
        void vscode.window.showInputBox({
            prompt: 'Unable to open browser. Please copy and visit this link.',
            value: url
        });
        logger.logError(`Failed opening PDF viewer for ${pdfUri.toString(true)}`, e);
    }
}
async function viewInCustomEditor(pdfUri) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const editorGroup = configuration.get('view.pdf.tab.editorGroup');
    const showOptions = {
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: true
    };
    if (editorGroup === 'left') {
        const currentColumn = vscode.window.activeTextEditor?.viewColumn;
        if (currentColumn && currentColumn > 1) {
            showOptions.viewColumn = currentColumn - 1;
            await vscode.commands.executeCommand('vscode.openWith', pdfUri, 'latex-workshop-pdf-hook', showOptions);
            await vscode.commands.executeCommand('workbench.action.focusRightGroup');
        }
        else {
            await vscode.commands.executeCommand('vscode.openWith', pdfUri, 'latex-workshop-pdf-hook', showOptions);
            await (0, webview_1.moveActiveEditor)('left', true);
        }
    }
    else if (editorGroup === 'right') {
        const currentColumn = vscode.window.activeTextEditor?.viewColumn;
        showOptions.viewColumn = (currentColumn ?? 0) + 1;
        await vscode.commands.executeCommand('vscode.openWith', pdfUri, 'latex-workshop-pdf-hook', showOptions);
        await vscode.commands.executeCommand('workbench.action.focusLeftGroup');
    }
    else {
        await vscode.commands.executeCommand('vscode.openWith', pdfUri, 'latex-workshop-pdf-hook', showOptions);
        await (0, webview_1.moveActiveEditor)(editorGroup, true);
    }
    logger.log(`Open PDF tab for ${pdfUri.toString(true)}`);
}
async function viewInWebviewPanel(pdfUri, tabEditorGroup, preserveFocus) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const singleton = configuration.get('view.pdf.viewer', 'tab') === 'singleton';
    if (singleton) {
        const panels = manager.getPanels(pdfUri);
        if (panels && panels.size > 0) {
            panels.forEach(panel => panel.webviewPanel.reveal(undefined, true));
            logger.log(`Reveal the existing PDF tab for ${pdfUri.toString(true)}`);
            return;
        }
    }
    const activeDocument = vscode.window.activeTextEditor?.document;
    const webviewPanel = vscode.window.createWebviewPanel('latex-workshop-pdf', path.basename(pdfUri.path), {
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: tabEditorGroup === 'current'
    }, {
        enableScripts: true,
        retainContextWhenHidden: true
    });
    const viewerPanel = await (0, pdfviewerpanel_1.populate)(pdfUri, webviewPanel);
    manager.insert(viewerPanel);
    if (!viewerPanel) {
        return;
    }
    if (tabEditorGroup !== 'current' && activeDocument) {
        await (0, webview_1.moveActiveEditor)(tabEditorGroup, preserveFocus);
    }
    logger.log(`Open PDF tab for ${pdfUri.toString(true)}`);
}
/**
 * Opens the PDF file of in the external PDF viewer.
 *
 * @param pdfUri The path of a PDF file.
 */
function viewInExternal(pdfUri) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    let command = configuration.get('view.pdf.external.viewer.command');
    let args = configuration.get('view.pdf.external.viewer.args');
    if (!command) {
        switch (process.platform) {
            case 'win32':
                command = 'SumatraPDF.exe';
                args = ['%PDF%'];
                break;
            case 'linux':
                command = 'xdg-open';
                args = ['%PDF%'];
                break;
            case 'darwin':
                command = 'open';
                args = ['%PDF%'];
                break;
            default:
                break;
        }
    }
    if (args) {
        args = args.map(arg => arg.replace('%PDF%', pdfUri.fsPath));
    }
    logger.log(`Open external viewer for ${pdfUri.toString(true)}`);
    logger.logCommand('Execute the external PDF viewer command', command, args);
    const proc = cs.spawn(command, args, { cwd: path.dirname(pdfUri.fsPath), detached: true });
    let stdout = '';
    proc.stdout.on('data', newStdout => {
        stdout += newStdout;
    });
    let stderr = '';
    proc.stderr.on('data', newStderr => {
        stderr += newStderr;
    });
    const cb = () => {
        void logger.log(`The external PDF viewer stdout: ${stdout}`);
        void logger.log(`The external PDF viewer stderr: ${stderr}`);
    };
    proc.on('error', cb);
    proc.on('exit', cb);
}
/**
 * Handles the request from the internal PDF viewer.
 *
 * @param websocket The WebSocket connecting with the viewer.
 * @param msg A message from the viewer in JSON fromat.
 */
function handler(websocket, msg) {
    const data = JSON.parse(msg);
    if (data.type !== 'ping') {
        logger.log(`Handle data type: ${data.type}`);
    }
    switch (data.type) {
        case 'open': {
            const pdfUri = vscode.Uri.parse(data.pdfFileUri, true);
            if (pdfUri.scheme === 'vsls' && lw_1.lw.extra.liveshare.isHost()) {
                manager.create(pdfUri);
            }
            const clientSet = manager.getClients(pdfUri);
            if (clientSet === undefined) {
                break;
            }
            const client = new client_1.Client(websocket, pdfUri.toString(true));
            lw_1.lw.extra.liveshare.register(client);
            clientSet.add(client);
            client.onDidDispose(() => {
                clientSet.delete(client);
            });
            break;
        }
        case 'loaded': {
            lw_1.lw.event.fire(lw_1.lw.event.ViewerPageLoaded);
            const configuration = vscode.workspace.getConfiguration('latex-workshop');
            if (configuration.get('synctex.afterBuild.enabled')) {
                logger.log('SyncTex after build invoked.');
                const uri = vscode.Uri.parse(data.pdfFileUri, true);
                lw_1.lw.locate.synctex.toPDF(uri);
            }
            break;
        }
        case 'reverse_synctex': {
            const uri = vscode.Uri.parse(data.pdfFileUri, true);
            if (lw_1.lw.extra.liveshare.handle.viewer.reverseSyncTeX(websocket, uri, data)) {
                break;
            }
            void lw_1.lw.locate.synctex.toTeX(data, uri);
            break;
        }
        case 'external_link': {
            const uri = vscode.Uri.parse(data.url);
            if (['http', 'https'].includes(uri.scheme)) {
                void vscode.env.openExternal(uri);
            }
            else {
                void vscode.window.showInputBox({
                    prompt: 'For security reasons, please copy and visit this link manually.',
                    value: data.url
                });
            }
            break;
        }
        case 'ping': {
            // nothing to do
            break;
        }
        case 'add_log': {
            logger.log(`${data.message}`);
            break;
        }
        case 'copy': {
            if ((data.isMetaKey && os.platform() === 'darwin') ||
                (!data.isMetaKey && os.platform() !== 'darwin')) {
                void vscode.env.clipboard.writeText(data.content);
            }
            break;
        }
        default: {
            if (lw_1.lw.extra.liveshare.handle.viewer.syncTeX(websocket, data)) {
                break;
            }
            logger.log(`Unknown websocket message: ${msg}`);
            break;
        }
    }
}
function getParams() {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const invertType = configuration.get('view.pdf.invertMode.enabled');
    const invertEnabled = (invertType === 'auto' && vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark) ||
        invertType === 'always' ||
        (invertType === 'compat' && configuration.get('view.pdf.invert') > 0);
    const pack = {
        toolbar: configuration.get('view.pdf.toolbar.hide.timeout'),
        scale: configuration.get('view.pdf.zoom'),
        trim: configuration.get('view.pdf.trim'),
        scrollMode: configuration.get('view.pdf.scrollMode'),
        spreadMode: configuration.get('view.pdf.spreadMode'),
        hand: configuration.get('view.pdf.hand'),
        invertMode: {
            enabled: invertEnabled,
            brightness: configuration.get('view.pdf.invertMode.brightness'),
            grayscale: configuration.get('view.pdf.invertMode.grayscale'),
            hueRotate: configuration.get('view.pdf.invertMode.hueRotate'),
            invert: configuration.get('view.pdf.invert'),
            sepia: configuration.get('view.pdf.invertMode.sepia'),
        },
        color: {
            light: {
                pageColorsForeground: configuration.get('view.pdf.color.light.pageColorsForeground') || 'CanvasText',
                pageColorsBackground: configuration.get('view.pdf.color.light.pageColorsBackground') || 'Canvas',
                backgroundColor: configuration.get('view.pdf.color.light.backgroundColor', '#ffffff'),
                pageBorderColor: configuration.get('view.pdf.color.light.pageBorderColor', 'lightgrey'),
            },
            dark: {
                pageColorsForeground: configuration.get('view.pdf.color.dark.pageColorsForeground') || 'CanvasText',
                pageColorsBackground: configuration.get('view.pdf.color.dark.pageColorsBackground') || 'Canvas',
                backgroundColor: configuration.get('view.pdf.color.dark.backgroundColor', '#ffffff'),
                pageBorderColor: configuration.get('view.pdf.color.dark.pageBorderColor', 'lightgrey'),
            },
        },
        codeColorTheme: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Light ? 'light' : 'dark',
        keybindings: {
            synctex: configuration.get('view.pdf.internal.synctex.keybinding'),
        },
        reloadTransition: configuration.get('view.pdf.reload.transition'),
    };
    return pack;
}
/**
 * Reveals the position of `record` on the internal PDF viewers.
 *
 * @param pdfUri The path of a PDF file.
 * @param record The position to be revealed.
 */
async function locate(pdfUri, record) {
    let clientSet = manager.getClients(pdfUri);
    if (clientSet === undefined || clientSet.size === 0) {
        logger.log(`PDF is not opened: ${pdfUri.toString(true)} , try opening.`);
        await view(pdfUri);
        clientSet = manager.getClients(pdfUri);
    }
    if (clientSet === undefined || clientSet.size === 0) {
        logger.log(`PDF cannot be opened: ${pdfUri.toString(true)} .`);
        return;
    }
    const needDelay = showInvisibleWebviewPanel(pdfUri);
    for (const client of clientSet) {
        setTimeout(() => {
            client.send({ type: 'synctex', data: record });
        }, needDelay ? 200 : 0);
        logger.log(`Try to synctex ${pdfUri.toString(true)}`);
    }
}
/**
 * Reveals the internal PDF viewer of `pdfUri`.
 * The first one is revealed.
 *
 * @param pdfUri The path of a PDF file.
 * @returns Returns `true` if `WebviewPanel.reveal` called.
 */
function showInvisibleWebviewPanel(pdfUri) {
    const panelSet = manager.getPanels(pdfUri);
    if (!panelSet) {
        return false;
    }
    const activeViewColumn = vscode.window.activeTextEditor?.viewColumn;
    for (const panel of panelSet) {
        const isSyntexOn = !panel.state || panel.state.synctexEnabled;
        if (panel.webviewPanel.viewColumn !== activeViewColumn
            && !panel.webviewPanel.visible
            && isSyntexOn) {
            panel.webviewPanel.reveal(panel.webviewPanel.viewColumn, true);
            return true;
        }
        if (panel.webviewPanel.visible && isSyntexOn) {
            return false;
        }
        if (panel.webviewPanel.viewColumn !== activeViewColumn) {
            return false;
        }
    }
    return false;
}
/**
 * !! Test only
 * Returns the state of the internal PDF viewer of `pdfFilePath`.
 *
 * @param pdfUri The path of a PDF file.
 */
function getViewerState(pdfUri) {
    const panelSet = manager.getPanels(pdfUri);
    if (!panelSet) {
        return [];
    }
    return Array.from(panelSet).map(e => e.state);
}
//# sourceMappingURL=viewer.js.map