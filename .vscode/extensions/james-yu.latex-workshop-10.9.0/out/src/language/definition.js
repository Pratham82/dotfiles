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
exports.DefinitionProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lw_1 = require("../lw");
const tokenizer_1 = require("../utils/tokenizer");
const utils = __importStar(require("../utils/utils"));
const inputfilepath_1 = require("../utils/inputfilepath");
class DefinitionProvider {
    async onAFilename(document, position, token) {
        const line = document.lineAt(position.line).text;
        const escapedToken = utils.escapeRegExp(token);
        const regexInput = new RegExp(`\\\\(?:include|input|subfile)\\{${escapedToken}\\}`);
        const regexImport = new RegExp(`\\\\(?:sub)?(?:import|includefrom|inputfrom)\\*?\\{([^\\}]*)\\}\\{${escapedToken}\\}`);
        const regexDocumentclass = new RegExp(`\\\\(?:documentclass)(?:\\[[^[]]*\\])?\\{${escapedToken}\\}`);
        if (!vscode.window.activeTextEditor) {
            return;
        }
        if (line.match(regexDocumentclass)) {
            return utils.resolveFile([path.dirname(vscode.window.activeTextEditor.document.fileName)], (0, inputfilepath_1.sanitizeInputFilePath)(token), '.cls');
        }
        let dirs = [];
        if (line.match(regexInput)) {
            dirs = [path.dirname(vscode.window.activeTextEditor.document.fileName)];
            if (lw_1.lw.root.dir.path !== undefined) {
                dirs.push(lw_1.lw.root.dir.path);
            }
        }
        const result = line.match(regexImport);
        if (result) {
            dirs = [path.resolve(path.dirname(vscode.window.activeTextEditor.document.fileName), (0, inputfilepath_1.sanitizeInputFilePath)(result[1]))];
        }
        if (dirs.length > 0) {
            return utils.resolveFile(dirs, (0, inputfilepath_1.sanitizeInputFilePath)(token), '.tex');
        }
        return;
    }
    /**
     * VSCode hook to provide definitions of the symbol at `position`.
     * In LW these can be custom commands, labels, citations, glossary entries, and file names.
     *
     * Also provides the exact range of the found symbol (`originSelectionRange`),
     * as different symbol types support different characters in LaTeX (esp. regarding `[:-]`)
     *
     * @param document The document to be scanned.
     * @param position The position to be scanned at.
     *
     * @returns {DefinitionLink[]} linking `originSelectionRange` to `targetUri`/`targetRange`
     */
    async provideDefinition(document, position) {
        if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(document.uri.scheme)) {
            return [];
        }
        const tokenRange = (0, tokenizer_1.tokenizer)(document, position);
        if (tokenRange === undefined) {
            return [];
        }
        const token = document.getText(tokenRange);
        if (token.startsWith('\\')) {
            const macro = lw_1.lw.completion.macro.getData().definedCmds.get(token.slice(1));
            if (macro) {
                return [{
                        targetUri: macro.location.uri,
                        targetRange: macro.location.range,
                        originSelectionRange: tokenRange
                    }];
            }
            return [];
        }
        const ref = lw_1.lw.completion.reference.getItem(token);
        if (ref) {
            return [{
                    targetUri: lw_1.lw.file.toUri(ref.file),
                    targetRange: new vscode.Range(ref.position, ref.position),
                    originSelectionRange: tokenRange
                }];
        }
        const cite = lw_1.lw.completion.citation.getItem(token);
        if (cite) {
            return [{
                    targetUri: lw_1.lw.file.toUri(cite.file),
                    targetRange: new vscode.Range(cite.position, cite.position),
                    originSelectionRange: tokenRange
                }];
        }
        const glossary = lw_1.lw.completion.glossary.getItem(token);
        if (glossary) {
            return [{
                    targetUri: lw_1.lw.file.toUri(glossary.filePath),
                    targetRange: new vscode.Range(glossary.position, glossary.position),
                    originSelectionRange: tokenRange
                }];
        }
        if (vscode.window.activeTextEditor && token.includes('.')) {
            // We skip graphics files
            const graphicsExtensions = ['.pdf', '.eps', '.jpg', '.jpeg', '.JPG', '.JPEG', '.gif', '.png'];
            const ext = path.extname(token);
            if (graphicsExtensions.includes(ext)) {
                return [];
            }
            const absolutePath = path.resolve(path.dirname(vscode.window.activeTextEditor.document.fileName), token);
            if (fs.existsSync(absolutePath)) {
                return [{
                        targetUri: lw_1.lw.file.toUri(absolutePath),
                        targetRange: new vscode.Range(0, 0, 0, 0),
                        originSelectionRange: tokenRange
                    }];
            }
        }
        const filename = await this.onAFilename(document, position, token);
        if (filename) {
            return [{
                    targetUri: lw_1.lw.file.toUri(filename),
                    targetRange: new vscode.Range(0, 0, 0, 0),
                    originSelectionRange: tokenRange
                }];
        }
        return [];
    }
}
exports.DefinitionProvider = DefinitionProvider;
//# sourceMappingURL=definition.js.map