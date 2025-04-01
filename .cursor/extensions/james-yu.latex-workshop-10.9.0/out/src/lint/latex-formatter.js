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
exports.formatter = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const latexindent_1 = require("./latex-formatter/latexindent");
const tex_fmt_1 = require("./latex-formatter/tex-fmt");
const logger = lw_1.lw.log('Format', 'LaTeX');
class FormattingProvider {
    get formatter() {
        const config = vscode.workspace.getConfiguration('latex-workshop');
        const program = config.get('formatting.latex');
        let errorMsg;
        if (program === 'latexindent') {
            return latexindent_1.latexindent;
        }
        else if (program === 'tex-fmt') {
            return tex_fmt_1.texfmt;
        }
        else if (program === 'none') {
            errorMsg = 'LaTeX formatter is set to "none" by `formatting.latex`.';
        }
        else {
            errorMsg = `Unknown LaTeX formatter by \`formatting.latex\`: ${program} .`;
        }
        logger.log(errorMsg);
        void logger.showErrorMessage(errorMsg);
        return undefined;
    }
    async provideDocumentFormattingEdits(document, _options, _token) {
        const edit = await this.formatter?.formatDocument(document);
        if (edit === undefined) {
            return [];
        }
        return [edit];
    }
    async provideDocumentRangeFormattingEdits(document, range, _options, _token) {
        const edit = await this.formatter?.formatDocument(document, range);
        if (edit === undefined) {
            return [];
        }
        const useSpaces = vscode.window.activeTextEditor?.options.insertSpaces ?? true;
        const firstLine = document.lineAt(range.start.line);
        // Replace all new line characters with new line and spaces, so that
        // the indentations are added from the second line.
        edit.newText = edit.newText.replaceAll('\n', '\n' + (useSpaces ? ' ' : '\\t').repeat(firstLine.firstNonWhitespaceCharacterIndex));
        if (firstLine.firstNonWhitespaceCharacterIndex > range.start.character) {
            // \s\s\s|\sf(x)=ax+b
            // In this case, the first line need some leading whitespaces.
            edit.newText = ' '.repeat(firstLine.firstNonWhitespaceCharacterIndex - range.start.character) + edit.newText;
        }
        return [edit];
    }
}
const formattingProvider = new FormattingProvider();
exports.formatter = formattingProvider;
//# sourceMappingURL=latex-formatter.js.map