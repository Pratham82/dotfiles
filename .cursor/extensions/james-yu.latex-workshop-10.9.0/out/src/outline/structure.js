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
exports.outline = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const latex_1 = require("./structure/latex");
const bibtex_1 = require("./structure/bibtex");
const doctex_1 = require("./structure/doctex");
const logger = lw_1.lw.log('Structure');
exports.outline = {
    reconstruct,
    refresh,
    reveal
};
lw_1.lw.onConfigChange(['view.outline.sections', 'view.outline.commands'], async () => {
    await lw_1.lw.parser.parse.reset();
    lw_1.lw.cache.paths().forEach(async (filePath) => {
        const ast = lw_1.lw.cache.get(filePath)?.ast;
        if (ast) {
            await lw_1.lw.parser.parse.args(ast);
        }
    });
    void reconstruct();
});
async function reconstruct() {
    state.structure = await build(true);
    state.treeDataProvider.structureChanged.fire(undefined);
    lw_1.lw.event.fire(lw_1.lw.event.StructureUpdated);
    return state.structure;
}
async function refresh(fireChangedEvent = true) {
    state.structure = await build(false);
    if (fireChangedEvent) {
        state.treeDataProvider.structureChanged.fire(undefined);
        lw_1.lw.event.fire(lw_1.lw.event.StructureUpdated);
    }
    return state.structure;
}
function reveal(e) {
    if (!vscode.workspace.getConfiguration('latex-workshop').get('view.outline.follow.editor') || !state.view.visible) {
        return;
    }
    const line = e.selections[0].active.line;
    const f = e.textEditor.document.fileName;
    const currentNode = traverseSectionTree(state.structure, f, line);
    return currentNode ? state.view.reveal(currentNode, { select: true }) : undefined;
}
/**
 * Return the latex or bibtex structure
 *
 * @param force If `false` and some cached data exists for the corresponding file, use it. If `true`, always recompute the structure from disk
 */
async function build(force) {
    const document = vscode.window.activeTextEditor?.document;
    if (document?.languageId === 'doctex') {
        if (force || !state.cachedDTX || getCachedDataRootFileName(state.cachedDTX) !== document.fileName) {
            state.cachedDTX = undefined;
            state.cachedDTX = await (0, doctex_1.construct)(document);
            logger.log(`Structure ${force ? 'force ' : ''}updated with ${state.structure.length} entries for ${document.uri.fsPath} .`);
        }
        state.structure = state.cachedDTX;
    }
    else if (document?.languageId === 'bibtex') {
        if (force || !state.cachedBib || getCachedDataRootFileName(state.cachedBib) !== document.fileName) {
            state.cachedBib = undefined;
            state.cachedBib = await (0, bibtex_1.buildBibTeX)(document);
            logger.log(`Structure ${force ? 'force ' : ''}updated with ${state.structure.length} entries for ${document.uri.fsPath} .`);
        }
        state.structure = state.cachedBib;
    }
    else if (lw_1.lw.root.file.path) {
        if (force || !state.cachedTeX) {
            state.cachedTeX = undefined;
            state.cachedTeX = await (0, latex_1.construct)();
            logger.log(`Structure ${force ? 'force ' : ''}updated with ${state.structure.length} root sections for ${lw_1.lw.root.file.path} .`);
        }
        state.structure = state.cachedTeX;
    }
    else {
        state.structure = [];
        logger.log('Structure cleared on undefined root.');
    }
    return state.structure;
}
function getCachedDataRootFileName(sections) {
    return sections[0]?.filePath;
}
function getChildPaths(section, paths = new Set()) {
    section.children.forEach(child => {
        paths.add(child.filePath);
        getChildPaths(child, paths);
    });
    return paths;
}
function traverseSectionTree(sections, filePath, lineNo) {
    for (const node of sections) {
        if ((node.filePath === filePath &&
            node.lineFr <= lineNo && node.lineTo >= lineNo) ||
            (node.filePath !== filePath && getChildPaths(node).has(filePath))) {
            // Look for a more precise surrounding section
            return traverseSectionTree(node.children, filePath, lineNo) ?? node;
        }
    }
    return undefined;
}
class StructureProvider {
    constructor() {
        this.structureChanged = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.structureChanged.event;
    }
    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(element.label, element.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded :
            vscode.TreeItemCollapsibleState.None);
        treeItem.command = {
            command: 'latex-workshop.goto-section',
            title: '',
            arguments: [element.filePath, element.lineFr]
        };
        treeItem.tooltip = `Line ${element.lineFr + 1} at ${element.filePath}`;
        return treeItem;
    }
    getChildren(element) {
        if (lw_1.lw.root.file.path === undefined) {
            return [];
        }
        return element?.children ?? refresh(false);
    }
    getParent(element) {
        if (lw_1.lw.root.file.path === undefined || !element) {
            return;
        }
        return element.parent;
    }
}
const treeDataProvider = new StructureProvider();
const state = {
    structure: [],
    cachedTeX: undefined,
    cachedBib: undefined,
    cachedDTX: undefined,
    view: vscode.window.createTreeView('latex-workshop-structure', { treeDataProvider, showCollapseAll: true }),
    treeDataProvider
};
//# sourceMappingURL=structure.js.map