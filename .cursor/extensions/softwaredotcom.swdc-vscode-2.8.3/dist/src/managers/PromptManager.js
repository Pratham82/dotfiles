"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showModalSignupPrompt = exports.SIGN_UP_LABEL = void 0;
const vscode_1 = require("vscode");
exports.SIGN_UP_LABEL = 'Sign up';
function showModalSignupPrompt(msg) {
    vscode_1.window
        .showInformationMessage(msg, {
        modal: true,
    }, exports.SIGN_UP_LABEL)
        .then((selection) => {
        if (selection === exports.SIGN_UP_LABEL) {
            vscode_1.commands.executeCommand('');
        }
    });
}
exports.showModalSignupPrompt = showModalSignupPrompt;
//# sourceMappingURL=PromptManager.js.map