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
exports.parser = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const workerpool = __importStar(require("workerpool"));
const lw_1 = require("../lw");
const unified_defs_1 = require("./parser/unified-defs");
const bibtexlog_1 = require("./parser/bibtexlog");
const biberlog_1 = require("./parser/biberlog");
const latexlog_1 = require("./parser/latexlog");
// @ts-expect-error Load unified.js from /out/src/...
const unified_js_1 = require("../../../resources/unified.js");
const logger = lw_1.lw.log('Parser');
const bibDiagnostics = vscode.languages.createDiagnosticCollection('BibTeX');
exports.parser = {
    bib,
    log,
    tex,
    args,
    stringify,
    reset
};
const pool = workerpool.pool(path.join(__dirname, 'parser', 'unified.js'), { minWorkers: 1, maxWorkers: 1, workerType: 'thread' });
const proxy = pool.proxy();
lw_1.lw.onDispose({ dispose: async () => { await pool.terminate(true); } });
async function tex(content) {
    return (await proxy).parseLaTeX(content);
}
async function args(ast) {
    return (await proxy).parseArgs(ast, (0, unified_defs_1.getMacroDefs)());
}
async function reset() {
    return (await proxy).reset((0, unified_defs_1.getMacroDefs)(), (0, unified_defs_1.getEnvDefs)());
}
async function bib(uri, s) {
    const ast = await (await proxy).parseBibTeX(s);
    if (typeof ast === 'string') {
        const err = JSON.parse(ast);
        logger.log(`Error when parsing bib file: found ${err.found} from ${err.location.start.line}:${err.location.start.column} to ${err.location.end.line}:${err.location.end.column}.`);
        bibDiagnostics.set(uri, [new vscode.Diagnostic(new vscode.Range(new vscode.Position(err.location.start.line - 1, err.location.start.column - 1), new vscode.Position(err.location.end.line - 1, err.location.end.column - 1)), `A BibTeX parsing error occurred. "${err.found}" is unexpected here. No BibTeX entries will be available.`, vscode.DiagnosticSeverity.Warning)]);
        return undefined;
    }
    else {
        bibDiagnostics.set(uri, []);
        return ast;
    }
}
function stringify(ast) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return (0, unified_js_1.toString)(ast);
}
// Notice that 'Output written on filename.pdf' isn't output in draft mode.
// https://github.com/James-Yu/LaTeX-Workshop/issues/2893#issuecomment-936312853
const latexPattern = /^Output\swritten\son\s(.*)\s\(.*\)\.$/gm;
const latexFatalPattern = /Fatal error occurred, no output PDF file produced!/gm;
const latexXeNoOutputPattern = /^No pages of output.$/gm;
const latexmkPattern = /^Latexmk:\sapplying\srule/gm;
const latexmkLog = /^Latexmk:\sapplying\srule/;
const latexmkLogLatex = /^Latexmk:\sapplying\srule\s'(pdf|lua|xe)?latex'/;
const latexmkUpToDate = /^Latexmk: All targets \(.*\) are up-to-date/m;
const texifyPattern = /^running\s(pdf|lua|xe)?latex/gm;
const texifyLog = /^running\s((pdf|lua|xe)?latex|miktex-bibtex)/;
const texifyLogLatex = /^running\s(pdf|lua|xe)?latex/;
const bibtexPattern = /^This is BibTeX, Version.*$/m;
const biberPattern = /^INFO - This is Biber .*$/m;
const bibtexPatternAlt = /^The top-level auxiliary file: .*$/m; // #4197
/**
 * @param msg The log message to parse.
 * @param rootFile The current root file.
 * @returns whether the current compilation is indeed a skipped one in latexmk.
 */
function log(msg, rootFile) {
    let isLaTeXmkSkipped = false;
    // Canonicalize line-endings
    msg = msg.replace(/(\r\n)|\r/g, '\n');
    if (msg.match(bibtexPattern)) {
        bibtexlog_1.bibtexLogParser.parse(msg.match(latexmkPattern) ? trimLaTeXmkBibTeX(msg) : msg, rootFile);
        bibtexlog_1.bibtexLogParser.showLog();
    }
    else if (msg.match(biberPattern)) {
        biberlog_1.biberLogParser.parse(msg.match(latexmkPattern) ? trimLaTeXmkBiber(msg) : msg, rootFile);
        biberlog_1.biberLogParser.showLog();
    }
    else if (msg.match(bibtexPatternAlt)) {
        bibtexlog_1.bibtexLogParser.parse(msg.match(latexmkPattern) ? trimLaTeXmkBibTeX(msg) : msg, rootFile);
        bibtexlog_1.bibtexLogParser.showLog();
    }
    if (msg.match(latexmkPattern)) {
        msg = trimLaTeXmk(msg);
    }
    else if (msg.match(texifyPattern)) {
        msg = trimTexify(msg);
    }
    if (msg.match(latexPattern) || msg.match(latexFatalPattern) || msg.match(latexXeNoOutputPattern)) {
        latexlog_1.latexLogParser.parse(msg, rootFile);
        latexlog_1.latexLogParser.showLog();
    }
    else if (latexmkSkipped(msg)) {
        isLaTeXmkSkipped = true;
    }
    return isLaTeXmkSkipped;
}
function trimLaTeXmk(msg) {
    return trimPattern(msg, latexmkLogLatex, latexmkLog);
}
function trimLaTeXmkBibTeX(msg) {
    return trimPattern(msg, bibtexPattern, latexmkLogLatex);
}
function trimLaTeXmkBiber(msg) {
    return trimPattern(msg, biberPattern, latexmkLogLatex);
}
function trimTexify(msg) {
    return trimPattern(msg, texifyLogLatex, texifyLog);
}
/**
 * Return the lines between the last occurrences of `beginPattern` and `endPattern`.
 * If `endPattern` is not found, the lines from the last occurrence of
 * `beginPattern` up to the end is returned.
 */
function trimPattern(msg, beginPattern, endPattern) {
    const lines = msg.split('\n');
    let startLine = -1;
    let finalLine = -1;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        let result = line.match(beginPattern);
        if (result) {
            startLine = index;
        }
        result = line.match(endPattern);
        if (result) {
            finalLine = index;
        }
    }
    if (finalLine <= startLine) {
        return lines.slice(startLine).join('\n');
    }
    else {
        return lines.slice(startLine, finalLine).join('\n');
    }
}
function latexmkSkipped(msg) {
    if (msg.match(latexmkUpToDate) && !msg.match(latexmkPattern)) {
        latexlog_1.latexLogParser.showLog();
        bibtexlog_1.bibtexLogParser.showLog();
        biberlog_1.biberLogParser.showLog();
        return true;
    }
    return false;
}
//# sourceMappingURL=parser.js.map