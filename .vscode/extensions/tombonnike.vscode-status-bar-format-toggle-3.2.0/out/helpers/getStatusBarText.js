"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusBarText = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const getFormattingStatus_1 = __importDefault(require("./getFormattingStatus"));
const getStatusBarText = () => {
    const isFormattingActivated = (0, getFormattingStatus_1.default)();
    const configuration = vscode_1.workspace.getConfiguration();
    const { formattingEnabled: enabledText, formattingDisabled: disabledText } = configuration.get('formattingToggle.statusBarText', constants_1.DEFAULT_STATUS_BAR_TEXT_CONFIGURATION);
    return isFormattingActivated ? enabledText : disabledText;
};
exports.getStatusBarText = getStatusBarText;
exports.default = exports.getStatusBarText;
