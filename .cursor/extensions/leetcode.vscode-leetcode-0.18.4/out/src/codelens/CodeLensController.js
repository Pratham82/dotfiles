"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeLensController = void 0;
const vscode_1 = require("vscode");
const CustomCodeLensProvider_1 = require("./CustomCodeLensProvider");
class CodeLensController {
    constructor() {
        this.internalProvider = CustomCodeLensProvider_1.customCodeLensProvider;
        this.configurationChangeListener = vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("leetcode.editor.shortcuts")) {
                this.internalProvider.refresh();
            }
        }, this);
        this.registeredProvider = vscode_1.languages.registerCodeLensProvider({ scheme: "file" }, this.internalProvider);
    }
    dispose() {
        if (this.registeredProvider) {
            this.registeredProvider.dispose();
        }
        this.configurationChangeListener.dispose();
    }
}
exports.codeLensController = new CodeLensController();
//# sourceMappingURL=CodeLensController.js.map