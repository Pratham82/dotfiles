"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDescriptionConfiguration = exports.shouldUseEndpointTranslation = exports.hasStarShortcut = exports.getEditorShortcuts = exports.getWorkspaceFolder = exports.shouldHideSolvedProblem = exports.getWorkspaceConfiguration = void 0;
const vscode_1 = require("vscode");
const shared_1 = require("../shared");
function getWorkspaceConfiguration() {
    return vscode_1.workspace.getConfiguration("leetcode");
}
exports.getWorkspaceConfiguration = getWorkspaceConfiguration;
function shouldHideSolvedProblem() {
    return getWorkspaceConfiguration().get("hideSolved", false);
}
exports.shouldHideSolvedProblem = shouldHideSolvedProblem;
function getWorkspaceFolder() {
    return getWorkspaceConfiguration().get("workspaceFolder", "");
}
exports.getWorkspaceFolder = getWorkspaceFolder;
function getEditorShortcuts() {
    return getWorkspaceConfiguration().get("editor.shortcuts", ["submit", "test"]);
}
exports.getEditorShortcuts = getEditorShortcuts;
function hasStarShortcut() {
    const shortcuts = getWorkspaceConfiguration().get("editor.shortcuts", ["submit", "test"]);
    return shortcuts.indexOf("star") >= 0;
}
exports.hasStarShortcut = hasStarShortcut;
function shouldUseEndpointTranslation() {
    return getWorkspaceConfiguration().get("useEndpointTranslation", true);
}
exports.shouldUseEndpointTranslation = shouldUseEndpointTranslation;
function getDescriptionConfiguration() {
    const setting = getWorkspaceConfiguration().get("showDescription", shared_1.DescriptionConfiguration.InWebView);
    const config = {
        showInComment: false,
        showInWebview: true,
    };
    switch (setting) {
        case shared_1.DescriptionConfiguration.Both:
            config.showInComment = true;
            config.showInWebview = true;
            break;
        case shared_1.DescriptionConfiguration.None:
            config.showInComment = false;
            config.showInWebview = false;
            break;
        case shared_1.DescriptionConfiguration.InFileComment:
            config.showInComment = true;
            config.showInWebview = false;
            break;
        case shared_1.DescriptionConfiguration.InWebView:
            config.showInComment = false;
            config.showInWebview = true;
            break;
    }
    // To be compatible with the deprecated setting:
    if (getWorkspaceConfiguration().get("showCommentDescription")) {
        config.showInComment = true;
    }
    return config;
}
exports.getDescriptionConfiguration = getDescriptionConfiguration;
//# sourceMappingURL=settingUtils.js.map