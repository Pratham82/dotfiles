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
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceWorkspaceFolderWithRootPath = exports.getChildrenOfPath = exports.getPathOfFolderToLookupFiles = void 0;
const minimatch = require("minimatch");
const path = require("path");
const path_1 = require("path");
const vscode = require("vscode");
/**
 * @param fileName  {string} current filename the look up is done. Absolute path
 * @param text      {string} text in import string. e.g. './src/'
 */
function getPathOfFolderToLookupFiles(fileName, text, rootPath, mappings) {
    // Note: since we're normalizing the text here, we have to normalize everything we want
    //  to compare it against as path.normalize() turns forward slashes into backslashes on
    //  Windows.
    const normalizedText = path.normalize(text || "");
    const isPathAbsolute = normalizedText.startsWith(path.sep);
    // Search a mapping for the current text. First mapping is used where text starts with mapping
    const mapping = mappings &&
        mappings.reduce((prev, curr) => {
            return (prev || (normalizedText.startsWith(path.normalize(curr.key)) && curr));
        }, undefined);
    let rootFolder, pathEntered;
    if (mapping) {
        // The values of mapped (key,value)-pairs are all considered to be absolute paths, so
        //  this rootFolder value (taken from the mapping's value) is left unchanged.
        rootFolder = mapping.value;
        pathEntered = normalizedText.slice(path.normalize(mapping.key).length, normalizedText.length);
    }
    else {
        // We only care about whether the path specified was absolute if it's unmapped (e.g.
        //  we allow user-specified maps to "override" (skip) this root folder determination.)
        rootFolder = isPathAbsolute ? rootPath || "" : path.dirname(fileName);
        pathEntered = normalizedText;
    }
    return path.join(rootFolder, pathEntered);
}
exports.getPathOfFolderToLookupFiles = getPathOfFolderToLookupFiles;
function getChildrenOfPath(path, showHiddenFiles, filesExclude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filesTubles = yield vscode.workspace.fs.readDirectory(vscode.Uri.file(path));
            const files = filesTubles
                .map((fileTuble) => fileTuble[0])
                .filter((filename) => filterHiddenFiles(filename, showHiddenFiles, filesExclude));
            const fileInfoList = [];
            for (const file of files) {
                const fileStat = yield vscode.workspace.fs.stat(vscode.Uri.file(path_1.join(path, file)));
                fileInfoList.push({
                    file,
                    isFile: fileStat.type === vscode.FileType.File,
                    documentExtension: getDocumentExtension(file, fileStat),
                });
            }
            return fileInfoList;
        }
        catch (error) {
            return [];
        }
    });
}
exports.getChildrenOfPath = getChildrenOfPath;
function getDocumentExtension(file, fileStat) {
    if (fileStat.type !== vscode.FileType.File) {
        return undefined;
    }
    const fragments = file.split(".");
    return fragments[fragments.length - 1];
}
function filterHiddenFiles(filename, showHiddenFiles, filesExclude) {
    if (showHiddenFiles) {
        return true;
    }
    return isFileHidden(filename, filesExclude) ? false : true;
}
function isFileHidden(filename, filesExclude) {
    return (filename.startsWith(".") || isFileHiddenByVsCode(filename, filesExclude));
}
// files.exclude has the following form. key is the glob
// {
//    "**//*.js": true
//    "**//*.js": true "*.git": true
// }
function isFileHiddenByVsCode(filename, filesExclude) {
    return (filesExclude &&
        Object.keys(filesExclude).some((key) => filesExclude[key] && minimatch(filename, key)));
}
/**
 * Replaces both placeholders with the rootpath
 * - ${workspaceRoot}    // old way and only legacy support
 * - ${workspaceFolder}  // new way
 * @param value
 * @param rootPath
 */
function replaceWorkspaceFolderWithRootPath(value, rootPath) {
    return value
        .replace("${workspaceRoot}", rootPath)
        .replace("${workspaceFolder}", rootPath);
}
exports.replaceWorkspaceFolderWithRootPath = replaceWorkspaceFolderWithRootPath;
//# sourceMappingURL=file-utills.js.map