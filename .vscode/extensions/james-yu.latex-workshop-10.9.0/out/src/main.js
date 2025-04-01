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
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("./lw");
lw_1.lw.extensionRoot = path.resolve(`${__dirname}/../../`);
const logger_1 = require("./utils/logger");
lw_1.lw.log = logger_1.log.getLogger;
const logger = lw_1.lw.log('Extension');
logger.log('Initializing LaTeX Workshop.');
const event_1 = require("./core/event");
lw_1.lw.event = event_1.event;
const file_1 = require("./core/file");
lw_1.lw.file = file_1.file;
const watcher_1 = require("./core/watcher");
lw_1.lw.watcher = watcher_1.watcher;
const cache_1 = require("./core/cache");
lw_1.lw.cache = cache_1.cache;
const root_1 = require("./core/root");
lw_1.lw.root = root_1.root;
const parse_1 = require("./parse");
void parse_1.parser.parse.reset();
lw_1.lw.parser = parse_1.parser;
const compile_1 = require("./compile");
lw_1.lw.compile = compile_1.compile;
const preview_1 = require("./preview");
lw_1.lw.server = preview_1.server;
lw_1.lw.viewer = preview_1.viewer;
lw_1.lw.preview = preview_1.preview;
const locate_1 = require("./locate");
lw_1.lw.locate = locate_1.locate;
const completion_1 = require("./completion");
lw_1.lw.completion = completion_1.completion;
const language_1 = require("./language");
lw_1.lw.language = language_1.language;
const lint_1 = require("./lint");
lw_1.lw.lint = lint_1.lint;
const outline_1 = require("./outline");
lw_1.lw.outline = outline_1.outline;
const extras_1 = require("./extras");
lw_1.lw.extra = extras_1.extra;
const commander = __importStar(require("./core/commands"));
lw_1.lw.commands = commander;
logger_1.log.initStatusBarItem();
function activate(extensionContext) {
    void vscode.commands.executeCommand('setContext', 'latex-workshop:enabled', true);
    logger.log(`Extension root: ${lw_1.lw.extensionRoot}`);
    logger.log(`$PATH: ${process.env.PATH}`);
    logger.log(`$SHELL: ${process.env.SHELL}`);
    logger.log(`$LANG: ${process.env.LANG}`);
    logger.log(`$LC_ALL: ${process.env.LC_ALL}`);
    logger.log(`process.platform: ${process.platform}`);
    logger.log(`process.arch: ${process.arch}`);
    logger.log(`vscode.env.appName: ${vscode.env.appName}`);
    logger.log(`vscode.env.remoteName: ${vscode.env.remoteName}`);
    logger.log(`vscode.env.uiKind: ${vscode.env.uiKind}`);
    logger_1.log.logConfig();
    logger_1.log.logDeprecatedConfig();
    lw_1.lw.onDispose(undefined, extensionContext.subscriptions);
    registerLatexWorkshopCommands(extensionContext);
    extensionContext.subscriptions.push(vscode.workspace.onDidChangeConfiguration((ev) => {
        logger_1.log.logConfigChange(ev);
    }));
    extensionContext.subscriptions.push(vscode.workspace.onDidSaveTextDocument((e) => {
        if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(e.uri.scheme)) {
            return;
        }
        if (lw_1.lw.file.hasTeXLangId(e.languageId) ||
            lw_1.lw.cache.getIncludedTeX(lw_1.lw.root.file.path, false).includes(e.fileName) ||
            lw_1.lw.cache.getIncludedBib().includes(e.fileName)) {
            logger.log(`onDidSaveTextDocument triggered: ${e.uri.toString(true)}`);
            lw_1.lw.lint.latex.root();
            void lw_1.lw.compile.autoBuild(e.fileName, 'onSave');
            lw_1.lw.extra.count(e.fileName);
        }
        // We don't check LaTeX ID as the reconstruct is handled by the Cacher.
        // We don't check BibTeX ID as the reconstruct is handled by the citation completer.
        if (lw_1.lw.file.hasDtxLangId(e.languageId)) {
            void lw_1.lw.outline.reconstruct();
        }
    }));
    let isLaTeXActive = false;
    extensionContext.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(async (e) => {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        if (vscode.window.visibleTextEditors.filter(editor => lw_1.lw.file.hasTeXLangId(editor.document.languageId)).length > 0) {
            logger.showStatus();
            if (configuration.get('view.autoFocus.enabled') && !isLaTeXActive) {
                void vscode.commands.executeCommand('workbench.view.lw.latex-workshop-activitybar').then(() => vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup'));
            }
            isLaTeXActive = true;
        }
        else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId.toLowerCase() === 'log') {
            logger.showStatus();
        }
        if (e && !lw_1.lw.constant.FILE_URI_SCHEMES.includes(e.document.uri.scheme)) {
            return;
        }
        if (e && lw_1.lw.file.hasTeXLangId(e.document.languageId) && e.document.fileName !== lw_1.lw.previousActive?.document.fileName) {
            await lw_1.lw.root.find();
            lw_1.lw.lint.latex.root();
        }
        else if (!e || !lw_1.lw.file.hasBibLangId(e.document.languageId)) {
            isLaTeXActive = false;
        }
        if (e && lw_1.lw.file.hasTeXLangId(e.document.languageId)) {
            lw_1.lw.previousActive = e;
        }
        if (e && (lw_1.lw.file.hasTeXLangId(e.document.languageId)
            || lw_1.lw.file.hasBibLangId(e.document.languageId)
            || lw_1.lw.file.hasDtxLangId(e.document.languageId))) {
            void lw_1.lw.outline.refresh();
        }
    }));
    extensionContext.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
        if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(e.document.uri.scheme)) {
            return;
        }
        if (!lw_1.lw.file.hasTeXLangId(e.document.languageId) &&
            !lw_1.lw.file.hasBibLangId(e.document.languageId) &&
            !lw_1.lw.file.hasDtxLangId(e.document.languageId)) {
            return;
        }
        lw_1.lw.event.fire(lw_1.lw.event.DocumentChanged);
        lw_1.lw.lint.latex.on(e.document);
        lw_1.lw.cache.refreshCacheAggressive(e.document.fileName);
    }));
    extensionContext.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
        if (lw_1.lw.file.hasTeXLangId(e.textEditor.document.languageId) ||
            lw_1.lw.file.hasBibLangId(e.textEditor.document.languageId) ||
            lw_1.lw.file.hasDtxLangId(e.textEditor.document.languageId)) {
            return lw_1.lw.outline.reveal(e);
        }
        return;
    }));
    registerProviders(extensionContext);
    void lw_1.lw.root.find().then(() => {
        lw_1.lw.lint.latex.root();
        if (lw_1.lw.file.hasTeXLangId(vscode.window.activeTextEditor?.document.languageId ?? '')) {
            lw_1.lw.previousActive = vscode.window.activeTextEditor;
        }
    });
    conflictCheck();
    logger.log('LaTeX Workshop initialized.');
}
function registerLatexWorkshopCommands(extensionContext) {
    extensionContext.subscriptions.push(vscode.commands.registerCommand('latex-workshop.hostPort', () => lw_1.lw.commands.hostPort()), vscode.commands.registerCommand('latex-workshop.saveWithoutBuilding', () => lw_1.lw.commands.saveActive()), vscode.commands.registerCommand('latex-workshop.build', () => lw_1.lw.commands.build()), vscode.commands.registerCommand('latex-workshop.recipes', (recipe) => lw_1.lw.commands.recipes(recipe)), vscode.commands.registerCommand('latex-workshop.view', (uri) => lw_1.lw.commands.view(uri)), vscode.commands.registerCommand('latex-workshop.refresh-viewer', () => lw_1.lw.commands.refresh()), vscode.commands.registerCommand('latex-workshop.tab', () => lw_1.lw.commands.view('tab')), vscode.commands.registerCommand('latex-workshop.viewInBrowser', () => lw_1.lw.commands.view('browser')), vscode.commands.registerCommand('latex-workshop.viewExternal', () => lw_1.lw.commands.view('external')), vscode.commands.registerCommand('latex-workshop.kill', () => lw_1.lw.commands.kill()), vscode.commands.registerCommand('latex-workshop.synctex', () => lw_1.lw.commands.synctex()), vscode.commands.registerCommand('latex-workshop.texdoc', (packageName) => lw_1.lw.commands.texdoc(packageName)), vscode.commands.registerCommand('latex-workshop.texdocUsepackages', () => lw_1.lw.commands.texdocUsepackages()), vscode.commands.registerCommand('latex-workshop.synctexto', (line, filePath) => lw_1.lw.commands.synctexonref(line, filePath)), vscode.commands.registerCommand('latex-workshop.clean', () => lw_1.lw.commands.clean()), vscode.commands.registerCommand('latex-workshop.actions', () => lw_1.lw.commands.actions()), vscode.commands.registerCommand('latex-workshop.activate', () => undefined), vscode.commands.registerCommand('latex-workshop.citation', () => lw_1.lw.commands.citation()), vscode.commands.registerCommand('latex-workshop.addtexroot', () => lw_1.lw.commands.addTexRoot()), vscode.commands.registerCommand('latex-workshop.wordcount', () => lw_1.lw.commands.wordcount()), vscode.commands.registerCommand('latex-workshop.log', () => lw_1.lw.commands.showLog()), vscode.commands.registerCommand('latex-workshop.compilerlog', () => lw_1.lw.commands.showLog('compiler')), vscode.commands.registerCommand('latex-workshop.code-action', (d, r, c, m) => lw_1.lw.lint.latex.action(d, r, c, m)), vscode.commands.registerCommand('latex-workshop.goto-section', (filePath, lineNumber) => lw_1.lw.commands.gotoSection(filePath, lineNumber)), vscode.commands.registerCommand('latex-workshop.navigate-envpair', () => lw_1.lw.commands.navigateToEnvPair()), vscode.commands.registerCommand('latex-workshop.select-envcontent', () => lw_1.lw.commands.selectEnvContent('content')), vscode.commands.registerCommand('latex-workshop.select-env', () => lw_1.lw.commands.selectEnvContent('whole')), vscode.commands.registerCommand('latex-workshop.select-envname', () => lw_1.lw.commands.selectEnvName()), vscode.commands.registerCommand('latex-workshop.multicursor-envname', () => lw_1.lw.commands.multiCursorEnvName()), vscode.commands.registerCommand('latex-workshop.toggle-equation-envname', () => lw_1.lw.commands.toggleEquationEnv()), vscode.commands.registerCommand('latex-workshop.close-env', () => lw_1.lw.commands.closeEnv()), vscode.commands.registerCommand('latex-workshop.wrap-env', () => lw_1.lw.commands.insertSnippet('wrapEnv')), vscode.commands.registerCommand('latex-workshop.onEnterKey', () => lw_1.lw.commands.onEnterKey()), vscode.commands.registerCommand('latex-workshop.onAltEnterKey', () => lw_1.lw.commands.onEnterKey('alt')), vscode.commands.registerCommand('latex-workshop.revealOutputDir', () => lw_1.lw.commands.revealOutputDir()), vscode.commands.registerCommand('latex-workshop.changeHostName', () => lw_1.lw.commands.changeHostName()), vscode.commands.registerCommand('latex-workshop.resetHostName', () => lw_1.lw.commands.resetHostName()), vscode.commands.registerCommand('latex-workshop-dev.parselog', () => lw_1.lw.commands.devParseLog()), vscode.commands.registerCommand('latex-workshop-dev.parsetex', () => lw_1.lw.commands.devParseTeX()), vscode.commands.registerCommand('latex-workshop-dev.parsebib', () => lw_1.lw.commands.devParseBib()), vscode.commands.registerCommand('latex-workshop-dev.striptext', () => lw_1.lw.commands.devStripText()), vscode.commands.registerCommand('latex-workshop.shortcut.item', () => lw_1.lw.commands.insertSnippet('item')), vscode.commands.registerCommand('latex-workshop.shortcut.emph', () => lw_1.lw.commands.toggleSelectedKeyword('emph')), vscode.commands.registerCommand('latex-workshop.shortcut.textbf', () => lw_1.lw.commands.toggleSelectedKeyword('textbf')), vscode.commands.registerCommand('latex-workshop.shortcut.textit', () => lw_1.lw.commands.toggleSelectedKeyword('textit')), vscode.commands.registerCommand('latex-workshop.shortcut.underline', () => lw_1.lw.commands.toggleSelectedKeyword('underline')), vscode.commands.registerCommand('latex-workshop.shortcut.textrm', () => lw_1.lw.commands.toggleSelectedKeyword('textrm')), vscode.commands.registerCommand('latex-workshop.shortcut.texttt', () => lw_1.lw.commands.toggleSelectedKeyword('texttt')), vscode.commands.registerCommand('latex-workshop.shortcut.textsl', () => lw_1.lw.commands.toggleSelectedKeyword('textsl')), vscode.commands.registerCommand('latex-workshop.shortcut.textsc', () => lw_1.lw.commands.toggleSelectedKeyword('textsc')), vscode.commands.registerCommand('latex-workshop.shortcut.textnormal', () => lw_1.lw.commands.toggleSelectedKeyword('textnormal')), vscode.commands.registerCommand('latex-workshop.shortcut.textsuperscript', () => lw_1.lw.commands.toggleSelectedKeyword('textsuperscript')), vscode.commands.registerCommand('latex-workshop.shortcut.textsubscript', () => lw_1.lw.commands.toggleSelectedKeyword('textsubscript')), vscode.commands.registerCommand('latex-workshop.shortcut.mathbf', () => lw_1.lw.commands.toggleSelectedKeyword('mathbf')), vscode.commands.registerCommand('latex-workshop.shortcut.mathit', () => lw_1.lw.commands.toggleSelectedKeyword('mathit')), vscode.commands.registerCommand('latex-workshop.shortcut.mathrm', () => lw_1.lw.commands.toggleSelectedKeyword('mathrm')), vscode.commands.registerCommand('latex-workshop.shortcut.mathtt', () => lw_1.lw.commands.toggleSelectedKeyword('mathtt')), vscode.commands.registerCommand('latex-workshop.shortcut.mathsf', () => lw_1.lw.commands.toggleSelectedKeyword('mathsf')), vscode.commands.registerCommand('latex-workshop.shortcut.mathbb', () => lw_1.lw.commands.toggleSelectedKeyword('mathbb')), vscode.commands.registerCommand('latex-workshop.shortcut.mathcal', () => lw_1.lw.commands.toggleSelectedKeyword('mathcal')), vscode.commands.registerCommand('latex-workshop.surround', () => lw_1.lw.completion.macro.surround()), vscode.commands.registerCommand('latex-workshop.promote-sectioning', () => lw_1.lw.commands.shiftSectioningLevel('promote')), vscode.commands.registerCommand('latex-workshop.demote-sectioning', () => lw_1.lw.commands.shiftSectioningLevel('demote')), vscode.commands.registerCommand('latex-workshop.select-section', () => lw_1.lw.commands.selectSection()), vscode.commands.registerCommand('latex-workshop.bibsort', () => lw_1.lw.lint.bibtex.format(true, false)), vscode.commands.registerCommand('latex-workshop.bibalign', () => lw_1.lw.lint.bibtex.format(false, true)), vscode.commands.registerCommand('latex-workshop.bibalignsort', () => lw_1.lw.lint.bibtex.format(true, true)), vscode.commands.registerCommand('latex-workshop.checkcitations', () => lw_1.lw.commands.checkCitations()), vscode.commands.registerCommand('latex-workshop.openMathPreviewPanel', () => lw_1.lw.commands.openMathPreviewPanel()), vscode.commands.registerCommand('latex-workshop.closeMathPreviewPanel', () => lw_1.lw.commands.closeMathPreviewPanel()), vscode.commands.registerCommand('latex-workshop.toggleMathPreviewPanel', () => lw_1.lw.commands.toggleMathPreviewPanel()));
}
function registerProviders(extensionContext) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    // According to cmhughes/latexindent.pl, it aims to beautify .tex, .sty and .cls files.
    const latexindentSelector = selectDocumentsWithId(['tex', 'latex', 'latex-expl3']);
    const latexSelector = selectDocumentsWithId(['latex', 'latex-expl3', 'pweave', 'jlweave', 'rsweave']);
    const weaveSelector = selectDocumentsWithId(['pweave', 'jlweave', 'rsweave']);
    const latexDoctexSelector = selectDocumentsWithId(['latex', 'latex-expl3', 'pweave', 'jlweave', 'rsweave', 'doctex']);
    const bibtexSelector = selectDocumentsWithId(['bibtex']);
    extensionContext.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(latexindentSelector, lw_1.lw.lint.latex.formatter), vscode.languages.registerDocumentFormattingEditProvider(bibtexSelector, lw_1.lw.lint.bibtex.formatter), vscode.languages.registerDocumentRangeFormattingEditProvider(latexindentSelector, lw_1.lw.lint.latex.formatter), vscode.languages.registerDocumentRangeFormattingEditProvider(bibtexSelector, lw_1.lw.lint.bibtex.formatter));
    extensionContext.subscriptions.push(vscode.window.registerWebviewPanelSerializer('latex-workshop-pdf', lw_1.lw.viewer.serializer), vscode.window.registerCustomEditorProvider('latex-workshop-pdf-hook', lw_1.lw.viewer.hook, { supportsMultipleEditorsPerDocument: true, webviewOptions: { retainContextWhenHidden: true } }), vscode.window.registerWebviewPanelSerializer('latex-workshop-mathpreview', lw_1.lw.preview.mathpreview.serializer));
    extensionContext.subscriptions.push(vscode.languages.registerHoverProvider(latexSelector, lw_1.lw.preview.provider), vscode.languages.registerDefinitionProvider(latexSelector, lw_1.lw.language.definition), vscode.languages.registerDocumentSymbolProvider(latexSelector, lw_1.lw.language.docSymbol), vscode.languages.registerDocumentSymbolProvider(bibtexSelector, lw_1.lw.language.docSymbol), vscode.languages.registerDocumentSymbolProvider(selectDocumentsWithId(['doctex']), lw_1.lw.language.docSymbol), vscode.languages.registerWorkspaceSymbolProvider(lw_1.lw.language.projectSymbol));
    extensionContext.subscriptions.push(vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'tex' }, lw_1.lw.completion.provider, '\\', '{'), vscode.languages.registerCompletionItemProvider({ scheme: 'vsls', language: 'tex' }, lw_1.lw.completion.provider, '\\', '{'), vscode.languages.registerCompletionItemProvider(bibtexSelector, lw_1.lw.completion.bibProvider, '@'));
    let triggerDisposable;
    const registerTrigger = () => {
        const userTriggersLatex = configuration.get('intellisense.triggers.latex');
        const latexTriggers = ['\\', ',', '{', '}'].concat(userTriggersLatex);
        logger.log(`Trigger characters for intellisense of LaTeX documents: ${JSON.stringify(latexTriggers)}`);
        triggerDisposable = vscode.languages.registerCompletionItemProvider(latexDoctexSelector, lw_1.lw.completion.provider, ...latexTriggers);
        extensionContext.subscriptions.push(triggerDisposable);
    };
    registerTrigger();
    lw_1.lw.onConfigChange('intellisense.triggers.latex', () => {
        if (triggerDisposable) {
            triggerDisposable.dispose();
            triggerDisposable = undefined;
        }
        registerTrigger();
    });
    let atSuggestionDisposable;
    const registerAtSuggestion = () => {
        const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex');
        if (atSuggestionLatexTrigger !== '') {
            lw_1.lw.completion.atProvider.updateTrigger();
            atSuggestionDisposable = vscode.languages.registerCompletionItemProvider(latexDoctexSelector, lw_1.lw.completion.atProvider, atSuggestionLatexTrigger);
            extensionContext.subscriptions.push(atSuggestionDisposable);
        }
    };
    registerAtSuggestion();
    lw_1.lw.onConfigChange('intellisense.atSuggestion.trigger.latex', () => {
        if (atSuggestionDisposable) {
            atSuggestionDisposable.dispose();
            atSuggestionDisposable = undefined;
        }
        registerAtSuggestion();
    });
    extensionContext.subscriptions.push(vscode.languages.registerCodeActionsProvider(latexSelector, lw_1.lw.lint.latex.actionprovider), vscode.languages.registerFoldingRangeProvider(latexSelector, lw_1.lw.language.folding), vscode.languages.registerFoldingRangeProvider(weaveSelector, lw_1.lw.language.weaveFolding), vscode.languages.registerFoldingRangeProvider(latexDoctexSelector, lw_1.lw.language.doctexFolding));
    const selectionLatex = configuration.get('selection.smart.latex.enabled', true);
    if (selectionLatex) {
        extensionContext.subscriptions.push(vscode.languages.registerSelectionRangeProvider({ language: 'latex' }, lw_1.lw.language.selectionRage));
    }
    extensionContext.subscriptions.push(vscode.window.registerWebviewViewProvider('latex-workshop-snippet-view', lw_1.lw.extra.snippet.provider, { webviewOptions: { retainContextWhenHidden: true } }));
}
function conflictCheck() {
    function check(ID, name, suggestion) {
        if (vscode.extensions.getExtension(ID) !== undefined) {
            void vscode.window.showWarningMessage(`LaTeX Workshop is incompatible with  "${name}". ${suggestion}`);
        }
    }
    check('tomoki1207.pdf', 'vscode-pdf', 'We compete when opening a PDF file from the sidebar. Please consider disabling either extension.');
}
function selectDocumentsWithId(ids) {
    const selector = ids.map((id) => {
        return { scheme: lw_1.lw.file.toUri('').scheme, language: id };
    });
    return selector;
}
//# sourceMappingURL=main.js.map