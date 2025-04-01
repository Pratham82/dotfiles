"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDefinedPatterns = {
    log: "console.log(`${text}`, ${text})",
    promise: "new Promise((yeah, nah) => yeah(${text}))",
};
const getConfiguration = () => userDefinedPatterns;
const workspace = { getConfiguration };
exports.workspace = workspace;
//# sourceMappingURL=vscode.js.map