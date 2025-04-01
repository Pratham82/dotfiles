"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizer = tokenizer;
exports.onAPackage = onAPackage;
const vscode = __importStar(require("vscode"));
const utils = __importStar(require("./utils"));
/**
 * If the string at `position` is a latex command, e.g., `\macro`, `\macro{` or `\macro[`,
 * return the range of the command string (`\macro`).
 *
 * @param document The document to be scanned.
 * @param position The position to be scanned at.
 */
function macroTokenizer(document, position) {
    let startRegex;
    if (document.languageId === 'latex-expl3') {
        startRegex = /\\(?=[^\\{},[\]]*$)/;
    }
    else {
        startRegex = /\\(?=[a-zA-Z]*$)/;
    }
    const startResult = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position)).match(startRegex);
    if (startResult === null || startResult.index === undefined || startResult.index < 0) {
        return;
    }
    const firstBracket = document.getText(new vscode.Range(position, new vscode.Position(position.line, 65535))).match(/[[{]/);
    if (firstBracket && firstBracket.index !== undefined && firstBracket.index > 0) {
        return new vscode.Range(new vscode.Position(position.line, startResult.index), new vscode.Position(position.line, position.character + firstBracket.index));
    }
    const wordRange = document.getWordRangeAtPosition(position);
    if (wordRange) {
        return wordRange.with(new vscode.Position(position.line, startResult.index));
    }
    return;
}
/**
 * If the string at `position` is surround by `{...}` or `[...]`,
 * return the range for the argument at `position` inside the brackets.
 *
 * @param document The document to be scanned.
 * @param position The position to be scanned at.
 */
function argTokenizer(document, position) {
    const startResult = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position)).match(/[{,[](?=[^{},[\]]*$)/);
    if (startResult === null || startResult.index === undefined || startResult.index < 0) {
        return;
    }
    const endResult = document.getText(new vscode.Range(position, new vscode.Position(position.line, 65535))).match(/[}\],]/);
    if (endResult === null || endResult.index === undefined || endResult.index < 0) {
        return;
    }
    return new vscode.Range(new vscode.Position(position.line, startResult.index + 1), new vscode.Position(position.line, position.character + endResult.index));
}
/**
 * If the string at `position` is like `\macro{` or `\macro[`, then
 * returns the range for `\macro`. If it is like `{...}` or `[...]`, then
 * returns the range the argument inside brackets.
 *
 * @param document The document to be scanned.
 * @param position The position to be scanned at.
 */
function tokenizer(document, position) {
    // \macro case
    const macroToken = macroTokenizer(document, position);
    if (macroToken) {
        return macroToken;
    }
    // Inside {...} or [...]
    const argToken = argTokenizer(document, position);
    if (argToken) {
        return argToken;
    }
    return;
}
/**
 * Return `true` if the `position` of the `document` is on a macro `\usepackage{...}` including
 * `token`
 * @param document The document to be scanned.
 * @param position The position to be scanned at.
 * @param token The name of package.
 */
function onAPackage(document, position, token) {
    const line = document.lineAt(position.line).text;
    const escapedToken = utils.escapeRegExp(token);
    const regex = new RegExp(`\\\\usepackage(?:\\[[^\\[\\]\\{\\}]*\\])?\\{[\\w,]*${escapedToken}[\\w,]*\\}`);
    if (line.match(regex)) {
        return true;
    }
    return false;
}
//# sourceMappingURL=tokenizer.js.map