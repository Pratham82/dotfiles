"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var escapeRegExp = require("lodash.escaperegexp");
var vscode = require("vscode");
var filepaths = require("./managers/filepaths");
var promptUtils = require("./utils/prompt");
/**
 * Open file after duplicate action.
 */
function openFile(filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var document;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.workspace.openTextDocument(filepath)];
                case 1:
                    document = _a.sent();
                    return [2 /*return*/, vscode.window.showTextDocument(document)];
            }
        });
    });
}
/**
 * Duplicate action.
 */
function duplicator(uri, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var oldPath, oldPathParsed, oldPathStats, newName, newPath, newPathExists, userAnswer, err_1, errMsgRegExp, errMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oldPath = uri.fsPath;
                    oldPathParsed = path.parse(oldPath);
                    return [4 /*yield*/, fs.stat(oldPath)];
                case 1:
                    oldPathStats = _a.sent();
                    return [4 /*yield*/, promptUtils.name(oldPathParsed.name)];
                case 2:
                    newName = _a.sent();
                    if (!newName) {
                        return [2 /*return*/];
                    }
                    newPath = filepaths.buildFilepath(oldPathParsed, oldPathStats, newName, settings);
                    // If a user tries to copy a file on the same path
                    if (uri.fsPath === newPath) {
                        vscode.window.showErrorMessage('You can\'t copy a file or directory on the same path.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fs.pathExists(newPath)];
                case 3:
                    newPathExists = _a.sent();
                    if (!newPathExists) return [3 /*break*/, 5];
                    return [4 /*yield*/, promptUtils.overwrite(newPath)];
                case 4:
                    userAnswer = _a.sent();
                    if (!userAnswer) {
                        return [2 /*return*/];
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs.copy(uri.fsPath, newPath)];
                case 6:
                    _a.sent();
                    if (settings.openFileAfterCopy && oldPathStats.isFile()) {
                        return [2 /*return*/, openFile(newPath)];
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    errMsgRegExp = new RegExp(escapeRegExp(oldPathParsed.dir), 'g');
                    errMsg = err_1.message
                        .replace(errMsgRegExp, '')
                        .replace(/[\\|\/]/g, '')
                        .replace(/`|'/g, '**');
                    vscode.window.showErrorMessage("Error: " + errMsg);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function activate(context) {
    var command = vscode.commands.registerCommand('duplicate.execute', function (uri) {
        var settings = vscode.workspace.getConfiguration().get('duplicate');
        if (!uri || !uri.fsPath) {
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            return duplicator(editor.document.uri, settings);
        }
        return duplicator(uri, settings);
    });
    context.subscriptions.push(command);
}
exports.activate = activate;
