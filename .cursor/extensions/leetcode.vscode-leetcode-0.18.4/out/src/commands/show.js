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
exports.showSolution = exports.searchProblem = exports.showProblem = exports.pickOne = exports.previewProblem = void 0;
const _ = require("lodash");
const path = require("path");
const unescapeJS = require("unescape-js");
const vscode = require("vscode");
const explorerNodeManager_1 = require("../explorer/explorerNodeManager");
const LeetCodeNode_1 = require("../explorer/LeetCodeNode");
const leetCodeChannel_1 = require("../leetCodeChannel");
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const leetCodeManager_1 = require("../leetCodeManager");
const shared_1 = require("../shared");
const problemUtils_1 = require("../utils/problemUtils");
const settingUtils = require("../utils/settingUtils");
const uiUtils_1 = require("../utils/uiUtils");
const workspaceUtils_1 = require("../utils/workspaceUtils");
const wsl = require("../utils/wslUtils");
const leetCodePreviewProvider_1 = require("../webview/leetCodePreviewProvider");
const leetCodeSolutionProvider_1 = require("../webview/leetCodeSolutionProvider");
const list = require("./list");
const plugin_1 = require("./plugin");
const globalState_1 = require("../globalState");
function previewProblem(input, isSideMode = false) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let node;
        if (input instanceof vscode.Uri) {
            const activeFilePath = input.fsPath;
            const id = yield problemUtils_1.getNodeIdFromFile(activeFilePath);
            if (!id) {
                vscode.window.showErrorMessage(`Failed to resolve the problem id from file: ${activeFilePath}.`);
                return;
            }
            const cachedNode = explorerNodeManager_1.explorerNodeManager.getNodeById(id);
            if (!cachedNode) {
                vscode.window.showErrorMessage(`Failed to resolve the problem with id: ${id}.`);
                return;
            }
            node = cachedNode;
            // Move the preview page aside if it's triggered from Code Lens
            isSideMode = true;
        }
        else {
            node = input;
            const { isPremium } = (_a = globalState_1.globalState.getUserStatus()) !== null && _a !== void 0 ? _a : {};
            if (input.locked && !isPremium) {
                const url = plugin_1.getLeetCodeEndpoint() === shared_1.Endpoint.LeetCode ? shared_1.PREMIUM_URL_GLOBAL : shared_1.PREMIUM_URL_CN;
                uiUtils_1.openUrl(url);
                return;
            }
        }
        const needTranslation = settingUtils.shouldUseEndpointTranslation();
        const descString = yield leetCodeExecutor_1.leetCodeExecutor.getDescription(node.id, needTranslation);
        leetCodePreviewProvider_1.leetCodePreviewProvider.show(descString, node, isSideMode);
    });
}
exports.previewProblem = previewProblem;
function pickOne() {
    return __awaiter(this, void 0, void 0, function* () {
        const problems = yield list.listProblems();
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        yield showProblemInternal(randomProblem);
    });
}
exports.pickOne = pickOne;
function showProblem(node) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!node) {
            return;
        }
        yield showProblemInternal(node);
    });
}
exports.showProblem = showProblem;
function searchProblem() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!leetCodeManager_1.leetCodeManager.getUser()) {
            uiUtils_1.promptForSignIn();
            return;
        }
        const choice = yield vscode.window.showQuickPick(parseProblemsToPicks(list.listProblems()), {
            matchOnDetail: true,
            placeHolder: "Select one problem",
        });
        if (!choice) {
            return;
        }
        yield showProblemInternal(choice.value);
    });
}
exports.searchProblem = searchProblem;
function showSolution(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let problemInput;
        if (input instanceof LeetCodeNode_1.LeetCodeNode) {
            // Triggerred from explorer
            problemInput = input.id;
        }
        else if (input instanceof vscode.Uri) {
            // Triggerred from Code Lens/context menu
            problemInput = `"${input.fsPath}"`;
        }
        else if (!input) {
            // Triggerred from command
            problemInput = yield workspaceUtils_1.getActiveFilePath();
        }
        if (!problemInput) {
            vscode.window.showErrorMessage("Invalid input to fetch the solution data.");
            return;
        }
        const language = yield fetchProblemLanguage();
        if (!language) {
            return;
        }
        try {
            const needTranslation = settingUtils.shouldUseEndpointTranslation();
            const solution = yield leetCodeExecutor_1.leetCodeExecutor.showSolution(problemInput, language, needTranslation);
            leetCodeSolutionProvider_1.leetCodeSolutionProvider.show(unescapeJS(solution));
        }
        catch (error) {
            leetCodeChannel_1.leetCodeChannel.appendLine(error.toString());
            yield uiUtils_1.promptForOpenOutputChannel("Failed to fetch the top voted solution. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.showSolution = showSolution;
function fetchProblemLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        const leetCodeConfig = vscode.workspace.getConfiguration("leetcode");
        let defaultLanguage = leetCodeConfig.get("defaultLanguage");
        if (defaultLanguage && shared_1.languages.indexOf(defaultLanguage) < 0) {
            defaultLanguage = undefined;
        }
        const language = defaultLanguage ||
            (yield vscode.window.showQuickPick(shared_1.languages, {
                placeHolder: "Select the language you want to use",
                ignoreFocusOut: true,
            }));
        // fire-and-forget default language query
        (() => __awaiter(this, void 0, void 0, function* () {
            if (language && !defaultLanguage && leetCodeConfig.get("hint.setDefaultLanguage")) {
                const choice = yield vscode.window.showInformationMessage(`Would you like to set '${language}' as your default language?`, uiUtils_1.DialogOptions.yes, uiUtils_1.DialogOptions.no, uiUtils_1.DialogOptions.never);
                if (choice === uiUtils_1.DialogOptions.yes) {
                    leetCodeConfig.update("defaultLanguage", language, true /* UserSetting */);
                }
                else if (choice === uiUtils_1.DialogOptions.never) {
                    leetCodeConfig.update("hint.setDefaultLanguage", false, true /* UserSetting */);
                }
            }
        }))();
        return language;
    });
}
function showProblemInternal(node) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const language = yield fetchProblemLanguage();
            if (!language) {
                return;
            }
            const leetCodeConfig = vscode.workspace.getConfiguration("leetcode");
            const workspaceFolder = yield workspaceUtils_1.selectWorkspaceFolder();
            if (!workspaceFolder) {
                return;
            }
            const fileFolder = leetCodeConfig
                .get(`filePath.${language}.folder`, leetCodeConfig.get(`filePath.default.folder`, ""))
                .trim();
            const fileName = leetCodeConfig
                .get(`filePath.${language}.filename`, leetCodeConfig.get(`filePath.default.filename`) || problemUtils_1.genFileName(node, language))
                .trim();
            let finalPath = path.join(workspaceFolder, fileFolder, fileName);
            if (finalPath) {
                finalPath = yield resolveRelativePath(finalPath, node, language);
                if (!finalPath) {
                    leetCodeChannel_1.leetCodeChannel.appendLine("Showing problem canceled by user.");
                    return;
                }
            }
            finalPath = wsl.useWsl() ? yield wsl.toWinPath(finalPath) : finalPath;
            const descriptionConfig = settingUtils.getDescriptionConfiguration();
            const needTranslation = settingUtils.shouldUseEndpointTranslation();
            yield leetCodeExecutor_1.leetCodeExecutor.showProblem(node, language, finalPath, descriptionConfig.showInComment, needTranslation);
            const promises = [
                vscode.window.showTextDocument(vscode.Uri.file(finalPath), {
                    preview: false,
                    viewColumn: vscode.ViewColumn.One,
                }),
                uiUtils_1.promptHintMessage("hint.commentDescription", 'You can config how to show the problem description through "leetcode.showDescription".', "Open settings", () => uiUtils_1.openSettingsEditor("leetcode.showDescription")),
            ];
            if (descriptionConfig.showInWebview) {
                promises.push(showDescriptionView(node));
            }
            yield Promise.all(promises);
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel(`${error} Please open the output channel for details.`, uiUtils_1.DialogType.error);
        }
    });
}
function showDescriptionView(node) {
    return __awaiter(this, void 0, void 0, function* () {
        return previewProblem(node, vscode.workspace.getConfiguration("leetcode").get("enableSideMode", true));
    });
}
function parseProblemsToPicks(p) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const picks = (yield p).map((problem) => Object.assign({}, {
                label: `${parseProblemDecorator(problem.state, problem.locked)}${problem.id}.${problem.name}`,
                description: "",
                detail: `AC rate: ${problem.passRate}, Difficulty: ${problem.difficulty}`,
                value: problem,
            }));
            resolve(picks);
        }));
    });
}
function parseProblemDecorator(state, locked) {
    switch (state) {
        case shared_1.ProblemState.AC:
            return "$(check) ";
        case shared_1.ProblemState.NotAC:
            return "$(x) ";
        default:
            return locked ? "$(lock) " : "";
    }
}
function resolveRelativePath(relativePath, node, selectedLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = "";
        if (/\$\{tag\}/i.test(relativePath)) {
            tag = (yield resolveTagForProblem(node)) || "";
        }
        let company = "";
        if (/\$\{company\}/i.test(relativePath)) {
            company = (yield resolveCompanyForProblem(node)) || "";
        }
        return relativePath.replace(/\$\{(.*?)\}/g, (_substring, ...args) => {
            const placeholder = args[0].toLowerCase().trim();
            switch (placeholder) {
                case "id":
                    return node.id;
                case "name":
                    return node.name;
                case "camelcasename":
                    return _.camelCase(node.name);
                case "pascalcasename":
                    return _.upperFirst(_.camelCase(node.name));
                case "kebabcasename":
                case "kebab-case-name":
                    return _.kebabCase(node.name);
                case "snakecasename":
                case "snake_case_name":
                    return _.snakeCase(node.name);
                case "ext":
                    return problemUtils_1.genFileExt(selectedLanguage);
                case "language":
                    return selectedLanguage;
                case "difficulty":
                    return node.difficulty.toLocaleLowerCase();
                case "tag":
                    return tag;
                case "company":
                    return company;
                default:
                    const errorMsg = `The config '${placeholder}' is not supported.`;
                    leetCodeChannel_1.leetCodeChannel.appendLine(errorMsg);
                    throw new Error(errorMsg);
            }
        });
    });
}
function resolveTagForProblem(problem) {
    return __awaiter(this, void 0, void 0, function* () {
        if (problem.tags.length === 1) {
            return problem.tags[0];
        }
        return yield vscode.window.showQuickPick(problem.tags, {
            matchOnDetail: true,
            placeHolder: "Multiple tags available, please select one",
            ignoreFocusOut: true,
        });
    });
}
function resolveCompanyForProblem(problem) {
    return __awaiter(this, void 0, void 0, function* () {
        if (problem.companies.length === 1) {
            return problem.companies[0];
        }
        return yield vscode.window.showQuickPick(problem.companies, {
            matchOnDetail: true,
            placeHolder: "Multiple tags available, please select one",
            ignoreFocusOut: true,
        });
    });
}
//# sourceMappingURL=show.js.map