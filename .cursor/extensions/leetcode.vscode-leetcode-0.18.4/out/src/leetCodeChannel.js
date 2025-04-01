"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeChannel = void 0;
const vscode = require("vscode");
class LeetCodeChannel {
    constructor() {
        this.channel = vscode.window.createOutputChannel("LeetCode");
    }
    appendLine(message) {
        this.channel.appendLine(message);
    }
    append(message) {
        this.channel.append(message);
    }
    show() {
        this.channel.show();
    }
    dispose() {
        this.channel.dispose();
    }
}
exports.leetCodeChannel = new LeetCodeChannel();
//# sourceMappingURL=leetCodeChannel.js.map