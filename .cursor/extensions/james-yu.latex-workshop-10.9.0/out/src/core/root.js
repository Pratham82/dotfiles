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
exports.root = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const lw_1 = require("../lw");
const utils = __importStar(require("../utils/utils"));
const logger = lw_1.lw.log('Root');
exports.root = {
    file: {
        path: undefined,
        langId: undefined,
    },
    dir: {
        path: undefined,
    },
    subfiles: {
        path: undefined,
        langId: undefined,
    },
    find,
    getWorkspace
};
lw_1.lw.watcher.src.onDelete(uri => {
    if (uri.fsPath !== exports.root.file.path) {
        return;
    }
    exports.root.file = { path: undefined, langId: undefined };
    void find();
});
/**
 * Finds the LaTeX project's root file.
 *
 * This function employs multiple strategies to find the root file for the LaTeX
 * project. It first checks for a magic comment in the active editor, then looks
 * for the root file based on the active editor's content and the entire
 * workspace according to configuration settings. The identified root file
 * triggers relevant events, and dependencies are refreshed accordingly.
 */
async function find() {
    const wsfolders = vscode.workspace.workspaceFolders?.map(e => e.uri.toString(true));
    logger.log(`Current workspace folders: ${JSON.stringify(wsfolders)}`);
    exports.root.subfiles = { path: undefined, langId: undefined };
    const findMethods = [
        () => findFromMagic(),
        () => findFromActive(),
        () => findFromRoot(),
        () => findInWorkspace()
    ];
    for (const method of findMethods) {
        const rootFilePath = await method();
        if (rootFilePath === undefined) {
            continue;
        }
        if (rootFilePath === exports.root.file.path) {
            logger.log(`Keep using the same root file: ${exports.root.file.path}`);
            void lw_1.lw.outline.refresh();
        }
        else {
            exports.root.file.path = rootFilePath;
            exports.root.file.langId = lw_1.lw.file.getLangId(rootFilePath);
            exports.root.dir.path = path.dirname(rootFilePath);
            logger.log(`Root file changed: from ${exports.root.file.path} to ${rootFilePath}, langID ${exports.root.file.langId} . Refresh dependencies`);
            lw_1.lw.event.fire(lw_1.lw.event.RootFileChanged, rootFilePath);
            // We also clean the completions from the old project
            lw_1.lw.completion.input.reset();
            lw_1.lw.lint.label.reset();
            lw_1.lw.cache.reset();
            lw_1.lw.cache.add(rootFilePath);
            void lw_1.lw.cache.refreshCache(rootFilePath).then(async () => {
                // We need to parse the fls to discover file dependencies when defined by TeX macro
                // It happens a lot with subfiles, https://tex.stackexchange.com/questions/289450/path-of-figures-in-different-directories-with-subfile-latex
                await lw_1.lw.cache.loadFlsFile(rootFilePath);
            });
        }
        lw_1.lw.event.fire(lw_1.lw.event.RootFileSearched);
        return;
    }
    logger.log('No root file found.');
    void lw_1.lw.outline.refresh();
    lw_1.lw.event.fire(lw_1.lw.event.RootFileSearched);
    return;
}
/**
 * Gets the indicator regex based on the LaTeX configuration.
 *
 * This function retrieves the indicator regex based on the LaTeX configuration.
 * The indicator is used to identify the root file in the content of the active
 * editor.
 *
 * @returns {RegExp} The indicator regex.
 */
function getIndicator() {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const indicator = configuration.get('latex.rootFile.indicator');
    switch (indicator) {
        case '\\documentclass[]{}':
            return /\\documentclass(?:\s*\[.*\])?\s*\{.*\}/ms;
        case '\\begin{document}':
            return /\\begin\s*{document}/m;
        default:
            logger.logError('Unknown rootFile.indicator', indicator);
            return /\\documentclass(?:\s*\[.*\])?\s*\{.*\}/ms;
    }
}
/**
 * Gets the workspace URI for a given file path or the active editor's
 * workspace.
 *
 * This function determines the workspace URI for a given file path or the
 * active editor's workspace. If no workspace is opened, it returns undefined.
 * If provided with a file path, it checks its workspace. If the active text
 * editor is not available, it makes an educated guess based on the first
 * workspace.
 *
 * @param {string} [filePath] - The file path for which to get the workspace
 * URI.
 * @returns {vscode.Uri | undefined} The workspace URI.
 */
function getWorkspace(filePath) {
    const firstWorkspace = vscode.workspace.workspaceFolders?.[0];
    // If no workspace is opened.
    if (!firstWorkspace) {
        return;
    }
    // If provided with a filePath, check its workspace
    if (filePath !== undefined) {
        return (vscode.workspace.getWorkspaceFolder(lw_1.lw.file.toUri(filePath)) ?? firstWorkspace).uri;
    }
    // If we don't have an active text editor, we can only make a guess.
    // Let's guess the first one.
    if (!vscode.window.activeTextEditor) {
        return firstWorkspace.uri;
    }
    // Get the workspace folder which contains the active document.
    return (vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri) ?? firstWorkspace).uri;
}
/**
 * Finds the root file based on a magic comment in the active editor.
 *
 * This function looks for a magic comment in the content of the active editor
 * to determine the root file. It follows the chain of magic comments until a
 * loop is detected or the root file is found.
 *
 * @returns {string | undefined} The root file path, or undefined if not found.
 */
async function findFromMagic() {
    if (!vscode.window.activeTextEditor) {
        return;
    }
    logger.log('Try finding root from magic comment.');
    const regex = /^(?:%\s*!\s*T[Ee]X\sroot\s*=\s*(.*\.(?:tex|[jrsRS]nw|[rR]tex|jtexw))$)/m;
    const fileStack = [];
    let content = vscode.window.activeTextEditor.document.getText();
    let filePath = vscode.window.activeTextEditor.document.fileName;
    let result = content.match(regex);
    while (result) {
        filePath = path.resolve(path.dirname(filePath), result[1]);
        if (fileStack.includes(filePath)) {
            logger.log(`Found looped magic root ${filePath} .`);
            return filePath;
        }
        fileStack.push(filePath);
        logger.log(`Found magic root ${filePath}`);
        content = await lw_1.lw.file.read(filePath);
        if (content === undefined) {
            logger.log(`Non-existent magic root ${filePath} .`);
            return;
        }
        result = content.match(regex);
    }
    if (fileStack.length > 0) {
        const finalFilePath = fileStack[fileStack.length - 1];
        logger.log(`Finalized magic root ${finalFilePath} .`);
        return finalFilePath;
    }
    return;
}
/**
 * Finds the root file based on the active editor's file.
 *
 * This function verifies if the active editor's file is already in the cache of
 * included TeX files. If so, the current root file remains to be the root.
 *
 * @returns {string | undefined} The root file path, or undefined if not found.
 */
function findFromRoot() {
    if (!vscode.window.activeTextEditor || exports.root.file.path === undefined) {
        return;
    }
    if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(vscode.window.activeTextEditor.document.uri.scheme)) {
        logger.log(`The active document cannot be used as the root file: ${vscode.window.activeTextEditor.document.uri.toString(true)}`);
        return;
    }
    logger.log('Try finding root from current root.');
    if (lw_1.lw.cache.getIncludedTeX().includes(vscode.window.activeTextEditor.document.fileName)) {
        return exports.root.file.path;
    }
    return;
}
/**
 * Finds the root file based on the active editor's content.
 *
 * This function identifies the root file by searching for an indicator RegExp
 * in the content of the active editor. It also handles the case where the root
 * file is a subfile, triggering relevant events.
 *
 * @returns {string | undefined} The root file path, or undefined if not found.
 */
async function findFromActive() {
    if (!vscode.window.activeTextEditor) {
        return;
    }
    if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(vscode.window.activeTextEditor.document.uri.scheme)) {
        logger.log(`The active document cannot be used as the root file: ${vscode.window.activeTextEditor.document.uri.toString(true)}`);
        return;
    }
    logger.log('Try finding root from active editor.');
    const content = utils.stripCommentsAndVerbatim(vscode.window.activeTextEditor.document.getText());
    const result = content.match(getIndicator());
    if (result) {
        const rootFilePath = await findSubfiles(content);
        const activeFilePath = vscode.window.activeTextEditor.document.fileName;
        if (rootFilePath) {
            exports.root.subfiles.path = activeFilePath;
            exports.root.subfiles.langId = lw_1.lw.file.getLangId(activeFilePath);
            return rootFilePath;
        }
        else {
            logger.log(`Found root file from active editor: ${activeFilePath}`);
            return activeFilePath;
        }
    }
    return;
}
/**
 * Finds the root file for subfiles in the active editor's content.
 *
 * This function identifies the root file for subfiles in the content of the
 * active editor by searching for a specific pattern.
 *
 * @param {string} content - The content of the active editor.
 * @returns {string | undefined} The root file path for subfiles, or undefined
 * if not found.
 */
async function findSubfiles(content) {
    const regex = /(?:\\documentclass\[(.*)\]{subfiles})/s;
    const result = content.match(regex);
    if (!result) {
        return;
    }
    const filePath = await utils.resolveFile([path.dirname(vscode.window.activeTextEditor.document.fileName)], result[1]);
    if (filePath) {
        logger.log(`Found subfile root ${filePath} from active.`);
    }
    return filePath;
}
/**
 * Finds the root file in the entire workspace based on configuration settings.
 *
 * This function scans the entire workspace based on configuration settings to
 * find potential root files. It considers patterns for inclusion and exclusion
 * and validates candidates based on TeX file indicators. The identified root
 * file triggers relevant events, and dependencies are refreshed accordingly.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the root
 * file path, or undefined if not found.
 */
async function findInWorkspace() {
    const workspace = getWorkspace();
    logger.log(`Try finding root from current workspaceRootDir: ${workspace ? workspace.toString(true) : ''} .`);
    if (!workspace) {
        return;
    }
    const configuration = vscode.workspace.getConfiguration('latex-workshop', workspace);
    const rootFilesIncludePatterns = configuration.get('latex.search.rootFiles.include');
    const rootFilesIncludeGlob = '{' + rootFilesIncludePatterns.join(',') + '}';
    const rootFilesExcludePatterns = configuration.get('latex.search.rootFiles.exclude');
    const rootFilesExcludeGlob = rootFilesExcludePatterns.length > 0 ? '{' + rootFilesExcludePatterns.join(',') + '}' : undefined;
    try {
        const fileUris = await vscode.workspace.findFiles(rootFilesIncludeGlob, rootFilesExcludeGlob);
        const candidates = [];
        for (const fileUri of fileUris) {
            if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(fileUri.scheme)) {
                logger.log(`Skip the file: ${fileUri.toString(true)}`);
                continue;
            }
            const flsChildren = await lw_1.lw.cache.getFlsChildren(fileUri.fsPath);
            if (vscode.window.activeTextEditor && flsChildren.includes(vscode.window.activeTextEditor.document.fileName)) {
                logger.log(`Found root file from '.fls': ${fileUri.fsPath}`);
                return fileUri.fsPath;
            }
            const content = utils.stripCommentsAndVerbatim(fs.readFileSync(fileUri.fsPath).toString());
            const result = content.match(getIndicator());
            if (result) {
                // Can be a root
                const children = lw_1.lw.cache.getIncludedTeX(fileUri.fsPath, false).filter(filePath => filePath !== fileUri.fsPath);
                if (vscode.window.activeTextEditor && children.includes(vscode.window.activeTextEditor.document.fileName)) {
                    logger.log(`Found root file from active editor by parent: ${fileUri.fsPath}`);
                    candidates.unshift(fileUri.fsPath);
                }
                // Not including the active file, yet can still be a root candidate
                candidates.push(fileUri.fsPath);
            }
        }
        if (exports.root.file.path && candidates.includes(exports.root.file.path)) {
            logger.log(`Found files that might be root including the current root: ${candidates} .`);
            return exports.root.file.path;
        }
        else if (candidates.length > 0) {
            logger.log(`Found files that might be root, choose the first one: ${candidates} .`);
            return candidates[0];
        }
    }
    catch (err) {
        logger.logError('Error finding root file in workspace', err);
    }
    return;
}
//# sourceMappingURL=root.js.map