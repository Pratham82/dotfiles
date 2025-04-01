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
exports.provider = void 0;
exports.action = action;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
/**
 * Each number corresponds to the warning number of ChkTeX.
 */
const CODE_TO_ACTION_STRING = {
    1: 'Terminate command with empty statement',
    2: 'Convert to non-breaking space (~)',
    4: 'Remove italic correction \\/ (not in italic buffer)',
    5: 'Remove extraneous italic correction(s)',
    6: 'Add italic correction (\\/)',
    11: 'Fix ellipsis',
    12: 'Add interword space (\\ )',
    13: 'Add intersentence space (\\@)',
    18: "Replace with ` or '",
    32: 'Replace with `',
    33: "Replace with '",
    24: 'Remove extraneous space',
    28: 'Remove incorrect \\/',
    26: 'Remove extraneous space',
    34: "Replace with ` or '",
    35: 'Use suggested alternative',
    39: 'Remove extraneous space',
    42: 'Remove extraneous space',
    45: 'Use \\[ ... \\] instead of $$ ... $$',
    46: 'Use \\( ... \\) instead of $ ... $'
};
function characterBeforeRange(document, range) {
    return document.getText(range.with(range.start.translate(0, -1)))[0];
}
function isOpeningQuote(document, range) {
    return range.start.character === 0 || characterBeforeRange(document, range) === ' ';
}
class CodeActionProvider {
    // Leading underscore to avoid tslint complaint
    provideCodeActions(document, _range, context, _token) {
        const actions = [];
        context.diagnostics.filter(d => d.source === 'ChkTeX').forEach(d => {
            let code = typeof d.code === 'object' ? d.code.value : d.code;
            if (!code) {
                return;
            }
            if (typeof code === 'string') {
                code = parseInt(code);
            }
            const label = CODE_TO_ACTION_STRING[code];
            if (label !== undefined) {
                actions.push({
                    title: label,
                    command: 'latex-workshop.code-action',
                    arguments: [document, d.range, d.code, d.message]
                });
            }
        });
        return actions;
    }
}
const provider = new CodeActionProvider();
exports.provider = provider;
function action(document, range, code, message) {
    let fixString;
    let regexResult;
    switch (code) {
        case 24:
        case 26:
        case 39:
        case 42:
            // In all these cases remove all proceeding whitespace.
            void replaceWhitespaceOnLineBefore(document, range.end, '');
            break;
        case 4:
        case 5:
        case 28:
            // In all these cases just clear what ChkTeX highlighted.
            void replaceRangeWithString(document, range, '');
            break;
        case 1:
            void replaceWhitespaceOnLineBefore(document, range.end.translate(0, -1), '{}');
            break;
        case 2:
            void replaceWhitespaceOnLineBefore(document, range.end, '~');
            break;
        case 6:
            void replaceWhitespaceOnLineBefore(document, range.end.translate(0, -1), '\\/');
            break;
        case 11:
            // add a space after so we don't accidentally join with the following word.
            regexResult = /\\[cl]?dots/.exec(message);
            if (!regexResult) {
                break;
            }
            fixString = regexResult[0] + ' ';
            void replaceRangeWithString(document, range, fixString);
            break;
        case 12:
            void replaceRangeWithString(document, range, '\\ ');
            break;
        case 13:
            void replaceWhitespaceOnLineBefore(document, range.end.translate(0, -1), '\\@');
            break;
        case 18:
            if (isOpeningQuote(document, range)) {
                void replaceRangeWithRepeatedString(document, range, '``');
            }
            else {
                void replaceRangeWithRepeatedString(document, range, "''");
            }
            break;
        case 32:
            void replaceRangeWithRepeatedString(document, range, '`');
            break;
        case 33:
            void replaceRangeWithRepeatedString(document, range, "'");
            break;
        case 34:
            if (isOpeningQuote(document, range)) {
                void replaceRangeWithRepeatedString(document, range, '`');
            }
            else {
                void replaceRangeWithRepeatedString(document, range, "'");
            }
            break;
        case 35:
            regexResult = /`(.+)'/.exec(message);
            if (!regexResult) {
                break;
            }
            fixString = regexResult[1];
            void replaceRangeWithString(document, range, fixString);
            break;
        case 45:
            void replaceMathDelimitersInRange(document, range, '$$', '\\[', '\\]');
            break;
        case 46:
            void replaceMathDelimitersInRange(document, range, '$', '\\(', '\\)');
            break;
        default:
            break;
    }
}
function replaceWhitespaceOnLineBefore(document, position, replaceWith) {
    const beforePosRange = new vscode.Range(new vscode.Position(position.line, 0), position);
    const text = document.getText(beforePosRange);
    const regexResult = /\s*$/.exec(text);
    if (!regexResult) {
        return vscode.workspace.applyEdit(new vscode.WorkspaceEdit());
    }
    const charactersToRemove = regexResult[0].length;
    const wsRange = new vscode.Range(new vscode.Position(position.line, position.character - charactersToRemove), position);
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, wsRange, replaceWith);
    return vscode.workspace.applyEdit(edit);
}
function replaceRangeWithString(document, range, replacementString) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, replacementString);
    return vscode.workspace.applyEdit(edit);
}
function replaceRangeWithRepeatedString(document, range, replacementString) {
    return replaceRangeWithString(document, range, replacementString.repeat(range.end.character - range.start.character));
}
function replaceMathDelimitersInRange(document, range, oldDelim, startDelim, endDelim) {
    const oldDelimLength = oldDelim.length;
    let endRange = range.with(range.end.translate(0, -oldDelimLength), range.end);
    const text = document.getText(endRange);
    // Check if the end position really contains the end delimiter.
    // This is not the case when the opening and closing delimiters are on different lines
    if (text !== oldDelim) {
        if (oldDelim === '$$') {
            const pat = /(?<!\\)\$\$/;
            const endPos = lw_1.lw.parser.find.endPair(document, pat, endRange.start);
            if (!endPos) {
                return;
            }
            endRange = new vscode.Range(endPos.translate(0, -oldDelimLength), endPos);
        }
        else {
            return;
        }
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, endRange, endDelim);
    const startRange = range.with(range.start, range.start.translate(0, oldDelimLength));
    edit.replace(document.uri, startRange, startDelim);
    return vscode.workspace.applyEdit(edit);
}
//# sourceMappingURL=latex-code-actions.js.map