"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressIt = exports.ProgressManager = void 0;
const vscode_1 = require("vscode");
class ProgressManager {
    constructor() {
        this.doneWriting = true;
        //
    }
    static getInstance() {
        if (!ProgressManager.instance) {
            ProgressManager.instance = new ProgressManager();
        }
        return ProgressManager.instance;
    }
}
exports.ProgressManager = ProgressManager;
function progressIt(msg, asyncFunc, args = []) {
    vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: msg,
        cancellable: false,
    }, async (progress) => {
        if (typeof asyncFunc === 'function') {
            if (args?.length) {
                await asyncFunc(...args).catch((e) => { });
            }
            else {
                await asyncFunc().catch((e) => { });
            }
        }
        else {
            await asyncFunc;
        }
    });
}
exports.progressIt = progressIt;
//# sourceMappingURL=ProgressManager.js.map