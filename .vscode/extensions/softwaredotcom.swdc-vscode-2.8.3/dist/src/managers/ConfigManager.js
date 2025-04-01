"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getEditSettingsHtml = exports.configureSettings = exports.closeSettings = exports.showingConfigureSettingsPanel = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const HttpClient_1 = require("../http/HttpClient");
const _404_1 = require("../local/404");
const endOfDay_1 = require("../notifications/endOfDay");
let currentPanel = undefined;
function showingConfigureSettingsPanel() {
    return !!currentPanel;
}
exports.showingConfigureSettingsPanel = showingConfigureSettingsPanel;
function closeSettings() {
    if (currentPanel) {
        // dispose the previous one. always use the same tab
        currentPanel.dispose();
    }
}
exports.closeSettings = closeSettings;
async function configureSettings() {
    if (currentPanel) {
        // dispose the previous one. always use the same tab
        currentPanel.dispose();
    }
    if (!currentPanel) {
        currentPanel = vscode_1.window.createWebviewPanel('edit_settings', 'Code Time Settings', vscode_1.ViewColumn.One, {
            enableScripts: true,
        });
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
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
    currentPanel.webview.html = await getEditSettingsHtml();
    currentPanel.reveal(vscode_1.ViewColumn.One);
}
exports.configureSettings = configureSettings;
async function getEditSettingsHtml() {
    const resp = await (0, HttpClient_1.appGet)(`/plugin/settings`, { editor: 'vscode' });
    if ((0, HttpClient_1.isResponseOk)(resp)) {
        return resp.data.html;
    }
    return await (0, _404_1.getConnectionErrorHtml)();
}
exports.getEditSettingsHtml = getEditSettingsHtml;
async function updateSettings(path, jsonData, reloadSettings) {
    await (0, HttpClient_1.appPut)(path, jsonData);
    await (0, DataController_1.getUser)();
    // update the end of the day notification trigger
    (0, endOfDay_1.setEndOfDayNotification)();
    // update the sidebar
    vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
    if (reloadSettings && currentPanel) {
        configureSettings();
    }
}
exports.updateSettings = updateSettings;
//# sourceMappingURL=ConfigManager.js.map