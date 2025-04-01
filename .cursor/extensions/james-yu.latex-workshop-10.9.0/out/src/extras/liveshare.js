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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.getApi = getApi;
exports.getHostServerPort = getHostServerPort;
exports.isGuest = isGuest;
exports.isHost = isHost;
exports.register = register;
exports.shareServer = shareServer;
const vsls = __importStar(require("vsls/vscode"));
const vscode = __importStar(require("vscode"));
const url = __importStar(require("url"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const lw_1 = require("../lw");
const pdfviewermanager_1 = require("../preview/viewer/pdfviewermanager");
const logger = lw_1.lw.log('LiveShare');
/**
 * This module exports the Live Share API and handles the connection to the host server.
 * Since LiveShare allows sharing the server, in order to support features like PDF sync,
 * Synctex, and reverse Synctex, we provide LiveShare guests with the ability to connect
 * to the host Workshop server.
 * Unfortunately, the LiveShare extensions seems to be abandoned by Microsoft, with
 * long standing issues like the lack of binary file support:
 * https://github.com/microsoft/live-share/issues/1895
 *
 * The URIs must then be carefully handled to follow the `vsls` scheme, not `file` on guests.
 * Fot the server to be shared, the host must Allow for port sharing when prompted or execute
 * the HOSTPORT command. Already connected guests need to execute that command as well
 * to update the port.
 * Another limitation is that the host must already have the viewer and compiler running.
 */
const handle = {
    command: {
        syncTeX: handleCommandSyncTeX
    },
    viewer: {
        refresh: handleViewerRefresh,
        reverseSyncTeX: handleViewerReverseSyncTeX,
        syncTeX: handleViewerSyncTeX
    },
    server: {
        request: handleServerRequest
    }
};
exports.handle = handle;
const state = {
    initialized: new Promise(resolve => vsls.getApi().then(api => {
        if (api === null) {
            resolve();
            return;
        }
        setRole(api.session.role);
        state.liveshare = api;
        state.liveshare.onDidChangeSession(e => setRole(e.session.role));
        resolve();
    })),
    liveshare: undefined,
    role: vsls.Role.None,
    hostServerPort: undefined,
    shareServerDisposable: undefined,
    connected: false,
    ws: undefined
};
function isGuest() {
    return state.role === vsls.Role.Guest;
}
function isHost() {
    return state.role === vsls.Role.Host;
}
function getApi() {
    return state.liveshare;
}
/**
 * Runs init logic for the host or guest, depending on the assigned role.
 * @param role The role of the user in the Live Share session.
 */
function setRole(role) {
    state.role = role;
    state.hostServerPort = undefined;
    state.shareServerDisposable?.dispose();
    resetConnection();
    if (role === vsls.Role.Guest) {
        void initGuest();
    }
    else if (role === vsls.Role.Host) {
        void initHost();
    }
}
async function initGuest() {
    await getHostServerPort();
    await connectHost();
}
async function initHost() {
    await shareServer();
}
/**
 * Returns the saved host server port or checks the shared servers for a new port.
 * @param reset If true, the host server port is reset and a new one is acquired.
 * @returns Promise that resolves to the host server port.
 */
async function getHostServerPort(reset = false) {
    if (!reset && state.hostServerPort !== undefined) {
        return state.hostServerPort;
    }
    const savedClipboard = await vscode.env.clipboard.readText();
    void vscode.commands.executeCommand('liveshare.listServers');
    // delay here instead of doing await vscode.commands.executeCommand acquires the port more reliably because await vscode.commands.executeCommand does not return until the user closes the info box of the command or clicks copy again.
    await sleep(500);
    const hostUrl = await vscode.env.clipboard.readText();
    const hostServerPort = Number(url.parse(hostUrl).port);
    state.hostServerPort = hostServerPort;
    await vscode.env.clipboard.writeText(savedClipboard);
    return hostServerPort;
}
/**
 * Shares the server using the Live Share API.
 * @returns Promise that resolves when the server is shared.
 */
async function shareServer() {
    if (state.role !== vsls.Role.Host) {
        return;
    }
    state.shareServerDisposable?.dispose();
    await state.initialized;
    state.shareServerDisposable = await state.liveshare?.shareServer({ port: lw_1.lw.server.getPort(), displayName: 'latex-workshop-server' });
}
/**
 * Connects to the WebSocket server of the host.
 */
async function connectHost() {
    logger.log('Connecting to host');
    if (state.role !== vsls.Role.Guest) {
        resetConnection();
        return;
    }
    if (state.connected) {
        logger.log('Already connected to host.');
        return;
    }
    const server = await vscode.env.asExternalUri(vscode.Uri.parse(`http://127.0.0.1:${await getHostServerPort()}`, true));
    await new Promise(resolve => {
        const websocket = new ws_1.default.WebSocket(server.toString(true));
        websocket.addEventListener('open', () => {
            logger.log('Connected to host');
            state.ws = websocket;
            state.connected = true;
            resolve();
        });
    });
    state.ws?.addEventListener('message', event => {
        if (event.type === 'message') {
            connectionHandler(event.data);
        }
    });
    state.ws?.addEventListener('close', async () => {
        logger.log('Connection to host disconnected');
        state.connected = false;
        await reconnect();
    });
    state.ws?.addEventListener('error', err => logger.logError(`Failed to connect to ${server}`, err));
    const id = setInterval(() => {
        try {
            sendToHost({ type: 'ping' });
        }
        catch {
            clearInterval(id);
        }
    }, 30000);
}
function resetConnection() {
    logger.log('Reset connection to host');
    state.connected = false;
    state.ws = undefined;
}
function connectionHandler(msg) {
    const data = JSON.parse(msg);
    logger.log(`Handle data type: ${data.type}`);
    switch (data.type) {
        case 'refresh': {
            lw_1.lw.viewer.refresh(vscode.Uri.parse(data.pdfFileUri));
            break;
        }
        case 'reverse_synctex_result': {
            void lw_1.lw.locate.synctex.components.openTeX(vscode.Uri.parse(data.input).fsPath, data.line, data.column, data.textBeforeSelection, data.textAfterSelection);
            break;
        }
        case 'synctex_result': {
            void lw_1.lw.viewer.locate(vscode.Uri.parse(data.pdfFile, true), data.synctexData);
            break;
        }
        default: {
            break;
        }
    }
}
async function reconnect() {
    // Since WebSockets are disconnected when PC resumes from sleep,
    // we have to reconnect. https://github.com/James-Yu/LaTeX-Workshop/pull/1812
    await sleep(3000);
    let tries = 1;
    while (tries <= 10) {
        try {
            await connectHost();
            register();
            if (state.ws?.readyState !== 1) {
                throw new Error('Connection to host is not open.');
            }
            return;
        }
        catch (_e) {
        }
        await sleep(1000 * (tries + 2));
        tries++;
    }
}
function register(client) {
    if (client) {
        sendToHost({ type: 'open', pdfFileUri: client.pdfFileUri });
    }
    (0, pdfviewermanager_1.getClients)()?.forEach(guestClient => {
        sendToHost({ type: 'open', pdfFileUri: guestClient.pdfFileUri });
    });
}
function sendToHost(message) {
    logger.log(`Sends message ${JSON.stringify(message)} to host`);
    if (state.role !== vsls.Role.Guest) {
        return;
    }
    if (state.ws?.readyState === 1) {
        state.ws.send(JSON.stringify(message));
    }
}
function handleCommandSyncTeX() {
    if (!isGuest()) {
        return false;
    }
    const coords = lw_1.lw.locate.synctex.components.getCurrentEditorCoordinates();
    if (lw_1.lw.root.file.path === undefined || coords === undefined) {
        logger.log('Cannot find LaTeX root PDF to perform synctex.');
        return true;
    }
    const pdfFileUri = lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(lw_1.lw.root.file.path));
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.root.getWorkspace());
    const indicator = configuration.get('synctex.indicator');
    sendToHost({ type: 'synctex', line: coords.line, column: coords.column, filePath: coords.inputFileUri.toString(true), targetPdfFile: pdfFileUri.toString(true), indicator });
    return true;
}
function handleViewerRefresh(pdfFile, clientSet) {
    if (isHost() && state.liveshare && pdfFile !== undefined) {
        const sharedUri = state.liveshare.convertLocalUriToShared(lw_1.lw.file.toUri(pdfFile));
        const guestClients = (0, pdfviewermanager_1.getClients)(sharedUri);
        if (guestClients) {
            clientSet?.forEach(client => guestClients.add(client));
            return guestClients;
        }
    }
    return clientSet;
}
function handleViewerReverseSyncTeX(websocket, uri, data) {
    if (isGuest()) {
        state.ws?.send(JSON.stringify(data)); // forward the request to host
        return true;
    }
    else if (isHost() && uri.scheme === 'vsls' && state.liveshare) { // reply to guest if request comes from guest
        const localUri = state.liveshare.convertSharedUriToLocal(uri) ?? uri;
        void lw_1.lw.locate.synctex.components.computeToTeX(data, localUri).then(record => {
            if (record && state.liveshare) {
                const response = {
                    type: 'reverse_synctex_result',
                    input: state.liveshare.convertLocalUriToShared(vscode.Uri.file(record.input)).toString(true),
                    line: record.line,
                    column: record.column,
                    textBeforeSelection: data.textAfterSelection,
                    textAfterSelection: data.textAfterSelection
                };
                websocket.send(JSON.stringify(response));
            }
        });
        return true;
    }
    return false;
}
function handleViewerSyncTeX(websocket, data) {
    if (data.type !== 'synctex') {
        return false;
    }
    if (!isHost() || !state.liveshare) {
        return true;
    }
    const filePath = state.liveshare.convertSharedUriToLocal(vscode.Uri.parse(data.filePath, true)).fsPath;
    const targetPdfFile = state.liveshare.convertSharedUriToLocal(vscode.Uri.parse(data.targetPdfFile, true));
    void lw_1.lw.locate.synctex.components.synctexToPDFCombined(data.line, data.column, filePath, targetPdfFile, data.indicator).then(record => {
        if (!record) {
            logger.log(`Failed to locate synctex for ${filePath}. This was requested from a guest.`);
            return;
        }
        const response = {
            type: 'synctex_result',
            pdfFile: data.targetPdfFile,
            synctexData: record
        };
        websocket.send(JSON.stringify(response));
    });
    return true;
}
async function handleServerRequest(request, response) {
    if (!isGuest()) {
        return false;
    }
    if (!request.url) {
        return true;
    }
    const requestUrl = url.parse(request.url);
    const options = {
        host: requestUrl.hostname,
        port: await getHostServerPort(),
        path: requestUrl.path,
        method: request.method,
        headers: request.headers,
    };
    const backendReq = http_1.default.request(options, (backendRes) => {
        if (!backendRes.statusCode) {
            response.end();
            return;
        }
        response.writeHead(backendRes.statusCode, backendRes.headers);
        backendRes.on('data', (chunk) => {
            response.write(chunk);
        });
        backendRes.on('end', () => {
            response.end();
        });
    });
    request.on('data', (chunk) => {
        backendReq.write(chunk);
    });
    request.on('end', () => {
        backendReq.end();
    });
    return true;
}
async function sleep(timeout) {
    await new Promise((resolve) => setTimeout(resolve, timeout));
}
//# sourceMappingURL=liveshare.js.map