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
exports.BibProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const lw_1 = require("../lw");
const utils_1 = require("../lint/bibtex-formatter/utils");
const utils_2 = require("../utils/utils");
const logger = lw_1.lw.log('Intelli', 'Bib');
class BibProvider {
    constructor() {
        this.scope = undefined;
        this.entryItems = [];
        this.optFieldItems = Object.create(null);
        if (vscode.window.activeTextEditor) {
            this.scope = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
        }
        else {
            this.scope = vscode.workspace.workspaceFolders?.[0];
        }
        this.bibtexFormatConfig = (0, utils_1.getBibtexFormatConfig)(this.scope);
        this.initialize();
        lw_1.lw.onConfigChange(['bibtex-format', 'bibtex-entries', 'bibtex-fields', 'intellisense'], () => {
            this.bibtexFormatConfig = (0, utils_1.getBibtexFormatConfig)(this.scope);
            this.initialize();
        }, this.scope);
        vscode.window.onDidChangeActiveTextEditor((e) => {
            if (e && lw_1.lw.file.hasBibLangId(e.document.languageId)) {
                const wsFolder = vscode.workspace.getWorkspaceFolder(e.document.uri);
                if (wsFolder !== this.scope) {
                    this.scope = wsFolder;
                    this.bibtexFormatConfig = (0, utils_1.getBibtexFormatConfig)(this.scope);
                    this.initialize();
                }
            }
        });
    }
    initialize() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', this.scope);
        const citationBackend = configuration.get('intellisense.citation.backend');
        let entriesFile = '';
        let optEntriesFile = '';
        let entriesReplacements = {};
        switch (citationBackend) {
            case 'bibtex':
                entriesFile = `${lw_1.lw.extensionRoot}/data/bibtex-entries.json`;
                optEntriesFile = `${lw_1.lw.extensionRoot}/data/bibtex-optional-entries.json`;
                entriesReplacements = configuration.get('intellisense.bibtexJSON.replace');
                break;
            case 'biblatex':
                entriesFile = `${lw_1.lw.extensionRoot}/data/biblatex-entries.json`;
                optEntriesFile = `${lw_1.lw.extensionRoot}/data/biblatex-optional-entries.json`;
                entriesReplacements = configuration.get('intellisense.biblatexJSON.replace');
                break;
            default:
                logger.log(`Unknown citation backend: ${citationBackend}`);
                return;
        }
        try {
            this.loadDefaultItems(entriesFile, optEntriesFile, entriesReplacements);
        }
        catch (err) {
            logger.log(`Error reading data: ${err}.`);
        }
    }
    loadDefaultItems(entriesFile, optEntriesFile, entriesReplacements) {
        const entries = JSON.parse(fs.readFileSync(entriesFile, { encoding: 'utf8' }));
        const optFields = JSON.parse(fs.readFileSync(optEntriesFile, { encoding: 'utf8' }));
        // const maxLengths: {[key: string]: number} = this.computeMaxLengths(entries, optFields)
        const entriesList = [];
        this.entryItems.length = 0;
        Object.keys(entries).forEach(entry => {
            if (entry in entriesList) {
                return;
            }
            if (entry in entriesReplacements) {
                this.entryItems.push(this.entryToCompletion(entry, entriesReplacements[entry], this.bibtexFormatConfig));
            }
            else {
                this.entryItems.push(this.entryToCompletion(entry, entries[entry], this.bibtexFormatConfig));
            }
            entriesList.push(entry);
        });
        Object.entries(optFields).forEach(([field, item]) => {
            this.optFieldItems[field] = this.fieldsToCompletion(item, this.bibtexFormatConfig);
        });
    }
    // private computeMaxLengths(entries: {[key: string]: string[]}, optFields: {[key: string]: string[]}): {[key: string]: number} {
    //     const maxLengths = Object.create(null) as { [key: string]: number }
    //     Object.keys(entries).forEach(key => {
    //         let maxFieldLength = 0
    //         entries[key].forEach(field => {
    //             maxFieldLength = Math.max(maxFieldLength, field.length)
    //         })
    //         if (key in optFields) {
    //             optFields[key].forEach(field => {
    //                 maxFieldLength = Math.max(maxFieldLength, field.length)
    //             })
    //         }
    //         maxLengths[key] = maxFieldLength
    //     })
    //     return maxLengths
    // }
    entryToCompletion(itemName, itemFields, config) {
        const suggestion = new vscode.CompletionItem(itemName, vscode.CompletionItemKind.Snippet);
        suggestion.detail = itemName;
        suggestion.documentation = `Add a @${itemName} entry`;
        let count = 1;
        // The following code is copied from BibtexUtils.bibtexFormat
        // Find the longest field name in entry
        let s = itemName + '{${0:key}';
        itemFields.forEach(field => {
            s += ',\n' + config.tab + (config.case === 'lowercase' ? field.toLowerCase() : field.toUpperCase());
            s += ' = ';
            s += config.left + `$${count}` + config.right;
            count++;
        });
        s += '\n}';
        suggestion.insertText = new vscode.SnippetString(s);
        return suggestion;
    }
    fieldsToCompletion(fields, config) {
        const suggestions = [];
        fields.forEach(field => {
            const suggestion = new vscode.CompletionItem(field, vscode.CompletionItemKind.Snippet);
            suggestion.detail = field;
            suggestion.documentation = `Add ${field} = ${config.left}${config.right}`;
            suggestion.insertText = new vscode.SnippetString(`${field} = ${config.left}$1${config.right},`);
            suggestions.push(suggestion);
        });
        return suggestions;
    }
    provideCompletionItems(document, position) {
        const currentLine = document.lineAt(position.line).text;
        if (currentLine.match(/@[a-zA-Z]*$/)) {
            // Complete an entry name
            return this.entryItems;
        }
        else if (currentLine.match(/^\s*[a-zA-Z]*$/)) {
            let offset = 0;
            while (offset < 100) {
                const prevLine = position.line - offset > 0 ? document.lineAt(position.line - offset - 1).text : '';
                if (prevLine.match(/(?:@[a-zA-Z]{)|(?:["}0-9],\s*$)/)) {
                    // Add optional fields
                    const optFields = this.provideOptFields(document, position);
                    return optFields;
                }
                offset += 1;
            }
            return;
        }
        const result = currentLine.substring(0, position.character).match(/^\s*([a-zA-Z]*)\s*=\s*([{|"]?)$/);
        // If not found, or right before the starting { / "
        if (!result || result[2] === '' && ['{', '"'].includes(currentLine.substring(position.character)[0])) {
            return;
        }
        // Exclude the current editing field from searched
        const lines = document.getText().split('\n');
        lines[position.line] = lines[position.line].replace(RegExp(`${result[1]}\\s*=\\s*`, 'g'), '');
        return findFieldValues(result[1], lines.join('\n'))
            .reduce((unique, value) => {
            if (!unique.includes(value)) {
                unique.push(value);
            }
            return unique;
        }, [])
            .map(entry => new vscode.CompletionItem(entry, vscode.CompletionItemKind.Text));
    }
    provideOptFields(document, position) {
        const pattern = /^\s*@([a-zA-Z]+)\{(?:[^,]*,)?\s$/m;
        const content = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const reversedContent = content.replace(/(\r\n)|\r/g, '\n').split('\n').reverse().join('\n');
        const match = reversedContent.match(pattern);
        if (match) {
            const entryType = match[1].toLowerCase();
            if (entryType in this.optFieldItems) {
                return this.optFieldItems[entryType];
            }
        }
        return [];
    }
}
exports.BibProvider = BibProvider;
function findFieldValues(field, text) {
    const re = RegExp(`(${field}\\s*=\\s*)`, 'g');
    const candidates = [];
    while (true) {
        const match = re.exec(text);
        if (!match) {
            break;
        }
        const startPos = match.index + match[1].length;
        if (text[startPos] === '{') {
            const candidate = (0, utils_2.getLongestBalancedString)(text.slice(startPos));
            if (candidate !== undefined) {
                candidates.push(candidate);
            }
        }
        else if (text[startPos] === '"') {
            const quoteRe = /(?<!\\)"/g;
            const quoteMatch = quoteRe.exec(text.slice(startPos + 1));
            if (quoteMatch) {
                candidates.push(text.slice(startPos + 1, startPos + quoteMatch.index + 1));
            }
        }
        else {
            const commaRe = /,/g;
            const commaMatch = commaRe.exec(text.slice(startPos + 1));
            if (commaMatch) {
                candidates.push(text.slice(startPos, startPos + commaMatch.index + 1));
            }
        }
    }
    return candidates;
}
//# sourceMappingURL=bibtex.js.map