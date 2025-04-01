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
exports.construct = construct;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const latex_1 = require("./latex");
const logger = lw_1.lw.log('Structure', 'DocTeX');
async function construct(document) {
    const content = document.getText();
    if (!content) {
        return [];
    }
    const docContent = getDoc(content);
    const sections = await getToC(document, docContent);
    return sections;
}
function getDoc(content) {
    const mode = ['NORMAL'];
    const comment = /(^|[^\\]|(?:(?<!\\)(?:\\\\)+))\^\^A.*$/gm;
    return content.split('\n').map(line => {
        if (line.match(/%\s*\^\^A/)) {
            return '';
        }
        else if (line.match(/%\s*\\iffalse/)) {
            mode.push('COMMENT');
        }
        else if (line.match(/%\s*\\fi/) && mode[mode.length - 1] === 'COMMENT') {
            mode.pop();
        }
        else if (mode[mode.length - 1] === 'COMMENT') {
            return '';
        }
        else if (line.startsWith('%%')) {
            return '';
        }
        else if (line.startsWith('%    \\begin{macrocode}')) {
            mode.push('MACROCODE');
        }
        else if (line.startsWith('%    \\end{macrocode}') && mode[mode.length - 1] === 'MACROCODE') {
            mode.pop();
        }
        else if (mode[mode.length - 1] === 'MACROCODE') {
            return '';
        }
        else if (line.startsWith('%')) {
            return line.slice(1).replace(comment, '$1').replaceAll('\\verb', '');
        }
        return '';
    }).join('\n');
}
async function getToC(document, docContent) {
    const ast = await lw_1.lw.parser.parse.tex(docContent);
    if (ast === undefined) {
        logger.log('Failed parsing LaTeX AST.');
        return [];
    }
    const config = latex_1.outline.refreshLaTeXModelConfig(false, ['macro', 'environment']);
    const root = { children: [] };
    let inAppendix = false;
    for (const node of ast.content) {
        if (await latex_1.outline.parseNode(node, [], root, document.fileName, config, {}, inAppendix)) {
            inAppendix = true;
        }
    }
    let struct = root.children;
    struct = latex_1.outline.nestNonSection(struct);
    struct = latex_1.outline.nestSection(struct, config);
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    if (configuration.get('view.outline.floats.number.enabled')) {
        struct = latex_1.outline.addFloatNumber(struct);
    }
    if (configuration.get('view.outline.numbers.enabled')) {
        struct = latex_1.outline.addSectionNumber(struct, config);
    }
    return struct;
}
//# sourceMappingURL=doctex.js.map