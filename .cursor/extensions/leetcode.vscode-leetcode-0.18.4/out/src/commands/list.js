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
exports.listProblems = void 0;
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const leetCodeManager_1 = require("../leetCodeManager");
const shared_1 = require("../shared");
const settingUtils = require("../utils/settingUtils");
const uiUtils_1 = require("../utils/uiUtils");
function listProblems() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (leetCodeManager_1.leetCodeManager.getStatus() === shared_1.UserStatus.SignedOut) {
                return [];
            }
            const useEndpointTranslation = settingUtils.shouldUseEndpointTranslation();
            const result = yield leetCodeExecutor_1.leetCodeExecutor.listProblems(true, useEndpointTranslation);
            const problems = [];
            const lines = result.split("\n");
            const reg = /^(.)\s(.{1,2})\s(.)\s\[\s*(\d*)\s*\]\s*(.*)\s*(Easy|Medium|Hard)\s*\((\s*\d+\.\d+ %)\)/;
            const { companies, tags } = yield leetCodeExecutor_1.leetCodeExecutor.getCompaniesAndTags();
            for (const line of lines) {
                const match = line.match(reg);
                if (match && match.length === 8) {
                    const id = match[4].trim();
                    problems.push({
                        id,
                        isFavorite: match[1].trim().length > 0,
                        locked: match[2].trim().length > 0,
                        state: parseProblemState(match[3]),
                        name: match[5].trim(),
                        difficulty: match[6].trim(),
                        passRate: match[7].trim(),
                        companies: companies[id] || ["Unknown"],
                        tags: tags[id] || ["Unknown"],
                    });
                }
            }
            return problems.reverse();
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to list problems. Please open the output channel for details.", uiUtils_1.DialogType.error);
            return [];
        }
    });
}
exports.listProblems = listProblems;
function parseProblemState(stateOutput) {
    if (!stateOutput) {
        return shared_1.ProblemState.Unknown;
    }
    switch (stateOutput.trim()) {
        case "v":
        case "✔":
        case "√":
            return shared_1.ProblemState.AC;
        case "X":
        case "✘":
        case "×":
            return shared_1.ProblemState.NotAC;
        default:
            return shared_1.ProblemState.Unknown;
    }
}
//# sourceMappingURL=list.js.map