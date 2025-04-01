"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const registerCommand_1 = __importDefault(require("./registerCommand"));
const createStatusBarItem_1 = __importDefault(require("./createStatusBarItem"));
const getStatusBarText_1 = __importDefault(require("./helpers/getStatusBarText"));
function activate({ subscriptions }) {
    const command = (0, registerCommand_1.default)();
    const statusBarItem = (0, createStatusBarItem_1.default)();
    const configurationChangeListener = vscode_1.workspace.onDidChangeConfiguration(() => {
        statusBarItem.text = (0, getStatusBarText_1.default)();
    });
    subscriptions.push(statusBarItem);
    subscriptions.push(command);
    subscriptions.push(configurationChangeListener);
}
exports.activate = activate;
