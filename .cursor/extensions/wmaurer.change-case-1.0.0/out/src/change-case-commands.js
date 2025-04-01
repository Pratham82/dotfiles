"use strict";
const vscode = require('vscode');
const os_1 = require('os');
const changeCase = require('change-case');
const lodashUniq = require('lodash.uniq');
const lodashRange = require('lodash.range');
exports.COMMAND_LABELS = {
    camel: 'camel',
    constant: 'constant',
    dot: 'dot',
    kebab: 'kebab',
    lower: 'lower',
    lowerFirst: 'lowerFirst',
    no: 'no',
    param: 'param',
    pascal: 'pascal',
    path: 'path',
    sentence: 'sentence',
    snake: 'snake',
    swap: 'swap',
    title: 'title',
    upper: 'upper',
    upperFirst: 'upperFirst'
};
const COMMAND_DEFINITIONS = [
    { label: exports.COMMAND_LABELS.camel, description: 'Convert to a string with the separators denoted by having the next letter capitalised', func: changeCase.camel },
    { label: exports.COMMAND_LABELS.constant, description: 'Convert to an upper case, underscore separated string', func: changeCase.constant },
    { label: exports.COMMAND_LABELS.dot, description: 'Convert to a lower case, period separated string', func: changeCase.dot },
    { label: exports.COMMAND_LABELS.kebab, description: 'Convert to a lower case, dash separated string (alias for param case)', func: changeCase.param },
    { label: exports.COMMAND_LABELS.lower, description: 'Convert to a string in lower case', func: changeCase.lower },
    { label: exports.COMMAND_LABELS.lowerFirst, description: 'Convert to a string with the first character lower cased', func: changeCase.lcFirst },
    { label: exports.COMMAND_LABELS.no, description: 'Convert the string without any casing (lower case, space separated)', func: changeCase.no },
    { label: exports.COMMAND_LABELS.param, description: 'Convert to a lower case, dash separated string', func: changeCase.param },
    { label: exports.COMMAND_LABELS.pascal, description: 'Convert to a string denoted in the same fashion as camelCase, but with the first letter also capitalised', func: changeCase.pascal },
    { label: exports.COMMAND_LABELS.path, description: 'Convert to a lower case, slash separated string', func: changeCase.path },
    { label: exports.COMMAND_LABELS.sentence, description: 'Convert to a lower case, space separated string', func: changeCase.sentence },
    { label: exports.COMMAND_LABELS.snake, description: 'Convert to a lower case, underscore separated string', func: changeCase.snake },
    { label: exports.COMMAND_LABELS.swap, description: 'Convert to a string with every character case reversed', func: changeCase.swap },
    { label: exports.COMMAND_LABELS.title, description: 'Convert to a space separated string with the first character of every word upper cased', func: changeCase.title },
    { label: exports.COMMAND_LABELS.upper, description: 'Convert to a string in upper case', func: changeCase.upper },
    { label: exports.COMMAND_LABELS.upperFirst, description: 'Convert to a string with the first character upper cased', func: changeCase.ucFirst }
];
function changeCaseCommands() {
    const firstSelectedText = getSelectedTextIfOnlyOneSelection();
    const opts = { matchOnDescription: true, placeHolder: 'What do you want to do to the current word / selection(s)?' };
    // if there's only one selection, show a preview of what it will look like after conversion in the QuickPickOptions,
    // otherwise use the description used in COMMAND_DEFINITIONS
    const items = COMMAND_DEFINITIONS.map(c => ({
        label: c.label,
        description: firstSelectedText ? `Convert to ${c.func(firstSelectedText)}` : c.description
    }));
    vscode.window.showQuickPick(items)
        .then(command => runCommand(command.label));
}
exports.changeCaseCommands = changeCaseCommands;
function runCommand(commandLabel) {
    const commandDefinition = COMMAND_DEFINITIONS.filter(c => c.label === commandLabel)[0];
    if (!commandDefinition)
        return;
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;
    let replacementActions = [];
    editor.edit(editBuilder => {
        replacementActions = selections.map(selection => {
            const { text, range } = getSelectedText(selection, document);
            let replacement;
            let offset;
            if (selection.isSingleLine) {
                replacement = commandDefinition.func(text);
                // it's possible that the replacement string is shorter or longer than the original,
                // so calculate the offsets and new selection coordinates appropriately
                offset = replacement.length - text.length;
            }
            else {
                const lines = document.getText(range).split(os_1.EOL);
                const replacementLines = lines.map(x => commandDefinition.func(x));
                replacement = replacementLines.reduce((acc, v) => (!acc ? '' : acc + os_1.EOL) + v, undefined);
                offset = replacementLines[replacementLines.length - 1].length - lines[lines.length - 1].length;
            }
            return {
                text,
                range,
                replacement,
                offset,
                newRange: isRangeSimplyCursorPosition(range)
                    ? range
                    : new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character + offset)
            };
        });
        replacementActions
            .filter(x => x.replacement !== x.text)
            .forEach(x => {
            editBuilder.replace(x.range, x.replacement);
        });
    }).then(() => {
        const sortedActions = replacementActions.sort((a, b) => compareByEndPosition(a.newRange, b.newRange));
        // in order to maintain the selections based on possible new replacement lengths, calculate the new
        // range coordinates, taking into account possible edits earlier in the line
        const lineRunningOffsets = lodashUniq(sortedActions.map(s => s.range.end.line))
            .map(lineNumber => ({ lineNumber, runningOffset: 0 }));
        const adjustedSelectionCoordinateList = sortedActions.map(s => {
            const lineRunningOffset = lineRunningOffsets.filter(lro => lro.lineNumber === s.range.end.line)[0];
            const range = new vscode.Range(s.newRange.start.line, s.newRange.start.character + lineRunningOffset.runningOffset, s.newRange.end.line, s.newRange.end.character + lineRunningOffset.runningOffset);
            lineRunningOffset.runningOffset += s.offset;
            return range;
        });
        // now finally set the newly created selections
        editor.selections = adjustedSelectionCoordinateList.map(r => toSelection(r));
    });
}
exports.runCommand = runCommand;
function getSelectedTextIfOnlyOneSelection() {
    const editor = vscode.window.activeTextEditor;
    const { document, selection, selections } = editor;
    // check if there's only one selection or if the selection spans multiple lines
    if (selections.length > 1 || selection.start.line !== selection.end.line)
        return undefined;
    return getSelectedText(selections[0], document).text;
}
function getSelectedText(selection, document) {
    let range;
    if (isRangeSimplyCursorPosition(selection)) {
        range = getChangeCaseWordRangeAtPosition(document, selection.end);
    }
    else {
        range = new vscode.Range(selection.start, selection.end);
    }
    return {
        text: range ? document.getText(range) : undefined,
        range
    };
}
const CHANGE_CASE_WORD_CHARACTER_REGEX = /([\w_\.\-\/$]+)/;
const CHANGE_CASE_WORD_CHARACTER_REGEX_WITHOUT_DOT = /([\w_\-\/$]+)/;
// Change Case has a special definition of a word: it can contain special characters like dots, dashes and slashes
function getChangeCaseWordRangeAtPosition(document, position) {
    const configuration = vscode.workspace.getConfiguration('changeCase');
    const includeDotInCurrentWord = configuration ? configuration.get('includeDotInCurrentWord', false) : false;
    const regex = includeDotInCurrentWord
        ? CHANGE_CASE_WORD_CHARACTER_REGEX
        : CHANGE_CASE_WORD_CHARACTER_REGEX_WITHOUT_DOT;
    const range = document.getWordRangeAtPosition(position);
    if (!range)
        return undefined;
    let startCharacterIndex = range.start.character - 1;
    while (startCharacterIndex >= 0) {
        const charRange = new vscode.Range(range.start.line, startCharacterIndex, range.start.line, startCharacterIndex + 1);
        const character = document.getText(charRange);
        if (character.search(regex) === -1) {
            break;
        }
        startCharacterIndex--;
    }
    const lineMaxColumn = document.lineAt(range.end.line).range.end.character;
    let endCharacterIndex = range.end.character;
    while (endCharacterIndex < lineMaxColumn) {
        const charRange = new vscode.Range(range.end.line, endCharacterIndex, range.end.line, endCharacterIndex + 1);
        const character = document.getText(charRange);
        if (character.search(regex) === -1) {
            break;
        }
        endCharacterIndex++;
    }
    return new vscode.Range(range.start.line, startCharacterIndex + 1, range.end.line, endCharacterIndex);
}
function isRangeSimplyCursorPosition(range) {
    return range.start.line === range.end.line && range.start.character === range.end.character;
}
function toSelection(range) {
    return new vscode.Selection(range.start.line, range.start.character, range.end.line, range.end.character);
}
function compareByEndPosition(a, b) {
    if (a.end.line < b.end.line)
        return -1;
    if (a.end.line > b.end.line)
        return 1;
    if (a.end.character < b.end.character)
        return -1;
    if (a.end.character > b.end.character)
        return 1;
    return 0;
}
//# sourceMappingURL=change-case-commands.js.map