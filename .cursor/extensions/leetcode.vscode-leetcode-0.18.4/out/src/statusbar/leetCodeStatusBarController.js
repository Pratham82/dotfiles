"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeStatusBarController = void 0;
const vscode_1 = require("vscode");
const LeetCodeStatusBarItem_1 = require("./LeetCodeStatusBarItem");
class LeetCodeStatusBarController {
    constructor() {
        this.statusBar = new LeetCodeStatusBarItem_1.LeetCodeStatusBarItem();
        this.setStatusBarVisibility();
        this.configurationChangeListener = vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("leetcode.enableStatusBar")) {
                this.setStatusBarVisibility();
            }
        }, this);
    }
    updateStatusBar(status, user) {
        this.statusBar.updateStatusBar(status, user);
    }
    dispose() {
        this.statusBar.dispose();
        this.configurationChangeListener.dispose();
    }
    setStatusBarVisibility() {
        if (this.isStatusBarEnabled()) {
            this.statusBar.show();
        }
        else {
            this.statusBar.hide();
        }
    }
    isStatusBarEnabled() {
        const configuration = vscode_1.workspace.getConfiguration();
        return configuration.get("leetcode.enableStatusBar", true);
    }
}
exports.leetCodeStatusBarController = new LeetCodeStatusBarController();
//# sourceMappingURL=leetCodeStatusBarController.js.map