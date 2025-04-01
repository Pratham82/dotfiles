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
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
lw_1.lw.onConfigChange('latex.recipes', update);
function buildNode(parent, children) {
    if (children.length > 0) {
        parent.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        parent.children = children;
        children.forEach((c) => c.parent = parent);
    }
    return parent;
}
async function buildCommandTree() {
    const commands = [];
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.root.getWorkspace());
    const buildCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.build'), { command: 'latex-workshop.build' }, 'debug-start');
    const recipes = configuration.get('latex.recipes', []);
    const recipeCommands = await Promise.all(recipes.map(async (recipe) => new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.recipe') + `: ${recipe.name}`, { command: 'latex-workshop.recipes', arguments: [recipe.name] }, 'debug-start')));
    let node;
    node = buildNode(buildCommand, [
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.clean'), { command: 'latex-workshop.clean' }, 'clear-all'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.kill'), { command: 'latex-workshop.kill' }, 'debug-stop'),
        ...recipeCommands
    ]);
    commands.push(node);
    const viewCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.view'), { command: 'latex-workshop.view' }, 'open-preview');
    node = buildNode(viewCommand, [
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.viewintab'), { command: 'latex-workshop.view', arguments: ['tab'] }, 'open-preview'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.viewinweb'), { command: 'latex-workshop.view', arguments: ['browser'] }, 'browser'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.viewinexternal'), { command: 'latex-workshop.view', arguments: ['external'] }, 'preview'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.refresh-viewer'), { command: 'latex-workshop.refresh-viewer' }, 'refresh')
    ]);
    commands.push(node);
    const logCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.log'), { command: 'latex-workshop.log' }, 'output');
    const compilerLog = new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.compilerlog'), { command: 'latex-workshop.compilerlog' }, 'output');
    const latexWorkshopLog = new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.log'), { command: 'latex-workshop.log' }, 'output');
    node = buildNode(logCommand, [
        latexWorkshopLog,
        compilerLog
    ]);
    commands.push(node);
    const navCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.navigate'), undefined, 'edit');
    node = buildNode(navCommand, [
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.synctex'), { command: 'latex-workshop.synctex' }, 'go-to-file'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.navigate-envpair'), { command: 'latex-workshop.navigate-envpair' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.select-envcontent'), { command: 'latex-workshop.select-envcontent' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.select-envname'), { command: 'latex-workshop.select-envname' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.close-env'), { command: 'latex-workshop.close-env' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.wrap-env'), { command: 'latex-workshop.wrap-env' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.addtexroot'), { command: 'latex-workshop.addtexroot' })
    ]);
    commands.push(node);
    const miscCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.misc'), undefined, 'menu');
    node = buildNode(miscCommand, [
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.citation'), { command: 'latex-workshop.citation' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.wordcount'), { command: 'latex-workshop.wordcount' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.revealoutput'), { command: 'latex-workshop.revealOutputDir' }, 'folder-opened')
    ]);
    commands.push(node);
    const bibtexCommand = new LaTeXCommand(await lw_1.lw.language.getLocaleString('activity.bibtex'), undefined, 'references');
    node = buildNode(bibtexCommand, [
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.bibalign'), { command: 'latex-workshop.bibalign' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.bibsort'), { command: 'latex-workshop.bibsort' }, 'sort-precedence'),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.bibalignsort'), { command: 'latex-workshop.bibalignsort' }),
        new LaTeXCommand(await lw_1.lw.language.getLocaleString('command.checkcitations'), { command: 'latex-workshop.checkcitations' })
    ]);
    commands.push(node);
    return commands;
}
async function update() {
    state.commands = await buildCommandTree();
    state.treeDataProvider._onDidChangeTreeData.fire(undefined);
}
class CommandProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(element.label, element.collapsibleState);
        treeItem.command = element.command;
        treeItem.iconPath = element.codicon && new vscode.ThemeIcon(element.codicon);
        return treeItem;
    }
    async getChildren(element) {
        if (element) {
            return element.children;
        }
        if (state.commands.length > 0) {
            return state.commands;
        }
        state.commands = await buildCommandTree();
        return state.commands;
    }
    getParent(element) {
        return element.parent;
    }
}
class LaTeXCommand {
    constructor(label, command, codicon) {
        this.label = label;
        this.codicon = codicon;
        this.children = [];
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        if (command) {
            this.command = { ...command, title: '' };
        }
    }
}
const treeDataProvider = new CommandProvider();
const state = {
    commands: [],
    view: vscode.window.createTreeView('latex-workshop-commands', { treeDataProvider, showCollapseAll: true }),
    treeDataProvider
};
//# sourceMappingURL=activity-bar.js.map