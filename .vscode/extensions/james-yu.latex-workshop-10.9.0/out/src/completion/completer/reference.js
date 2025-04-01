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
exports.reference = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lw_1 = require("../../lw");
const utils_1 = require("../../utils/utils");
const completerutils_1 = require("./completerutils");
const parser_1 = require("../../utils/parser");
exports.provider = { from };
exports.reference = {
    parse,
    getItem,
    setNumbersFromAuxFile
};
lw_1.lw.onConfigChange(['intellisense.label.command'], lw_1.lw.parser.parse.reset);
const data = {
    suggestions: new Map(),
    prevIndexObj: new Map()
};
function from(_result, args) {
    return provide(args.line, args.position);
}
function provide(line, position) {
    // Compile the suggestion object to array
    updateAll(line, position);
    let keys = [...data.suggestions.keys(), ...data.prevIndexObj.keys()];
    keys = Array.from(new Set(keys));
    const items = [];
    for (const key of keys) {
        items.push(data.suggestions.get(key) ?? { label: key });
    }
    return items;
}
function getItem(token) {
    updateAll();
    return data.suggestions.get(token);
}
function updateAll(line, position) {
    if (!lw_1.lw.root.file.path) {
        data.suggestions.clear();
        return;
    }
    const included = new Set([lw_1.lw.root.file.path]);
    // Included files may originate from \input or `xr`. If the latter, a
    // prefix may be used to ref to the file. The following obj holds them.
    const prefixes = {};
    while (true) {
        // The process adds newly included file recursively, only stops when
        // all have been found, i.e., no new ones
        const startSize = included.size;
        included.forEach(cachedFile => {
            lw_1.lw.cache.getIncludedTeX(cachedFile).forEach(includedTeX => {
                if (includedTeX === cachedFile) {
                    return;
                }
                included.add(includedTeX);
                // If the file is indeed included by \input, but was
                // previously included by `xr`, the possible prefix is
                // removed as it can be directly referenced without.
                delete prefixes[includedTeX];
            });
            const cache = lw_1.lw.cache.get(cachedFile);
            if (!cache) {
                return;
            }
            Object.keys(cache.external).forEach(external => {
                // Don't repeatedly add, no matter previously by \input or
                // `xr`
                if (included.has(external)) {
                    return;
                }
                // If the file is included by `xr`, both file path and
                // prefix is recorded.
                included.add(external);
                prefixes[external] = cache.external[external];
            });
        });
        if (included.size === startSize) {
            break;
        }
    }
    // Extract cached references
    const refList = [];
    let range = undefined;
    if (line && position) {
        range = (0, completerutils_1.computeFilteringRange)(line, position);
    }
    included.forEach(cachedFile => {
        const cachedRefs = lw_1.lw.cache.get(cachedFile)?.elements.reference;
        if (cachedRefs === undefined) {
            return;
        }
        cachedRefs.forEach(ref => {
            if (ref.range === undefined) {
                return;
            }
            const label = (cachedFile in prefixes ? prefixes[cachedFile] : '') + ref.label;
            data.suggestions.set(label, { ...ref,
                label,
                range,
                prevIndex: data.prevIndexObj.get(label)
            });
            refList.push(label);
        });
    });
    // Remove references that have been deleted
    data.suggestions.forEach((_, key) => {
        if (!refList.includes(key)) {
            data.suggestions.delete(key);
        }
    });
}
function parse(cache) {
    if (cache.ast !== undefined) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const labelMacros = configuration.get('intellisense.label.command');
        cache.elements.reference = parseAst(cache.ast, [], cache.filePath, cache.content.split('\n'), labelMacros);
    }
    else {
        cache.elements.reference = parseContent(cache.content, cache.filePath);
    }
}
function parseAst(node, nodeStack, filePath, lines, labelMacros) {
    let refs = [];
    if (node.type === 'macro' &&
        ['renewcommand', 'newcommand', 'providecommand', 'DeclareMathOperator', 'renewenvironment', 'newenvironment',
            'NewDocumentCommand', 'RenewDocumentCommand', 'ProvideDocumentCommand', 'DeclareDocumentCommand',
            'NewDocumentEnvironment', 'RenewDocumentEnvironment', 'ProvideDocumentEnvironment', 'DeclareDocumentEnvironment',
            'NewExpandableDocumentCommand', 'RenewExpandableDocumentCommand', 'ProvideExpandableDocumentCommand', 'DeclareExpandableDocumentCommand',
            'newrobustcmd', 'renewrobustcmd', 'providerobustcmd'
        ].includes(node.content)) {
        // Do not scan labels inside \newcommand, \newenvironment & co
        return [];
    }
    if (node.type === 'environment' && ['tikzpicture'].includes(node.env)) {
        return [];
    }
    let label = '';
    if (node.type === 'macro' && labelMacros.includes(node.content)) {
        label = (0, parser_1.argContentToStr)(node.args?.[2]?.content || []);
    }
    else if (node.type === 'environment') {
        label = (0, parser_1.argContentToStr)(node.args?.[1]?.content || []);
        const index = label.indexOf('label=');
        if (index >= 0) {
            label = label.slice(index + 6);
            if (label.charAt(0) === '{') {
                label = (0, utils_1.getLongestBalancedString)(label) ?? '';
            }
            else {
                label = label.split(',')[0] ?? '';
            }
        }
        else {
            label = '';
        }
    }
    if (label !== '' && node.position !== undefined) {
        const ref = {
            label,
            kind: vscode.CompletionItemKind.Reference,
            // One row before, four rows after
            documentation: lines.slice(node.position.start.line - 2, node.position.end.line + 4).join('\n'),
            // Here we abuse the definition of range to store the location of the reference definition
            range: new vscode.Range(node.position.start.line - 1, node.position.start.column - 1, node.position.end.line - 1, node.position.end.column - 1),
            file: filePath,
            position: new vscode.Position(node.position.start.line - 1, node.position.start.column - 1),
            math: findMath(nodeStack)
        };
        refs.push(ref);
    }
    const parseContentNodes = (content) => {
        for (const subNode of content) {
            refs = [...refs, ...parseAst(subNode, [...nodeStack, node], filePath, lines, labelMacros)];
        }
    };
    if (node.type === 'macro' && node.args) {
        for (const arg of node.args) {
            parseContentNodes(arg.content);
        }
    }
    else if ('content' in node && typeof node.content !== 'string') {
        parseContentNodes(node.content);
    }
    return refs;
}
function findMath(nodeStack) {
    const node = nodeStack[nodeStack.length - 1];
    if (node.type !== 'environment' && node.type !== 'mathenv') {
        return;
    }
    const env = (typeof node.env === 'string') ? node.env : node.env.content;
    if (![
        'align', 'align\\*', 'alignat', 'alignat\\*', 'aligned', 'alignedat', 'array', 'Bmatrix', 'bmatrix', 'cases', 'CD', 'eqnarray', 'eqnarray\\*', 'equation', 'equation\\*', 'flalign', 'flalign\\*', 'gather', 'gather\\*', 'gathered', 'matrix', 'multline', 'multline\\*', 'pmatrix', 'smallmatrix', 'split', 'subarray', 'Vmatrix', 'vmatrix'
    ].includes(env)) {
        return;
    }
    const math = lw_1.lw.parser.parse.stringify(node);
    return {
        envname: env,
        range: new vscode.Range((node.position?.start.line ?? 1) - 1, (node.position?.start.column ?? 1) - 1, (node.position?.end.line ?? 1) - 1, (node.position?.end.column ?? 1) - 1),
        texString: math
    };
}
function parseContent(content, filePath) {
    const refReg = /(?:\\label(?:\[[^[\]{}]*\])?|(?:^|[,\s])label=){([^#\\}]*)}/gm;
    const refs = [];
    const refList = [];
    content = (0, utils_1.stripEnvironments)(content, ['']);
    while (true) {
        const result = refReg.exec(content);
        if (result === null) {
            break;
        }
        if (refList.includes(result[1])) {
            continue;
        }
        const prevContent = content.substring(0, content.substring(0, result.index).lastIndexOf('\n') - 1);
        const followLength = content.substring(result.index, content.length).split('\n', 4).join('\n').length;
        const positionContent = content.substring(0, result.index).split('\n');
        refs.push({
            label: result[1],
            kind: vscode.CompletionItemKind.Reference,
            // One row before, four rows after
            documentation: content.substring(prevContent.lastIndexOf('\n') + 1, result.index + followLength),
            // Here we abuse the definition of range to store the location of the reference definition
            range: new vscode.Range(positionContent.length - 1, positionContent[positionContent.length - 1].length, positionContent.length - 1, positionContent[positionContent.length - 1].length),
            file: filePath,
            position: new vscode.Position(positionContent.length - 1, positionContent[positionContent.length - 1].length)
        });
        refList.push(result[1]);
    }
    return refs;
}
function setNumbersFromAuxFile(rootFile) {
    const outDir = lw_1.lw.file.getOutDir(rootFile);
    const rootDir = path.dirname(rootFile);
    const auxFile = path.resolve(rootDir, path.join(outDir, path.basename(rootFile, '.tex') + '.aux'));
    data.suggestions.forEach((entry) => {
        entry.prevIndex = undefined;
    });
    data.prevIndexObj = new Map();
    if (!fs.existsSync(auxFile)) {
        return;
    }
    const newLabelReg = /^\\newlabel\{(.*?)\}\{\{(.*?)\}\{(.*?)\}/gm;
    const auxContent = fs.readFileSync(auxFile, { encoding: 'utf8' });
    while (true) {
        const result = newLabelReg.exec(auxContent);
        if (result === null) {
            break;
        }
        if (result[1].endsWith('@cref') && data.prevIndexObj.has(result[1].replace('@cref', ''))) {
            // Drop extra \newlabel entries added by cleveref
            continue;
        }
        data.prevIndexObj.set(result[1], { refNumber: result[2], pageNumber: result[3] });
        const ent = data.suggestions.get(result[1]);
        if (ent) {
            ent.prevIndex = { refNumber: result[2], pageNumber: result[3] };
        }
    }
}
//# sourceMappingURL=reference.js.map