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
exports.submitSolution = void 0;
const LeetCodeTreeDataProvider_1 = require("../explorer/LeetCodeTreeDataProvider");
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const leetCodeManager_1 = require("../leetCodeManager");
const uiUtils_1 = require("../utils/uiUtils");
const workspaceUtils_1 = require("../utils/workspaceUtils");
const leetCodeSubmissionProvider_1 = require("../webview/leetCodeSubmissionProvider");
function submitSolution(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!leetCodeManager_1.leetCodeManager.getUser()) {
            uiUtils_1.promptForSignIn();
            return;
        }
        const filePath = yield workspaceUtils_1.getActiveFilePath(uri);
        if (!filePath) {
            return;
        }
        try {
            const result = yield leetCodeExecutor_1.leetCodeExecutor.submitSolution(filePath);
            leetCodeSubmissionProvider_1.leetCodeSubmissionProvider.show(result);
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to submit the solution. Please open the output channel for details.", uiUtils_1.DialogType.error);
            return;
        }
        LeetCodeTreeDataProvider_1.leetCodeTreeDataProvider.refresh();
    });
}
exports.submitSolution = submitSolution;
//# sourceMappingURL=submit.js.map