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
exports.fieldValueToString = fieldValueToString;
exports.buildBibTeX = buildBibTeX;
const vscode = __importStar(require("vscode"));
const latex_utensils_1 = require("latex-utensils");
const lw_1 = require("../../lw");
const types_1 = require("../../types");
const citation_1 = require("../../completion/completer/citation");
const logger = lw_1.lw.log('Structure', 'BibTeX');
/**
* Convert a bibtexParser.FieldValue to a string
* @param field the bibtexParser.FieldValue to parse
*/
function fieldValueToString(field, abbreviations) {
    if (field.kind === 'concat') {
        return field.content.map(value => fieldValueToString(value, abbreviations)).reduce((acc, cur) => { return acc + ' # ' + cur; });
    }
    else if (field.kind === 'abbreviation') {
        return abbreviations[field.content] ?? `undefined @string "${field.content}"`;
    }
    else {
        return field.content;
    }
}
async function buildBibTeX(document) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(document.fileName));
    if (document.getText().length >= configuration.get('bibtex.maxFileSize') * 1024 * 1024) {
        logger.log(`Bib file is too large, ignoring it: ${document.fileName}`);
        return [];
    }
    logger.log('Parse active BibTeX document for AST.');
    const ast = await lw_1.lw.parser.parse.bib(document.uri, document.getText());
    if (ast === undefined) {
        return [];
    }
    logger.log(`Parsed ${ast.content.length} AST items.`);
    const abbreviations = citation_1.bibTools.parseAbbrevations(ast);
    const ds = [];
    ast.content.filter(latex_utensils_1.bibtexParser.isEntry)
        .forEach(entry => {
        const bibitem = {
            type: types_1.TeXElementType.BibItem,
            name: entry.entryType,
            label: `${entry.entryType}: ${entry.internalKey}`,
            lineFr: entry.location.start.line - 1, // ast line numbers start at 1
            lineTo: entry.location.end.line - 1,
            filePath: document.fileName,
            children: []
        };
        entry.content.forEach(field => {
            const content = fieldValueToString(field.value, abbreviations);
            const fielditem = {
                type: types_1.TeXElementType.BibField,
                name: field.name,
                label: `${field.name}: ${content}`,
                lineFr: field.location.start.line - 1,
                lineTo: field.location.end.line - 1,
                filePath: document.fileName,
                children: []
            };
            fielditem.parent = bibitem;
            bibitem.children.push(fielditem);
        });
        ds.push(bibitem);
    });
    return ds;
}
//# sourceMappingURL=bibtex.js.map