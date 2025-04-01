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
exports.DocSymbolProvider = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../types");
const bibtex_1 = require("../outline/structure/bibtex");
const latex_1 = require("../outline/structure/latex");
const doctex_1 = require("../outline/structure/doctex");
const lw_1 = require("../lw");
class DocSymbolProvider {
    async provideDocumentSymbols(document) {
        if (document.languageId === 'bibtex') {
            return (0, bibtex_1.buildBibTeX)(document).then((sections) => this.sectionToSymbols(sections));
        }
        else if (document.languageId === 'doctex') {
            return (0, doctex_1.construct)(document).then((sections) => this.sectionToSymbols(sections));
        }
        if (!lw_1.lw.constant.FILE_URI_SCHEMES.includes(document.uri.scheme)) {
            return [];
        }
        const sections = await (0, latex_1.construct)(document.fileName, false);
        return this.sectionToSymbols(sections);
    }
    sectionToKind(section) {
        if (section.type === types_1.TeXElementType.Section || section.type === types_1.TeXElementType.SectionAst) {
            return vscode.SymbolKind.Struct;
        }
        if (section.type === types_1.TeXElementType.Environment) {
            return vscode.SymbolKind.Package;
        }
        if (section.type === types_1.TeXElementType.Macro) {
            return vscode.SymbolKind.Number;
        }
        if (section.type === types_1.TeXElementType.SubFile) {
            return vscode.SymbolKind.File;
        }
        if (section.type === types_1.TeXElementType.BibItem) {
            return vscode.SymbolKind.Class;
        }
        if (section.type === types_1.TeXElementType.BibField) {
            return vscode.SymbolKind.Constant;
        }
        return vscode.SymbolKind.String;
    }
    sectionToSymbols(sections) {
        const symbols = [];
        sections.forEach(section => {
            const range = new vscode.Range(section.lineFr, 0, section.lineTo, 65535);
            const symbol = new vscode.DocumentSymbol(section.label || 'empty', '', this.sectionToKind(section), range, range);
            symbols.push(symbol);
            if (section.children.length > 0) {
                symbol.children = this.sectionToSymbols(section.children);
            }
        });
        return symbols;
    }
}
exports.DocSymbolProvider = DocSymbolProvider;
//# sourceMappingURL=symbol-document.js.map