"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDashboard = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("../http/HttpClient");
const _404_1 = require("../local/404");
const Util_1 = require("../Util");
let currentPanel = undefined;
async function showDashboard(params = {}) {
    if (!(0, Util_1.checkRegistrationForReport)(true)) {
        return;
    }
    initiatePanel('Dashboard', 'dashboard');
    if ((0, Util_1.isPrimaryWindow)()) {
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: 'Loading dashboard...',
            cancellable: false,
        }, async () => {
            loadDashboard(params);
        });
    }
    else {
        // no need to show the loading notification for secondary windows
        loadDashboard(params);
    }
}
exports.showDashboard = showDashboard;
async function loadDashboard(params) {
    const html = await getDashboardHtml(params);
    if (currentPanel) {
        currentPanel.webview.html = html;
        currentPanel.reveal(vscode_1.ViewColumn.One);
    }
}
function initiatePanel(title, viewType) {
    if (currentPanel) {
        // dipose the previous one
        currentPanel.dispose();
    }
    if (!currentPanel) {
        currentPanel = vscode_1.window.createWebviewPanel(viewType, title, vscode_1.ViewColumn.One, { enableScripts: true });
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        });
    }
    // commandMessage can be anything; object, number, string, etc
    currentPanel.webview.onDidReceiveMessage(async (commandMessage) => {
        //
    });
    currentPanel.webview.onDidReceiveMessage(async (message) => {
        if (message?.action) {
            const cmd = message.action.includes('codetime.') ? message.action : `codetime.${message.action}`;
            switch (message.command) {
                case 'command_execute':
                    if (message.payload && Object.keys(message.payload).length) {
                        vscode_1.commands.executeCommand(cmd, message.payload);
                    }
                    else {
                        vscode_1.commands.executeCommand(cmd);
                    }
                    break;
            }
        }
    });
}
async function getDashboardHtml(params) {
    const qryString = new URLSearchParams(params).toString();
    const resp = await (0, HttpClient_1.appGet)(`/plugin/dashboard?${qryString}`);
    if ((0, HttpClient_1.isResponseOk)(resp)) {
        return resp.data.html;
    }
    else {
        vscode_1.window.showErrorMessage('Unable to generate dashboard. Please try again later.');
        return await (0, _404_1.getConnectionErrorHtml)();
    }
}
//# sourceMappingURL=WebViewManager.js.map