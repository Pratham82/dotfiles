"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIntegrationConnectionSocketEvent = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
async function handleIntegrationConnectionSocketEvent(body) {
    // integration_type_id = 14 (slack)
    // action = add, update, remove
    const { integration_type_id, action } = body;
    if (integration_type_id === 14) {
        await (0, DataController_1.getCachedUser)();
        if (action === "add") {
            // refresh the slack integrations
            // clear the auth callback state
            (0, Util_1.setAuthCallbackState)(null);
            showSuccessMessage("Successfully connected to Slack");
        }
        vscode_1.commands.executeCommand("codetime.refreshCodeTimeView");
    }
}
exports.handleIntegrationConnectionSocketEvent = handleIntegrationConnectionSocketEvent;
function showSuccessMessage(message) {
    vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: message,
        cancellable: false,
    }, async (progress) => {
        setTimeout(() => {
            return true;
        }, 1000);
    });
}
//# sourceMappingURL=integration_connection.js.map