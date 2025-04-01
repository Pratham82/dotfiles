"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchDefaultLanguage = void 0;
const vscode_1 = require("vscode");
const shared_1 = require("../shared");
function switchDefaultLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        const leetCodeConfig = vscode_1.workspace.getConfiguration("leetcode");
        const defaultLanguage = leetCodeConfig.get("defaultLanguage");
        const languageItems = [];
        for (const language of shared_1.languages) {
            languageItems.push({
                label: language,
                description: defaultLanguage === language ? "Currently used" : undefined,
            });
        }
        // Put the default language at the top of the list
        languageItems.sort((a, b) => {
            if (a.description) {
                return Number.MIN_SAFE_INTEGER;
            }
            else if (b.description) {
                return Number.MAX_SAFE_INTEGER;
            }
            return a.label.localeCompare(b.label);
        });
        const selectedItem = yield vscode_1.window.showQuickPick(languageItems, {
            placeHolder: "Please the default language",
            ignoreFocusOut: true,
        });
        if (!selectedItem) {
            return;
        }
        leetCodeConfig.update("defaultLanguage", selectedItem.label, true /* Global */);
        vscode_1.window.showInformationMessage(`Successfully set the default language to ${selectedItem.label}`);
    });
}
exports.switchDefaultLanguage = switchDefaultLanguage;
//# sourceMappingURL=language.js.map