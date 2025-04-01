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
exports.subsuperscript = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const parser_1 = require("../../utils/parser");
exports.provider = { from };
exports.subsuperscript = {
    parse,
};
function from(result, _) {
    if (false === vscode.workspace.getConfiguration('latex-workshop').get('intellisense.subsuperscript.enabled')) {
        return [];
    }
    const isSub = result[0].startsWith('_');
    let suggestions = [];
    lw_1.lw.cache.getIncludedTeX().forEach(cachedFile => {
        suggestions = [...suggestions, ...((isSub ? lw_1.lw.cache.get(cachedFile)?.elements.subscripts : lw_1.lw.cache.get(cachedFile)?.elements.superscripts) ?? [])];
    });
    return suggestions;
}
function parse(cache) {
    if (cache.ast !== undefined) {
        const scripts = parseAst(cache.ast, cache.content.split('\n'), { sub: [], super: [] });
        cache.elements.subscripts = scripts.sub;
        cache.elements.superscripts = scripts.super;
    }
}
function parseAst(node, lines, scripts) {
    const entries = { sub: scripts.sub.map(entry => entry.label), super: scripts.super.map(entry => entry.label) };
    if (node.type === 'macro' && ['^', '_'].includes(node.content)) {
        const content = (0, parser_1.argContentToStr)(node.args?.[0]?.content || []);
        if (content !== '' && node.position !== undefined &&
            !(node.content === '^' ? entries.super : entries.sub).includes(content)) {
            (node.content === '^' ? entries.super : entries.sub).push(content);
            (node.content === '^' ? scripts.super : scripts.sub).push({
                label: content,
                kind: vscode.CompletionItemKind.Constant,
                // One row before, four rows after
                documentation: lines.slice(node.position.start.line - 2, node.position.end.line + 4).join('\n')
            });
        }
    }
    if ('content' in node && typeof node.content !== 'string') {
        for (const subNode of node.content) {
            parseAst(subNode, lines, scripts);
        }
    }
    return scripts;
}
//# sourceMappingURL=subsuperscript.js.map