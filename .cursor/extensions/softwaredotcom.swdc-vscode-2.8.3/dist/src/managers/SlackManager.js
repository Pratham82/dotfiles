"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSlackConnectionForFlowMode = exports.checkSlackConnection = exports.showModalSignupPrompt = exports.hasSlackWorkspaces = exports.getSlackWorkspaces = void 0;
const vscode_1 = require("vscode");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
async function getSlackWorkspaces() {
    return (await (0, DataController_1.getCachedSlackIntegrations)()).filter((n) => (0, Util_1.isActiveIntegration)('slack', n));
}
exports.getSlackWorkspaces = getSlackWorkspaces;
async function hasSlackWorkspaces() {
    return !!(await (0, DataController_1.getCachedSlackIntegrations)()).length;
}
exports.hasSlackWorkspaces = hasSlackWorkspaces;
function showModalSignupPrompt(msg) {
    vscode_1.window
        .showInformationMessage(msg, {
        modal: true,
    }, Constants_1.SIGN_UP_LABEL)
        .then(async (selection) => {
        if (selection === Constants_1.SIGN_UP_LABEL) {
            vscode_1.commands.executeCommand('codetime.registerAccount');
        }
    });
}
exports.showModalSignupPrompt = showModalSignupPrompt;
async function checkSlackConnection(showConnect = true) {
    if (!(await hasSlackWorkspaces())) {
        if (showConnect) {
            vscode_1.window
                .showInformationMessage('Connect a Slack workspace to continue.', {
                modal: true,
            }, 'Connect')
                .then(async (selection) => {
                if (selection === 'Connect') {
                    vscode_1.commands.executeCommand('codetime.connectSlackWorkspace');
                }
            });
        }
        return false;
    }
    return true;
}
exports.checkSlackConnection = checkSlackConnection;
async function checkSlackConnectionForFlowMode() {
    if (!(await hasSlackWorkspaces())) {
        const selection = await vscode_1.window.showInformationMessage("Slack isn't connected", { modal: true }, ...['Continue anyway', 'Connect Slack']);
        if (!selection) {
            // the user selected "cancel"
            return { continue: false, useSlackSettings: true };
        }
        else if (selection === 'Continue anyway') {
            // slack is not connected, but continue. set useSlackSettings to FALSE
            // set continue to TRUE
            (0, Util_1.setItem)('vscode_CtskipSlackConnect', true);
            return { continue: true, useSlackSettings: false };
        }
        else {
            // connect was selected
            vscode_1.commands.executeCommand('codetime.manageSlackConnection');
            return { continue: false, useSlackSettings: true };
        }
    }
    return { continue: true, useSlackSettings: true };
}
exports.checkSlackConnectionForFlowMode = checkSlackConnectionForFlowMode;
//# sourceMappingURL=SlackManager.js.map