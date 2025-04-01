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
exports.bibTools = exports.citation = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const latex_utensils_1 = require("latex-utensils");
const lw_1 = require("../../lw");
const utils_1 = require("../../utils/utils");
const completerutils_1 = require("./completerutils");
const logger = lw_1.lw.log('Intelli', 'Citation');
exports.provider = { from };
exports.citation = {
    parse,
    browser,
    getItem,
    parseBibFile
};
const data = {
    bibEntries: new Map()
};
lw_1.lw.watcher.bib.onCreate(uri => parseBibFile(uri.fsPath));
lw_1.lw.watcher.bib.onChange(uri => parseBibFile(uri.fsPath));
lw_1.lw.watcher.bib.onDelete(uri => removeEntriesInFile(uri.fsPath));
/**
 * Read the value `intellisense.citation.format`
 * @param configuration workspace configuration
 * @param excludedField A field to exclude from the list of citation fields. Primary usage is to not include `citation.label` twice.
 */
function readCitationFormat(configuration, excludedField) {
    const fields = configuration.get('intellisense.citation.format').map(f => { return f.toLowerCase(); });
    if (excludedField) {
        return fields.filter(f => f !== excludedField.toLowerCase());
    }
    return fields;
}
exports.bibTools = {
    expandField,
    deParenthesis,
    parseAbbrevations
};
function expandField(abbreviations, value) {
    if (value === undefined) {
        return '';
    }
    if (value.kind === 'concat') {
        const args = value.content;
        return args.map(arg => expandField(abbreviations, arg)).join(' ');
    }
    if (latex_utensils_1.bibtexParser.isAbbreviationValue(value)) {
        if (value.content in abbreviations) {
            return abbreviations[value.content];
        }
        return '';
    }
    return value.content;
}
function deParenthesis(str) {
    // Remove wrapping { }
    // Extract the content of \url{}
    return str.replace(/\\url{([^\\{}]+)}/g, '$1').replace(/{+([^\\{}]+)}+/g, '$1');
}
function parseAbbrevations(ast) {
    const abbreviations = {};
    ast.content.filter(latex_utensils_1.bibtexParser.isStringEntry).forEach((entry) => {
        // @string{string1 = "Proceedings of the "}
        // @string{string2 = string1 # "Foo"}
        if (typeof entry.value.content === 'string') {
            abbreviations[entry.abbreviation] = entry.value.content;
        }
        else {
            abbreviations[entry.abbreviation] =
                entry.value.content.map(subEntry => {
                    if (latex_utensils_1.bibtexParser.isAbbreviationValue(subEntry)) {
                        return abbreviations[subEntry.content] ?? `undefined @string "${subEntry.content}"`;
                    }
                    else {
                        return subEntry.content;
                    }
                }).join('');
        }
    });
    return abbreviations;
}
function from(_result, args) {
    return provide(args.uri, args.line, args.position);
}
function provide(uri, line, position) {
    // Compile the suggestion array to vscode completion array
    const configuration = vscode.workspace.getConfiguration('latex-workshop', uri);
    const label = configuration.get('intellisense.citation.label');
    const fields = readCitationFormat(configuration);
    const range = (0, completerutils_1.computeFilteringRange)(line, position);
    const items = updateAll(lw_1.lw.cache.getIncludedBib(lw_1.lw.root.file.path));
    const alts = [];
    items.forEach(item => {
        if (item.fields.has('ids')) {
            const ids = item.fields.get('ids')?.split(',').map(id => id.trim());
            if (ids === undefined || ids.length === 0) {
                return;
            }
            for (const id of ids) {
                const alt = Object.assign({}, item);
                alt.key = id;
                alts.push(alt);
            }
        }
    });
    // Retrieve the list of fields to filter the completion items
    const filterContents = configuration.get('intellisense.citation.filterText');
    // Construct the filter text for each item
    const getFilterText = (item) => {
        const filterText = filterContents
            .map(filterContent => ({
            'bibtex key': item.key,
            'title': item.fields.title || '',
            'other fields': item.fields.join(fields.filter(field => field !== 'title'), false)
        }[filterContent] || ''))
            .filter(text => text !== '')
            .join(' ');
        if (filterText === '') {
            return `${item.key} ${item.fields.title || ''} ${item.fields.join(fields.filter(field => field !== 'title'), false)}`;
        }
        return filterText;
    };
    return [...items, ...alts].map(item => {
        // Compile the completion item label
        switch (label) {
            case 'bibtex key':
            default:
                item.label = item.key;
                break;
            case 'title':
                if (item.fields.title) {
                    item.label = item.fields.title;
                }
                break;
            case 'authors':
                if (item.fields.author) {
                    item.label = item.fields.author;
                }
                break;
        }
        item.filterText = getFilterText(item);
        item.insertText = item.key;
        item.range = range;
        // We need two spaces to ensure md newline
        item.documentation = new vscode.MarkdownString('\n' + item.fields.join(fields, true, '  \n') + '\n\n');
        return item;
    });
}
function browser(args) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', args?.uri);
    const label = configuration.get('intellisense.citation.label');
    const fields = readCitationFormat(configuration, label);
    void vscode.window.showQuickPick(updateAll(lw_1.lw.cache.getIncludedBib(lw_1.lw.root.file.path)).map(item => {
        return {
            label: item.fields.title ? (0, utils_1.trimMultiLineString)(item.fields.title) : '',
            description: item.key,
            detail: item.fields.join(fields, true, ', ')
        };
    }), {
        placeHolder: 'Press ENTER to insert citation key at cursor',
        matchOnDetail: true,
        matchOnDescription: true,
        ignoreFocusOut: true
    }).then(selected => {
        if (!selected) {
            return;
        }
        if (vscode.window.activeTextEditor) {
            const editor = vscode.window.activeTextEditor;
            const content = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), editor.selection.start));
            let start = editor.selection.start;
            if (content.lastIndexOf('\\cite') > content.lastIndexOf('}')) {
                const curlyStart = content.lastIndexOf('{') + 1;
                const commaStart = content.lastIndexOf(',') + 1;
                start = editor.document.positionAt(curlyStart > commaStart ? curlyStart : commaStart);
            }
            void editor.edit(edit => edit.replace(new vscode.Range(start, editor.selection.end), selected.description || ''))
                .then(() => editor.selection = new vscode.Selection(editor.selection.end, editor.selection.end));
        }
    });
}
function getRawItem(key) {
    const suggestions = updateAll();
    const entry = suggestions.find((elm) => elm.key === key);
    return entry;
}
function getItem(key, configurationScope) {
    const entry = getRawItem(key);
    if (entry && !(entry.detail || entry.documentation)) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', configurationScope);
        const fields = readCitationFormat(configuration);
        // We need two spaces to ensure md newline
        entry.documentation = new vscode.MarkdownString('\n' + entry.fields.join(fields, true, '  \n') + '\n\n');
    }
    return entry;
}
/**
 * Returns aggregated bib entries from `.bib` files and bibitems defined on LaTeX files included in the root file.
 *
 * @param bibFiles The array of the paths of `.bib` files. If `undefined`, the keys of `bibEntries` are used.
 */
function updateAll(bibFiles) {
    let suggestions = [];
    // From bib files
    if (bibFiles === undefined) {
        bibFiles = Array.from(data.bibEntries.keys());
    }
    bibFiles.forEach(file => {
        const entry = data.bibEntries.get(file);
        if (entry) {
            suggestions = suggestions.concat(entry);
        }
    });
    // From caches
    lw_1.lw.cache.getIncludedTeX().forEach(cachedFile => {
        const cachedBibs = lw_1.lw.cache.get(cachedFile)?.elements.bibitem;
        if (cachedBibs === undefined) {
            return;
        }
        suggestions = suggestions.concat(cachedBibs);
    });
    return suggestions;
}
/**
 * Parses `.bib` file. The results are stored in this instance.
 *
 * @param fileName The path of `.bib` file.
 */
async function parseBibFile(fileName) {
    logger.log(`Parsing .bib entries from ${fileName}`);
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(fileName));
    if ((await lw_1.lw.external.stat(lw_1.lw.file.toUri(fileName))).size >= configuration.get('bibtex.maxFileSize') * 1024 * 1024) {
        logger.log(`Bib file is too large, ignoring it: ${fileName}`);
        data.bibEntries.delete(fileName);
        return;
    }
    const newEntry = [];
    const bibtex = await lw_1.lw.file.read(fileName);
    logger.log(`Parse BibTeX AST from ${fileName} .`);
    const ast = await lw_1.lw.parser.parse.bib(lw_1.lw.file.toUri(fileName), bibtex ?? '');
    if (ast === undefined) {
        logger.log(`Parsed 0 bib entries from ${fileName}.`);
        lw_1.lw.event.fire(lw_1.lw.event.FileParsed, fileName);
        return;
    }
    const abbreviations = parseAbbrevations(ast);
    ast.content
        .filter(latex_utensils_1.bibtexParser.isEntry)
        .forEach((entry) => {
        if (entry.internalKey === undefined) {
            return;
        }
        const item = {
            key: entry.internalKey,
            label: entry.internalKey,
            file: fileName,
            position: new vscode.Position(entry.location.start.line - 1, entry.location.start.column - 1),
            kind: vscode.CompletionItemKind.Reference,
            fields: new Fields()
        };
        entry.content.forEach(field => {
            const value = deParenthesis(expandField(abbreviations, field.value));
            item.fields.set(field.name, value);
        });
        newEntry.push(item);
    });
    data.bibEntries.set(fileName, newEntry);
    logger.log(`Parsed ${newEntry.length} bib entries from ${fileName} .`);
    void lw_1.lw.outline.reconstruct();
    lw_1.lw.event.fire(lw_1.lw.event.FileParsed, fileName);
}
function removeEntriesInFile(file) {
    logger.log(`Remove parsed bib entries for ${file}`);
    data.bibEntries.delete(file);
}
/**
 * Updates the Manager cache for bibitems with Cache.
 * Cache `content` is parsed with regular expressions,
 * and the result is used to update the cache bibitem element.
 */
function parse(cache) {
    cache.elements.bibitem = parseContent(cache.filePath, cache.content);
}
function parseContent(file, content) {
    const itemReg = /^(?!%).*\\bibitem(?:\[[^[\]{}]*\])?{([^}]*)}/gm;
    const items = [];
    while (true) {
        const result = itemReg.exec(content);
        if (result === null) {
            break;
        }
        const postContent = content.substring(result.index + result[0].length, content.indexOf('\n', result.index)).trim();
        const positionContent = content.substring(0, result.index).split('\n');
        items.push({
            key: result[1],
            label: result[1],
            file,
            kind: vscode.CompletionItemKind.Reference,
            detail: `${postContent}\n...`,
            fields: new Fields(),
            position: new vscode.Position(positionContent.length - 1, positionContent[positionContent.length - 1].length)
        });
    }
    return items;
}
class Fields extends Map {
    get author() { return this.get('author'); }
    get journal() { return this.get('journal'); }
    get journaltitle() { return this.get('journaltitle'); }
    get title() { return this.get('title'); }
    get publisher() { return this.get('publisher'); }
    /**
     * Concatenate the values of the fields listed in `selectedFields`
     * @param selectedFields an array of field names
     * @param prefixWithKeys if true, every field is prefixed by 'Fieldname: '
     * @param joinString the string to use for joining the fields
     * @returns a string
     */
    join(selectedFields, prefixWithKeys, joinString = ' ') {
        const s = [];
        for (const key of this.keys()) {
            if (selectedFields.includes(key)) {
                const value = this.get(key);
                if (prefixWithKeys) {
                    s.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value);
                }
                else {
                    s.push(value);
                }
            }
        }
        return s.join(joinString);
    }
}
//# sourceMappingURL=citation.js.map