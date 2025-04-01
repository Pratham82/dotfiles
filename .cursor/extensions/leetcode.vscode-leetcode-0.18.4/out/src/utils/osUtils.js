"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.usingCmd = exports.isWindows = void 0;
function isWindows() {
    return process.platform === "win32";
}
exports.isWindows = isWindows;
function usingCmd() {
    const comSpec = process.env.ComSpec;
    // 'cmd.exe' is used as a fallback if process.env.ComSpec is unavailable.
    if (!comSpec) {
        return true;
    }
    if (comSpec.indexOf("cmd.exe") > -1) {
        return true;
    }
    return false;
}
exports.usingCmd = usingCmd;
//# sourceMappingURL=osUtils.js.map