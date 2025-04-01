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
exports.section = section;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const utils_1 = require("../utils/utils");
const logger = lw_1.lw.log('Section');
const levels = ['part', 'chapter', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph'];
const upperLevels = Object.create(null);
const lowerLevels = Object.create(null);
for (let i = 0; i < levels.length; i++) {
    const current = levels[i];
    const upper = levels[Math.max(i - 1, 0)];
    const lower = levels[Math.min(i + 1, levels.length - 1)];
    upperLevels[current] = upper;
    lowerLevels[current] = lower;
}
function section(action) {
    if (action === 'select') {
        selectSection();
    }
    else {
        shiftSection(action);
    }
}
/**
 * Shift the level sectioning in the selection by one (up or down)
 * @param change 'promote' or 'demote'
 */
function shiftSection(change) {
    logger.log(`Calling shiftSectioningLevel with parameter: ${change}`);
    if (change !== 'promote' && change !== 'demote') {
        throw TypeError(`Invalid value of function parameter 'change' (=${change})`);
    }
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }
    const replacer = (_match, sectionName, asterisk, options, contents) => {
        if (change === 'promote') {
            return '\\' + upperLevels[sectionName] + (asterisk ?? '') + (options ?? '') + contents;
        }
        else {
            // if (change === 'demote')
            return '\\' + lowerLevels[sectionName] + (asterisk ?? '') + (options ?? '') + contents;
        }
    };
    // when supported, negative lookbehind at start would be nice --- (?<!\\)
    const pattern = '\\\\(' + levels.join('|') + ')(\\*)?(\\[.+?\\])?(\\{.*?\\})';
    const regex = new RegExp(pattern, 'g');
    function getLastLineLength(someText) {
        const lines = someText.split(/\n/);
        return lines.slice(lines.length - 1, lines.length)[0].length;
    }
    const document = editor.document;
    const selections = editor.selections;
    const newSelections = [];
    const edit = new vscode.WorkspaceEdit();
    for (let selection of selections) {
        let mode = 'selection';
        let oldSelection = null;
        if (selection.isEmpty) {
            mode = 'cursor';
            oldSelection = selection;
            const line = document.lineAt(selection.anchor);
            selection = new vscode.Selection(line.range.start, line.range.end);
        }
        const selectionText = document.getText(selection);
        const newText = selectionText.replace(regex, replacer);
        edit.replace(document.uri, selection, newText);
        const changeInEndCharacterPosition = getLastLineLength(newText) - getLastLineLength(selectionText);
        if (mode === 'selection') {
            newSelections.push(new vscode.Selection(selection.start, new vscode.Position(selection.end.line, selection.end.character + changeInEndCharacterPosition)));
        }
        else if (oldSelection) { // mode === 'cursor'
            const anchorPosition = oldSelection.anchor.character + changeInEndCharacterPosition;
            const activePosition = oldSelection.active.character + changeInEndCharacterPosition;
            newSelections.push(new vscode.Selection(new vscode.Position(oldSelection.anchor.line, anchorPosition < 0 ? 0 : anchorPosition), new vscode.Position(oldSelection.active.line, activePosition < 0 ? 0 : activePosition)));
        }
    }
    void vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            editor.selections = newSelections;
        }
    });
}
/**
 * Find the first sectioning macro above the current position
 *
 * @param pos the current position in the document
 * @param doc the text document
 */
function searchLevelUp(pos, doc) {
    const range = new vscode.Range(new vscode.Position(0, 0), pos.with(undefined, doc.lineAt(pos.line).range.end.character));
    const content = (0, utils_1.stripCommentsAndVerbatim)(doc.getText(range)).split('\n');
    const pattern = '\\\\(' + levels.join('|') + ')\\*?(?:\\[.+?\\])?\\{.*?\\}';
    const regex = new RegExp(pattern);
    for (let i = pos.line; i >= 0; i -= 1) {
        const res = content[i].match(regex);
        if (res) {
            return { level: res[1], pos: new vscode.Position(i, 0) };
        }
    }
    return;
}
/**
 * Find the first sectioning macro below the current position.
 * Stop at \appendix or \end{document}
 *
 * @param levels the list of sectioning macros
 * @param pos the current position in the document
 * @param doc the text document
 */
function searchLevelDown(remainlevels, pos, doc) {
    const range = new vscode.Range(pos, new vscode.Position(doc.lineCount, 0));
    const content = (0, utils_1.stripCommentsAndVerbatim)(doc.getText(range)).split('\n');
    const pattern = '\\\\(?:(' + remainlevels.join('|') + ')\\*?(?:\\[.+?\\])?\\{.*?\\})|appendix|\\\\end{document}';
    const regex = new RegExp(pattern);
    for (let i = 0; i < content.length; i += 1) {
        const res = content[i].match(regex);
        if (res) {
            return new vscode.Position(i + pos.line - 1, Math.max(content[i - 1].length - 1, 0));
        }
    }
    // Return the end of file position
    return new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length - 1);
}
function selectSection() {
    logger.log('Calling selectSection.');
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }
    const beginLevel = searchLevelUp(editor.selection.anchor, editor.document);
    if (!beginLevel) {
        logger.log('Cannot find any section macro above current line.');
        return;
    }
    const levelIndex = levels.indexOf(beginLevel.level);
    const endPosition = searchLevelDown(levels.slice(0, levelIndex + 1), editor.selection.end, editor.document);
    editor.selection = new vscode.Selection(beginLevel.pos, endPosition);
}
//# sourceMappingURL=section.js.map