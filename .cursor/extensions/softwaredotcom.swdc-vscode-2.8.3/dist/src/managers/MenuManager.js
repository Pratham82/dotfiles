"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuickPick = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
function showQuickPick(pickOptions) {
    if (!pickOptions || !pickOptions['items']) {
        return;
    }
    const options = {
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: pickOptions.placeholder || '',
    };
    return vscode_1.window.showQuickPick(pickOptions.items, options).then(async (item) => {
        if (item) {
            const url = item['url'];
            const cb = item['cb'];
            const command = item['command'];
            const commandArgs = item['commandArgs'] || [];
            if (url) {
                (0, Util_1.launchWebUrl)(url);
            }
            else if (cb) {
                cb();
            }
            else if (command) {
                vscode_1.commands.executeCommand(command, ...commandArgs);
            }
        }
        return item;
    });
}
exports.showQuickPick = showQuickPick;
//# sourceMappingURL=MenuManager.js.map