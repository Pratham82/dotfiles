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
exports.biberLogParser = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const parserutils_1 = require("./parserutils");
const logger = lw_1.lw.log('Parser', 'BiberLog');
const bibFileInfo = /^INFO - Found BibTeX data source '(.*)'$/;
const lineError = /^ERROR - BibTeX subsystem.*, line (\d+), (.*)$/;
const missingEntryWarning = /^WARN - (I didn't find a database entry for '.*'.*)$/;
const lineWarning = /^WARN - (.* entry '(.*)' .*)$/;
const biberDiagnostics = vscode.languages.createDiagnosticCollection('Biber');
const buildLog = [];
exports.biberLogParser = {
    showLog,
    parse
};
function showLog() {
    (0, parserutils_1.showCompilerDiagnostics)(biberDiagnostics, buildLog);
}
function parse(log, rootFile) {
    if (rootFile === undefined) {
        rootFile = lw_1.lw.root.file.path;
    }
    if (rootFile === undefined) {
        logger.log('How can you reach this point?');
        return [];
    }
    const bibFileStack = [rootFile];
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    let excludeRegexp;
    try {
        excludeRegexp = configuration.get('message.biberlog.exclude').map(regexp => RegExp(regexp));
    }
    catch (e) {
        logger.logError('Invalid message.biberlog.exclude config.', e);
        return [];
    }
    const lines = log.split('\n');
    buildLog.length = 0;
    for (const line of lines) {
        parseLine(line, bibFileStack, excludeRegexp);
    }
    logger.log(`Logged ${buildLog.length} messages.`);
    return buildLog;
}
function parseLine(line, bibFileStack, excludeRegexp) {
    let result = null;
    result = line.match(bibFileInfo);
    if (result) {
        const filename = resolveBibFile(result[1], bibFileStack[0]);
        bibFileStack.push(filename);
        logger.log(`Found BibTeX file ${filename}`);
    }
    result = line.match(lineError);
    if (result) {
        const lineNumber = parseInt(result[1], 10);
        const filename = bibFileStack.at(-1) || bibFileStack[0];
        pushLog('error', filename, result[2], lineNumber, excludeRegexp);
        return;
    }
    result = line.match(missingEntryWarning);
    if (result) {
        const lineNumber = 1;
        const filename = bibFileStack.at(-1) || bibFileStack[0];
        pushLog('warning', filename, result[1], lineNumber, excludeRegexp);
    }
    result = line.match(lineWarning);
    if (result) {
        const keyLocation = findKeyLocation(result[2]);
        if (keyLocation) {
            pushLog('warning', keyLocation.file, result[1], keyLocation.line, excludeRegexp);
        }
    }
}
function pushLog(type, file, message, line, excludeRegexp) {
    for (const regexp of excludeRegexp) {
        if (message.match(regexp)) {
            return;
        }
    }
    buildLog.push({ type, file, text: message, line });
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
//# sourceMappingURL=biberlog.js.map