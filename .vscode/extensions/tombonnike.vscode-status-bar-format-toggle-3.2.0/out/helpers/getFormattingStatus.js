"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const getFormattingStatus = () => {
    const configuration = vscode_1.workspace.getConfiguration();
    const affectsConfiguration = configuration.get('formattingToggle.affects', constants_1.DEFAULT_AFFECTS_CONFIGURATION);
    const isAnyRelevantSettingActivated = affectsConfiguration.some(setting => {
        if (!setting.startsWith(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH)) {
            const isSettingActivated = configuration.get(setting, false);
            return isSettingActivated;
        }
        const codeActionsOnSaveConfiguration = vscode_1.workspace.getConfiguration(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH);
        const codeActionsOnSaveSetting = setting.split(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH + '.').at(-1) || '';
        const isCodeActionsOnSaveSettingActivated = Boolean(codeActionsOnSaveConfiguration[codeActionsOnSaveSetting]);
        return isCodeActionsOnSaveSettingActivated;
    });
    return isAnyRelevantSettingActivated;
};
exports.default = getFormattingStatus;
