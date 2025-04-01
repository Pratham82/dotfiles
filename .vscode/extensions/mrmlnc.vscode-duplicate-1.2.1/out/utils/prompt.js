"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
function name(filename) {
    return vscode.window.showInputBox({
        placeHolder: 'Enter the new path for the duplicate.',
        value: filename.split('.').map(function (el, i) { return i === 0 ? el + "-copy" : el; }).join('.')
    });
}
exports.name = name;
function overwrite(filepath) {
    var message = "The path **" + filepath + "** alredy exists. Do you want to overwrite the existing path?";
    var action = {
        title: 'OK',
        isCloseAffordance: false
    };
    return vscode.window.showWarningMessage(message, action);
}
exports.overwrite = overwrite;
