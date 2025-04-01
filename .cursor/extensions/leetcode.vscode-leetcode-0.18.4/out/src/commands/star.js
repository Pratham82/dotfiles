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
exports.removeFavorite = exports.addFavorite = void 0;
const CustomCodeLensProvider_1 = require("../codelens/CustomCodeLensProvider");
const LeetCodeTreeDataProvider_1 = require("../explorer/LeetCodeTreeDataProvider");
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const settingUtils_1 = require("../utils/settingUtils");
const uiUtils_1 = require("../utils/uiUtils");
function addFavorite(node) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield leetCodeExecutor_1.leetCodeExecutor.toggleFavorite(node, true);
            yield LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.refresh();
            if (settingUtils_1.hasStarShortcut()) {
                CustomCodeLensProvider_1.customCodeLensProvider.refresh();
            }
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to add the problem to favorite. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.addFavorite = addFavorite;
function removeFavorite(node) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield leetCodeExecutor_1.leetCodeExecutor.toggleFavorite(node, false);
            yield LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.refresh();
            if (settingUtils_1.hasStarShortcut()) {
                CustomCodeLensProvider_1.customCodeLensProvider.refresh();
            }
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to remove the problem from favorite. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.removeFavorite = removeFavorite;
//# sourceMappingURL=star.js.map