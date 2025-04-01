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
exports.hostPort = hostPort;
exports.build = build;
exports.revealOutputDir = revealOutputDir;
exports.recipes = recipes;
exports.view = view;
exports.refresh = refresh;
exports.kill = kill;
exports.synctex = synctex;
exports.synctexonref = synctexonref;
exports.clean = clean;
exports.addTexRoot = addTexRoot;
exports.citation = citation;
exports.wordcount = wordcount;
exports.showLog = showLog;
exports.gotoSection = gotoSection;
exports.navigateToEnvPair = navigateToEnvPair;
exports.selectEnvContent = selectEnvContent;
exports.selectEnvName = selectEnvName;
exports.multiCursorEnvName = multiCursorEnvName;
exports.toggleEquationEnv = toggleEquationEnv;
exports.closeEnv = closeEnv;
exports.changeHostName = changeHostName;
exports.resetHostName = resetHostName;
exports.actions = actions;
exports.insertSnippet = insertSnippet;
exports.onEnterKey = onEnterKey;
exports.toggleSelectedKeyword = toggleSelectedKeyword;
exports.shiftSectioningLevel = shiftSectioningLevel;
exports.selectSection = selectSection;
exports.devParseLog = devParseLog;
exports.devParseTeX = devParseTeX;
exports.devParseBib = devParseBib;
exports.checkCitations = checkCitations;
exports.devStripText = devStripText;
exports.texdoc = texdoc;
exports.texdocUsepackages = texdocUsepackages;
exports.saveActive = saveActive;
exports.openMathPreviewPanel = openMathPreviewPanel;
exports.closeMathPreviewPanel = closeMathPreviewPanel;
exports.toggleMathPreviewPanel = toggleMathPreviewPanel;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const utils_1 = require("../utils/utils");
const logger = lw_1.lw.log('Commander');
async function hostPort() {
    logger.log('HOSTPORT command invoked.');
    if (lw_1.lw.extra.liveshare.isGuest()) {
        await lw_1.lw.extra.liveshare.getHostServerPort(true);
    }
    else {
        await lw_1.lw.extra.liveshare.shareServer();
    }
}
async function build(skipSelection = false, rootFile = undefined, languageId = undefined, recipe = undefined) {
    logger.log('BUILD command invoked.');
    await lw_1.lw.compile.build(skipSelection, rootFile, languageId, recipe);
}
async function revealOutputDir() {
    let outDir = lw_1.lw.file.getOutDir();
    if (!path.isAbsolute(outDir)) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const rootDir = lw_1.lw.root.dir.path || workspaceFolder?.uri.fsPath;
        if (rootDir === undefined) {
            logger.log(`Cannot reveal ${lw_1.lw.file.toUri(outDir)}: no root dir can be identified.`);
            return;
        }
        outDir = path.resolve(rootDir, outDir);
    }
    logger.log(`Reveal ${lw_1.lw.file.toUri(outDir)}`);
    await vscode.commands.executeCommand('revealFileInOS', lw_1.lw.file.toUri(outDir));
}
function recipes(recipe) {
    logger.log('RECIPES command invoked.');
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.root.getWorkspace());
    const candidates = configuration.get('latex.recipes');
    if (!candidates) {
        return;
    }
    if (recipe) {
        return build(false, undefined, undefined, recipe);
    }
    return vscode.window.showQuickPick(candidates.map(candidate => candidate.name), {
        placeHolder: 'Please Select a LaTeX Recipe'
    }).then(selected => {
        if (!selected) {
            return;
        }
        return build(false, undefined, undefined, selected);
    });
}
async function view(mode) {
    if (mode) {
        logger.log(`VIEW command invoked with mode: ${mode}.`);
    }
    else {
        logger.log('VIEW command invoked.');
    }
    if (!vscode.window.activeTextEditor) {
        logger.log('Cannot find active TextEditor.');
        return;
    }
    if (!lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        logger.log('Active document is not a TeX file.');
        return;
    }
    await lw_1.lw.root.find();
    const rootFile = lw_1.lw.root.file.path;
    if (rootFile === undefined) {
        logger.log('Cannot find LaTeX root PDF to view.');
        return;
    }
    let pickedRootFile = rootFile;
    if (lw_1.lw.root.subfiles.path) {
        // We are using the subfile package
        pickedRootFile = await quickPickRootFile(rootFile, lw_1.lw.root.subfiles.path, 'view');
    }
    if (!pickedRootFile) {
        return;
    }
    return lw_1.lw.viewer.view(lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(pickedRootFile)), typeof mode === 'string' ? mode : undefined);
}
function refresh() {
    logger.log('REFRESH command invoked.');
    lw_1.lw.viewer.refresh();
}
function kill() {
    logger.log('KILL command invoked.');
    lw_1.lw.compile.terminate();
}
function synctex() {
    logger.log('SYNCTEX command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        logger.log('Cannot start SyncTeX. The active editor is undefined, or the document is not a TeX document.');
        return;
    }
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.root.getWorkspace());
    if (lw_1.lw.extra.liveshare.handle.command.syncTeX()) {
        return;
    }
    let pdfUri = undefined;
    if (lw_1.lw.root.subfiles.path && configuration.get('latex.rootFile.useSubFile')) {
        pdfUri = lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(lw_1.lw.root.subfiles.path));
    }
    else if (lw_1.lw.root.file.path !== undefined) {
        pdfUri = lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(lw_1.lw.root.file.path));
    }
    lw_1.lw.locate.synctex.toPDF(pdfUri);
}
function synctexonref(line, filePath) {
    logger.log('SYNCTEX command invoked on a reference.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        logger.log('Cannot start SyncTeX. The active editor is undefined, or the document is not a TeX document.');
        return;
    }
    lw_1.lw.locate.synctex.toPDFFromRef({ line, filePath });
}
async function clean() {
    logger.log('CLEAN command invoked.');
    await lw_1.lw.root.find();
    const rootFile = lw_1.lw.root.file.path;
    if (rootFile === undefined) {
        logger.log('Cannot find LaTeX root file to clean.');
        return;
    }
    let pickedRootFile = rootFile;
    if (lw_1.lw.root.subfiles.path) {
        // We are using the subfile package
        pickedRootFile = await quickPickRootFile(rootFile, lw_1.lw.root.subfiles.path, 'clean');
        if (!pickedRootFile) {
            return;
        }
    }
    return lw_1.lw.extra.clean(pickedRootFile);
}
function addTexRoot() {
    logger.log('ADDTEXROOT command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    lw_1.lw.extra.texroot();
}
function citation() {
    logger.log('CITATION command invoked.');
    lw_1.lw.completion.citation.browser();
}
function wordcount() {
    logger.log('WORDCOUNT command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId) ||
        lw_1.lw.root.file.path === vscode.window.activeTextEditor.document.fileName) {
        if (lw_1.lw.root.file.path) {
            lw_1.lw.extra.count(lw_1.lw.root.file.path, true, true);
        }
        else {
            logger.log('WORDCOUNT: No rootFile defined.');
        }
    }
    else {
        lw_1.lw.extra.count(vscode.window.activeTextEditor.document.fileName, false, true);
    }
}
function showLog(compiler) {
    logger.log(`SHOWLOG command invoked: ${compiler || 'default'}`);
    if (compiler) {
        logger.showCompilerLog();
    }
    else {
        logger.showLog();
    }
}
async function gotoSection(filePath, lineNumber) {
    logger.log(`GOTOSECTION command invoked. Target ${filePath}, line ${lineNumber}`);
    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);
    // input lineNumber is one-based, while editor position is zero-based.
    await vscode.commands.executeCommand('revealLine', { lineNumber, at: 'center' });
    if (vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.selection = new vscode.Selection(new vscode.Position(lineNumber, 0), new vscode.Position(lineNumber, 0));
        if (vscode.workspace.getConfiguration('latex-workshop').get('view.outline.sync.viewer')) {
            lw_1.lw.locate.synctex.toPDF(undefined, { line: lineNumber, filePath: doc.fileName });
        }
    }
}
function navigateToEnvPair() {
    logger.log('JumpToEnvPair command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.goto();
}
function selectEnvContent(mode) {
    logger.log('SelectEnv command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.select(mode);
}
function selectEnvName() {
    logger.log('SelectEnvName command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.name('selection');
}
function multiCursorEnvName() {
    logger.log('MutliCursorEnvName command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.name('cursor');
}
function toggleEquationEnv() {
    logger.log('toggleEquationEnv command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.name('equationToggle');
}
function closeEnv() {
    logger.log('CloseEnv command invoked.');
    if (!vscode.window.activeTextEditor || !lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor.document.languageId)) {
        return;
    }
    void lw_1.lw.locate.pair.close();
}
async function changeHostName() {
    logger.log('CHANGEHOSTNAME command invoked.');
    const proceed = (await vscode.window.showInputBox({
        prompt: 'Changing LaTeX Workshop server hostname can expose your computer to the public and is under severe security risk. CORS is also disabled. Do you want to continue?',
        placeHolder: 'Type CONFIRM then [Enter] to continue. Press [ESC] to keep you safe.'
    }))?.toLowerCase() === 'confirm';
    if (!proceed) {
        return;
    }
    const hostname = await vscode.window.showInputBox({
        prompt: 'Please input the new hostname that LaTeX Workshop server will listen to. This change will be reset on closing VSCode.',
        placeHolder: '127.0.0.1'
    });
    if (!hostname) {
        return;
    }
    lw_1.lw.server.initialize(hostname);
}
function resetHostName() {
    logger.log('RESETHOSTNAME command invoked.');
    lw_1.lw.server.initialize('127.0.0.1');
    void vscode.window.showInformationMessage('LaTeX Workshop server listening to 127.0.0.1 with CORS. You are safe now.');
}
async function actions() {
    logger.log('ACTIONS command invoked.');
    return vscode.commands.executeCommand('workbench.view.extension.latex-workshop-activitybar').then(() => vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup'));
}
/**
 * Insert the snippet with name name.
 * @param name  the name of a snippet contained in latex.json
 */
async function insertSnippet(name) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    switch (name) {
        case 'wrapEnv':
            await editor.insertSnippet(new vscode.SnippetString('\n\\begin{$1}\n\t${0:${TM_SELECTED_TEXT}}\n\\end{$1}'));
            return;
        case 'item':
            await editor.insertSnippet(new vscode.SnippetString('\n\\item '));
            return;
        default:
            return;
    }
}
/**
 * If the current line starts with \item or \item[], do the same for
 * the new line when hitting enter.
 * Note that hitting enter on a line containing only \item or \item[]
 * actually deletes the content of the line.
 */
function onEnterKey(modifiers) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    if (!configuration.get('bind.enter.key')) {
        return vscode.commands.executeCommand('type', { source: 'keyboard', text: '\n' });
    }
    if (modifiers === 'alt') {
        return vscode.commands.executeCommand('editor.action.insertLineAfter');
    }
    // Test if every cursor is at the end of a line starting with \item
    const allCursorsOnItem = editor.selections.every((selection) => {
        const cursorPos = selection.active;
        const line = editor.document.lineAt(cursorPos.line);
        return /^\s*\\item/.test(line.text) && (line.text.substring(cursorPos.character).trim().length === 0);
    });
    if (!allCursorsOnItem) {
        return vscode.commands.executeCommand('type', { source: 'keyboard', text: '\n' });
    }
    return editor.edit(editBuilder => {
        // If we arrive here, all the cursors are at the end of a line starting with `\s*\\item`.
        // Yet, we keep the conditions for the sake of maintenance.
        for (const selection of editor.selections) {
            const cursorPos = selection.active;
            const line = editor.document.lineAt(cursorPos.line);
            const indentation = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);
            if (/^\s*\\item(\[\s*\])?\s*$/.test(line.text)) {
                // The line is an empty \item or \item[]
                const rangeToDelete = line.range.with(cursorPos.with(line.lineNumber, line.firstNonWhitespaceCharacterIndex), line.range.end);
                editBuilder.delete(rangeToDelete);
            }
            else if (/^\s*\\item\[[^[\]]*\]/.test(line.text)) {
                // The line starts with \item[blabla] or \item[] blabla
                const itemString = `\n${indentation}\\item[] `;
                editBuilder.insert(cursorPos, itemString);
            }
            else if (/^\s*\\item\s*[^\s]+.*$/.test(line.text)) {
                // The line starts with \item blabla
                const itemString = `\n${indentation}\\item `;
                editBuilder.insert(cursorPos, itemString);
            }
            else {
                // If we do not know what to do, insert a newline and indent using the current indentation
                editBuilder.insert(cursorPos, `\n${indentation}`);
            }
        }
    });
}
/**
* Toggle a keyword. This function works with multi-cursors or multi-selections
*
* If the selection is empty, a snippet is added.
*
* If the selection is not empty and matches `\keyword{...}`, it is replaced by
* the argument of `keyword`. If the selection does not start with `\keyword`, it is surrounded by `\keyword{...}`.
*
*  @param keyword the keyword to toggle without backslash eg. textbf or underline
*/
async function toggleSelectedKeyword(keyword) {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }
    const editActions = [];
    const snippetActions = [];
    for (const selection of editor.selections) {
        // If the selection is empty, determine if a snippet should be inserted or the cursor is inside \keyword{...}
        if (selection.isEmpty) {
            const surroundingCommandRange = (0, utils_1.getSurroundingMacroRange)(keyword, selection.anchor, editor.document);
            if (surroundingCommandRange) {
                editActions.push({ range: surroundingCommandRange.range, text: surroundingCommandRange.arg });
            }
            else {
                snippetActions.push(selection.anchor);
            }
            continue;
        }
        // When the selection is not empty, decide if \keyword must be inserted or removed
        const text = editor.document.getText(selection);
        if (text.startsWith(`\\${keyword}{`) || text.startsWith(`${keyword}{`)) {
            const start = text.indexOf('{') + 1;
            const insideText = text.slice(start).slice(0, -1);
            editActions.push({ range: selection, text: insideText });
        }
        else {
            editActions.push({ range: selection, text: `\\${keyword}{${text}}` });
        }
    }
    if (editActions.length === 0 && snippetActions.length > 0) {
        const snippet = new vscode.SnippetString(`\\\\${keyword}{$1}`);
        await editor.insertSnippet(snippet, snippetActions);
    }
    else if (editActions.length > 0 && snippetActions.length === 0) {
        await editor.edit((editBuilder) => {
            editActions.forEach(action => {
                editBuilder.replace(action.range, action.text);
            });
        });
    }
    else {
        logger.log('toggleSelectedKeyword: cannot handle mixed edit and snippet actions');
    }
}
/**
 * Shift the level sectioning in the selection by one (up or down)
 * @param change
 */
function shiftSectioningLevel(change) {
    lw_1.lw.extra.section(change);
}
function selectSection() {
    lw_1.lw.extra.section('select');
}
function devParseLog() {
    if (vscode.window.activeTextEditor === undefined) {
        return;
    }
    lw_1.lw.parser.parse.log(vscode.window.activeTextEditor.document.getText());
}
async function devParseTeX() {
    if (vscode.window.activeTextEditor === undefined) {
        return;
    }
    const ast = await lw_1.lw.parser.parse.tex(vscode.window.activeTextEditor.document.getText());
    return vscode.workspace.openTextDocument({ content: JSON.stringify(ast, null, 2), language: 'json' }).then(doc => vscode.window.showTextDocument(doc));
}
async function devParseBib() {
    if (vscode.window.activeTextEditor === undefined) {
        return;
    }
    const ast = await lw_1.lw.parser.parse.bib(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.document.getText());
    return vscode.workspace.openTextDocument({ content: JSON.stringify(ast, null, 2), language: 'json' }).then(doc => vscode.window.showTextDocument(doc));
}
async function checkCitations() {
    const unused = lw_1.lw.extra.checkCitations();
    if (unused.length === 0) {
        return;
    }
    const selected = await vscode.window.showQuickPick(unused, { title: 'Unused citations' });
    if (!selected) {
        return;
    }
    const bibFiles = lw_1.lw.cache.getIncludedBib(lw_1.lw.root.file.path);
    for (const bibFile of bibFiles) {
        const content = await lw_1.lw.file.read(bibFile);
        if (content && content.includes(selected)) {
            const doc = await vscode.workspace.openTextDocument(bibFile);
            const { line, index } = content
                .split(doc.eol === vscode.EndOfLine.LF ? '\n' : '\r\n')
                .map((l, i) => ({ line: l, index: i }))
                .find(({ line: l }) => l.includes(selected));
            const start = new vscode.Position(index, line.indexOf(selected));
            const end = new vscode.Position(index, line.indexOf(selected) + selected.length);
            await vscode.window.showTextDocument(doc, {
                selection: new vscode.Range(start, end),
            });
            return;
        }
    }
}
async function devStripText() {
    if (vscode.window.activeTextEditor === undefined) {
        return;
    }
    const content = (0, utils_1.stripText)(vscode.window.activeTextEditor.document.getText());
    return vscode.workspace.openTextDocument({ content }).then(doc => vscode.window.showTextDocument(doc));
}
function texdoc(packageName) {
    lw_1.lw.extra.texdoc(packageName);
}
function texdocUsepackages() {
    lw_1.lw.extra.texdoc(undefined, true);
}
async function saveActive() {
    lw_1.lw.compile.lastAutoBuildTime = Date.now();
    await vscode.window.activeTextEditor?.document.save();
}
function openMathPreviewPanel() {
    lw_1.lw.preview.mathpreview.toggle('open');
}
function closeMathPreviewPanel() {
    lw_1.lw.preview.mathpreview.toggle('close');
}
function toggleMathPreviewPanel() {
    lw_1.lw.preview.mathpreview.toggle();
}
async function quickPickRootFile(rootFile, localRootFile, verb) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(rootFile));
    const doNotPrompt = configuration.get('latex.rootFile.doNotPrompt');
    if (doNotPrompt) {
        if (configuration.get('latex.rootFile.useSubFile')) {
            return localRootFile;
        }
        else {
            return rootFile;
        }
    }
    const pickedRootFile = await vscode.window.showQuickPick([{
            label: 'Default root file',
            description: `Path: ${rootFile}`
        }, {
            label: 'Subfiles package root file',
            description: `Path: ${localRootFile}`
        }], {
        placeHolder: `Subfiles package detected. Which file to ${verb}?`,
        matchOnDescription: true
    }).then(selected => {
        if (!selected) {
            return;
        }
        switch (selected.label) {
            case 'Default root file':
                return rootFile;
            case 'Subfiles package root file':
                return localRootFile;
            default:
                return;
        }
    });
    return pickedRootFile;
}
//# sourceMappingURL=commands.js.map