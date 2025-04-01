"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
const getFormattingStatus_1 = __importDefault(require("./helpers/getFormattingStatus"));
const registerCommand = () => vscode_1.commands.registerCommand(constants_1.COMMAND_NAME, () => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = vscode_1.workspace.getConfiguration();
    const affectsConfiguration = configuration.get('formattingToggle.affects', constants_1.DEFAULT_AFFECTS_CONFIGURATION);
    const isFormattingActivated = (0, getFormattingStatus_1.default)();
    // Updating the configuration will trigger the `onDidChangeConfiguration`
    // handler which will correctly update the text and icon in the status bar.
    for (const setting of affectsConfiguration) {
        if (!setting.startsWith(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH)) {
            yield configuration.update(setting, !isFormattingActivated, vscode_1.ConfigurationTarget.Global);
        }
        else {
            const codeActionsOnSaveConfiguration = vscode_1.workspace.getConfiguration(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH);
            const codeActionsOnSaveSetting = setting.split(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH + '.').at(-1) || '';
            const newCodeActionsOnSaveConfiguration = Object.assign(Object.assign({}, codeActionsOnSaveConfiguration), { [codeActionsOnSaveSetting]: !isFormattingActivated });
            yield configuration.update(constants_1.EDITOR_CODE_ACTIONS_ON_SAVE_PATH, newCodeActionsOnSaveConfiguration, vscode_1.ConfigurationTarget.Global);
        }
    }
}));
exports.default = registerCommand;
