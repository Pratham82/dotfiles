"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPathCompletionItem = void 0;
const vscode = require("vscode");
function createPathCompletionItem(fileInfo, config, context) {
    return fileInfo.isFile
        ? createFileItem(fileInfo, config, context)
        : createFolderItem(fileInfo, config.autoSlash, config.autoTrigger, context.importRange);
}
exports.createPathCompletionItem = createPathCompletionItem;
function createFolderItem(fileInfo, autoSlash, autoTrigger, importRange) {
    var newText = autoSlash || autoTrigger ? `${fileInfo.file}/` : `${fileInfo.file}`;
    return {
        label: fileInfo.file,
        kind: vscode.CompletionItemKind.Folder,
        sortText: `a_${fileInfo.file}`,
        range: importRange,
        insertText: newText,
        command: autoTrigger
            ? {
                title: "Trigger suggest",
                command: "editor.action.triggerSuggest",
            }
            : undefined,
    };
}
function createFileItem(fileInfo, config, context) {
    const insertText = createCompletionItemInsertText(fileInfo, config, context);
    return {
        label: fileInfo.file,
        kind: vscode.CompletionItemKind.File,
        sortText: `b_${fileInfo.file}`,
        range: context.importRange,
        insertText: insertText,
    };
}
function createCompletionItemInsertText(fileInfo, config, context) {
    const shouldExcludeDocumentExtension = context.isImport &&
        !config.withExtension &&
        fileInfo.documentExtension === context.documentExtension;
    return shouldExcludeDocumentExtension
        ? getFileNameWithoutExtension(fileInfo.file)
        : fileInfo.file;
}
function getFileNameWithoutExtension(fileName) {
    let index = fileName.lastIndexOf(".");
    return index !== -1 ? fileName.substring(0, index) : fileName;
}
//# sourceMappingURL=createCompletionItem.js.map