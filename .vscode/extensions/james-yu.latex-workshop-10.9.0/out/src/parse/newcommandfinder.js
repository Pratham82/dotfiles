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
exports.findMacros = findMacros;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("../lw");
const logger = lw_1.lw.log('Parse', 'Macro');
async function findMacros(ctoken) {
    let macros = '';
    const filepaths = [];
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const macroDefPath = await resolveMacroDefFile(configuration.get('hover.preview.newcommand.newcommandFile'));
    if (macroDefPath !== undefined) {
        filepaths.push(macroDefPath);
        if (lw_1.lw.cache.get(macroDefPath) === undefined) {
            lw_1.lw.cache.add(macroDefPath);
        }
    }
    if (configuration.get('hover.preview.newcommand.parseTeXFile.enabled')) {
        lw_1.lw.cache.getIncludedTeX().forEach(filepath => filepaths.push(filepath));
    }
    for (const filepath of filepaths) {
        if (ctoken?.isCancellationRequested) {
            return '';
        }
        await lw_1.lw.cache.wait(filepath);
        const content = lw_1.lw.cache.get(filepath)?.content;
        const ast = lw_1.lw.cache.get(filepath)?.ast;
        if (content === undefined || ast === undefined) {
            logger.log(`Cannot parse the AST of ${filepath} .`);
        }
        else {
            // #4557 Filter out any macros with #1, #2, etc. as they are not supported by MathJax.
            macros += parseAst(content, ast).filter(macro => !/#\d/.test(macro)).join('\n') + '\n';
        }
    }
    return macros;
}
function parseAst(content, node) {
    let macros = [];
    // \newcommand{\fix}[3][]{\chdeleted{#2}\chadded[comment={#1}]{#3}}
    // \newcommand\WARNING{\textcolor{red}{WARNING}}
    const isNewCommand = node.type === 'macro' &&
        ['newcommand', 'renewcommand', 'newrobustcmd', 'renewrobustcmd'].includes(node.content) &&
        node.args?.[2]?.content?.[0]?.type === 'macro';
    // \DeclarePairedDelimiterX\braketzw[2]{\langle}{\rangle}{#1\,\delimsize\vert\,\mathopen{}#2}
    const isDeclarePairedDelimiter = node.type === 'macro' &&
        ['DeclarePairedDelimiter', 'DeclarePairedDelimiterX', 'DeclarePairedDelimiterXPP'].includes(node.content) &&
        node.args?.[0]?.content?.[0]?.type === 'macro';
    const isProvideCommand = node.type === 'macro' &&
        ['providecommand', 'providerobustcmd', 'DeclareMathOperator', 'DeclareRobustCommand'].includes(node.content) &&
        node.args?.[1]?.content?.[0]?.type === 'macro';
    if (isNewCommand || isDeclarePairedDelimiter || isProvideCommand) {
        macros.push(lw_1.lw.parser.parse.stringify(node)
            // Change providecommand to newcommand
            .replaceAll(/^\\providecommand([^a-zA-Z])/g, '\\newcommand$1')
            // Remove the star as MathJax does not support #4127
            .replaceAll(/^\\([a-zA-Z]+)\*/g, '\\$1'));
    }
    if ('content' in node && typeof node.content !== 'string') {
        for (const subNode of node.content) {
            macros = [...macros, ...parseAst(content, subNode)];
        }
    }
    return macros;
}
async function resolveMacroDefFile(filepath) {
    if (filepath === '') {
        return undefined;
    }
    let filepathAbs;
    if (path.isAbsolute(filepath)) {
        filepathAbs = filepath;
    }
    else {
        if (lw_1.lw.root.file.path === undefined) {
            await lw_1.lw.root.find();
        }
        const rootDir = lw_1.lw.root.dir.path;
        if (rootDir === undefined) {
            logger.log(`Cannot identify the absolute path of macro definition file ${filepath} without root file.`);
            return undefined;
        }
        filepathAbs = path.join(rootDir, filepath);
    }
    if (await lw_1.lw.file.exists(filepathAbs)) {
        return filepathAbs;
    }
    return undefined;
}
//# sourceMappingURL=newcommandfinder.js.map