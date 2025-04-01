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
exports.bibtexLogParser = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const parserutils_1 = require("./parserutils");
const logger = lw_1.lw.log('Parser', 'BibTeXLog');
const multiLineWarning = /^Warning--(.+)\n--line (\d+) of file (.+)$/gm;
const singleLineWarning = /^Warning--(.+) in ([^\s]+)\s*$/gm;
const multiLineError = /^(.*)---line (\d+) of file (.*)\n([^]+?)\nI'm skipping whatever remains of this entry$/gm;
const badCrossReference = /^(A bad cross reference---entry ".+?"\nrefers to entry.+?, which doesn't exist)$/gm;
const multiLineMacroError = /^(.*)\n?---line (\d+) of file (.*)\n([^]+?)\nI'm skipping whatever remains of this command$/gm;
const errorAuxFile = /^(.*)---while reading file (.*)$/gm;
const bibDiagnostics = vscode.languages.createDiagnosticCollection('BibTeX');
const buildLog = [];
exports.bibtexLogParser = {
    showLog,
    parse
};
function showLog() {
    (0, parserutils_1.showCompilerDiagnostics)(bibDiagnostics, buildLog);
}
function parse(log, rootFile) {
    if (rootFile === undefined) {
        rootFile = lw_1.lw.root.file.path;
    }
    if (rootFile === undefined) {
        logger.log('How can you reach this point?');
        return [];
    }
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    let excludeRegexp;
    try {
        excludeRegexp = configuration.get('message.bibtexlog.exclude').map(regexp => RegExp(regexp));
    }
    catch (e) {
        logger.logError('Invalid message.bibtexlog.exclude config.', e);
        return [];
    }
    buildLog.length = 0;
    let result;
    while ((result = singleLineWarning.exec(log))) {
        const location = findKeyLocation(result[2]);
        if (location) {
            pushLog('warning', location.file, result[1], location.line, excludeRegexp);
        }
    }
    while ((result = multiLineWarning.exec(log))) {
        const filename = resolveBibFile(result[3], rootFile);
        pushLog('warning', filename, result[1], parseInt(result[2], 10), excludeRegexp);
    }
    while ((result = multiLineError.exec(log))) {
        const filename = resolveBibFile(result[3], rootFile);
        pushLog('error', filename, result[1], parseInt(result[2], 10), excludeRegexp);
    }
    while ((result = multiLineMacroError.exec(log))) {
        const filename = resolveBibFile(result[3], rootFile);
        pushLog('error', filename, result[1], parseInt(result[2], 10), excludeRegexp);
    }
    while ((result = badCrossReference.exec(log))) {
        pushLog('error', rootFile, result[1], 1, excludeRegexp);
    }
    while ((result = errorAuxFile.exec(log))) {
        const filename = resolveAuxFile(result[2], rootFile);
        pushLog('error', filename, result[1], 1, excludeRegexp);
    }
    logger.log(`Logged ${buildLog.length} messages.`);
    return buildLog;
}
function pushLog(type, file, message, line, excludeRegexp) {
    for (const regexp of excludeRegexp) {
        if (message.match(regexp)) {
            return;
        }
    }
    buildLog.push({ type, file, text: message, line });
}
function resolveAuxFile(filename, rootFile) {
    filename = filename.replace(/\.aux$/, '.tex');
    if (!lw_1.lw.cache.get(rootFile)) {
        return filename;
    }
    const texFiles = lw_1.lw.cache.getIncludedTeX(rootFile);
    for (const tex of texFiles) {
        if (tex.endsWith(filename)) {
            return tex;
        }
    }
    logger.log(`Cannot resolve file ${filename} .`);
    return filename;
}
function resolveBibFile(filename, rootFile) {
    if (!lw_1.lw.cache.get(rootFile)) {
        return filename;
    }
    const bibFiles = lw_1.lw.cache.getIncludedBib(rootFile);
    for (const bib of bibFiles) {
        if (bib.endsWith(filename)) {
            return bib;
        }
    }
    logger.log(`Cannot resolve file ${filename} .`);
    return filename;
}
function findKeyLocation(key) {
    const entry = lw_1.lw.completion.citation.getItem(key);
    if (entry) {
        const file = entry.file;
        const line = entry.position.line + 1;
        return { file, line };
    }
    else {
        logger.log(`Cannot find key ${key}`);
        return;
    }
}
//# sourceMappingURL=bibtexlog.js.map