"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInFullScreenMode = exports.isInZenMode = exports.showNormalScreenMode = exports.showFullScreenMode = exports.showZenMode = exports.getConfiguredScreenMode = exports.FULL_SCREEN_MODE_ID = exports.ZEN_MODE_ID = exports.NORMAL_SCREEN_MODE = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
exports.NORMAL_SCREEN_MODE = 0;
exports.ZEN_MODE_ID = 1;
exports.FULL_SCREEN_MODE_ID = 2;
let preferredScreenMode = 0;
let currentModeId = 0;
async function getConfiguredScreenMode() {
    const preferences = await (0, DataController_1.getUserPreferences)();
    const flowModeSettings = preferences?.flowMode || {};
    const screenMode = flowModeSettings?.editor?.vscode?.screenMode;
    if (screenMode?.includes("Full Screen")) {
        preferredScreenMode = exports.FULL_SCREEN_MODE_ID;
    }
    else if (screenMode?.includes("Zen")) {
        preferredScreenMode = exports.ZEN_MODE_ID;
    }
    else {
        preferredScreenMode = exports.NORMAL_SCREEN_MODE;
    }
    return preferredScreenMode;
}
exports.getConfiguredScreenMode = getConfiguredScreenMode;
function showZenMode() {
    if (currentModeId !== exports.ZEN_MODE_ID) {
        currentModeId = exports.ZEN_MODE_ID;
        vscode_1.commands.executeCommand("workbench.action.toggleZenMode");
    }
}
exports.showZenMode = showZenMode;
function showFullScreenMode() {
    if (currentModeId !== exports.FULL_SCREEN_MODE_ID) {
        vscode_1.commands.executeCommand("workbench.action.toggleFullScreen");
        currentModeId = exports.FULL_SCREEN_MODE_ID;
    }
}
exports.showFullScreenMode = showFullScreenMode;
function showNormalScreenMode() {
    if (currentModeId !== exports.NORMAL_SCREEN_MODE) {
        if (currentModeId === exports.FULL_SCREEN_MODE_ID) {
            currentModeId = exports.NORMAL_SCREEN_MODE;
            vscode_1.commands.executeCommand("workbench.action.toggleFullScreen");
        }
        else if (currentModeId === exports.ZEN_MODE_ID) {
            currentModeId = exports.NORMAL_SCREEN_MODE;
            vscode_1.commands.executeCommand("workbench.action.toggleZenMode");
        }
    }
}
exports.showNormalScreenMode = showNormalScreenMode;
function isInZenMode() {
    return !!(currentModeId === exports.ZEN_MODE_ID);
}
exports.isInZenMode = isInZenMode;
function isInFullScreenMode() {
    return !!(currentModeId === exports.FULL_SCREEN_MODE_ID);
}
exports.isInFullScreenMode = isInFullScreenMode;
//# sourceMappingURL=ScreenManager.js.map