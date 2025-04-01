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
exports.glossary = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const latex_utensils_1 = require("latex-utensils");
const lw_1 = require("../../lw");
const types_1 = require("../../types");
const parser_1 = require("../../utils/parser");
const utils_1 = require("../../utils/utils");
const citation_1 = require("./citation");
const logger = lw_1.lw.log('Intelli', 'Glossary');
exports.provider = { from };
exports.glossary = {
    parse,
    getItem,
    parseBibFile
};
const data = {
    // The keys are the labels of the glossary items.
    glossaries: new Map(),
    acronyms: new Map(),
    // The keys are the paths of the `.bib` files.
    bibEntries: new Map()
};
lw_1.lw.watcher.bib.onCreate(uri => parseBibFile(uri.fsPath));
lw_1.lw.watcher.bib.onChange(uri => parseBibFile(uri.fsPath));
lw_1.lw.watcher.bib.onDelete(uri => removeEntriesInFile(uri.fsPath));
function from(result) {
    updateAll(lw_1.lw.cache.getIncludedGlossaryBib(lw_1.lw.root.file.path));
    let suggestions;
    if (result[1] && result[1].match(/^ac/i)) {
        suggestions = data.acronyms;
    }
    else {
        suggestions = new Map([...data.acronyms, ...data.glossaries]);
    }
    // Compile the suggestion object to array
    const items = Array.from(suggestions.values());
    return items;
}
function getItem(token) {
    updateAll(lw_1.lw.cache.getIncludedGlossaryBib(lw_1.lw.root.file.path));
    return data.glossaries.get(token) || data.acronyms.get(token);
}
/**
 * Returns aggregated glossary entries from `.bib` files and glossary items defined on LaTeX files included in the root file.
 *
 * @param bibFiles The array of the paths of `.bib` files. If `undefined`, the keys of `bibEntries` are used.
 */
function updateAll(bibFiles) {
    // Extract cached references
    const glossaryList = [];
    // From bib files
    bibFiles.forEach(file => {
        const entries = data.bibEntries.get(file);
        entries?.forEach(entry => {
            if (entry.type === types_1.GlossaryType.glossary) {
                data.glossaries.set(entry.label, entry);
            }
            else {
                data.acronyms.set(entry.label, entry);
            }
            glossaryList.push(entry.label);
        });
    });
    lw_1.lw.cache.getIncludedTeX().forEach(cachedFile => {
        const cachedGlossaries = lw_1.lw.cache.get(cachedFile)?.elements.glossary;
        if (cachedGlossaries === undefined) {
            return;
        }
        cachedGlossaries.forEach(ref => {
            if (ref.type === types_1.GlossaryType.glossary) {
                data.glossaries.set(ref.label, ref);
            }
            else {
                data.acronyms.set(ref.label, ref);
            }
            glossaryList.push(ref.label);
        });
    });
    // Remove references that have been deleted
    data.glossaries.forEach((_, key) => {
        if (!glossaryList.includes(key)) {
            data.glossaries.delete(key);
        }
    });
    data.acronyms.forEach((_, key) => {
        if (!glossaryList.includes(key)) {
            data.acronyms.delete(key);
        }
    });
}
/**
 * Parse a glossary `.bib` file. The results are stored in this instance.
 *
 * @param fileName The path of `.bib` file.
 */
async function parseBibFile(fileName) {
    logger.log(`Parsing glossary .bib entries from ${fileName}`);
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
    const abbreviations = citation_1.bibTools.parseAbbrevations(ast);
    ast.content
        .filter(latex_utensils_1.bibtexParser.isEntry)
        .forEach((entry) => {
        if (entry.internalKey === undefined) {
            return;
        }
        let type;
        if (['entry'].includes(entry.entryType)) {
            type = types_1.GlossaryType.glossary;
        }
        else {
            type = types_1.GlossaryType.acronym;
        }
        const name = citation_1.bibTools.expandField(abbreviations, entry.content.find(field => field.name === 'name')?.value);
        const description = citation_1.bibTools.expandField(abbreviations, entry.content.find(field => field.name === 'description')?.value);
        const item = {
            type,
            label: entry.internalKey,
            filePath: fileName,
            position: new vscode.Position(entry.location.start.line - 1, entry.location.start.column - 1),
            kind: vscode.CompletionItemKind.Reference,
            detail: name + ': ' + description
        };
        newEntry.push(item);
    });
    data.bibEntries.set(fileName, newEntry);
    logger.log(`Parsed ${newEntry.length} glossary bib entries from ${fileName} .`);
    void lw_1.lw.outline.reconstruct();
    lw_1.lw.event.fire(lw_1.lw.event.FileParsed, fileName);
}
function removeEntriesInFile(file) {
    logger.log(`Remove parsed bib entries for ${file}`);
    data.bibEntries.delete(file);
}
function parse(cache) {
    if (cache.ast !== undefined) {
        cache.elements.glossary = parseAst(cache.ast, cache.filePath);
    }
    else {
        cache.elements.glossary = parseContent(cache.content, cache.filePath);
    }
}
function parseAst(node, filePath) {
    let glos = [];
    let label = '';
    let description = '';
    let type;
    if (node.type === 'macro' && ['newglossaryentry', 'provideglossaryentry'].includes(node.content)) {
        type = types_1.GlossaryType.glossary;
        description = (0, parser_1.argContentToStr)(node.args?.[1]?.content || [], true);
        const index = description.indexOf('description=');
        if (index >= 0) {
            description = description.slice(index + 12);
            if (description.charAt(0) === '{') {
                description = (0, utils_1.getLongestBalancedString)(description) ?? '';
            }
            else {
                description = description.split(',')[0] ?? '';
            }
        }
        else {
            description = '';
        }
        label = (0, parser_1.argContentToStr)(node.args?.[0]?.content || []);
    }
    else if (node.type === 'macro' && ['longnewglossaryentry', 'longprovideglossaryentry', 'newacronym', 'newabbreviation', 'newabbr'].includes(node.content)) {
        if (['longnewglossaryentry', 'longprovideglossaryentry'].includes(node.content)) {
            type = types_1.GlossaryType.glossary;
        }
        else {
            type = types_1.GlossaryType.acronym;
        }
        label = (0, parser_1.argContentToStr)(node.args?.[1]?.content || []);
        description = (0, parser_1.argContentToStr)(node.args?.[3]?.content || []);
    }
    if (type !== undefined && label && description && node.position !== undefined) {
        glos.push({
            type,
            filePath,
            position: new vscode.Position(node.position.start.line - 1, node.position.start.column - 1),
            label,
            detail: description,
            kind: vscode.CompletionItemKind.Reference
        });
    }
    const parseContentNodes = (content) => {
        for (const subNode of content) {
            glos = [...glos, ...parseAst(subNode, filePath)];
        }
    };
    if (node.type === 'macro' && node.args) {
        for (const arg of node.args) {
            parseContentNodes(arg.content);
        }
    }
    else if ('content' in node && typeof node.content !== 'string') {
        parseContentNodes(node.content);
    }
    return glos;
}
function parseContent(content, filePath) {
    const glossaries = [];
    const glossaryList = [];
    // We assume that the label is always result[1] and use getDescription(result) for the description
    const regexes = {
        'glossary': {
            regex: /\\(?:provide|new)glossaryentry{([^{}]*)}\s*{(?:(?!description).)*description=(?:([^{},]*)|{([^{}]*))[,}]/gms,
            type: types_1.GlossaryType.glossary,
            getDescription: (result) => { return result[2] ? result[2] : result[3]; }
        },
        'longGlossary': {
            regex: /\\long(?:provide|new)glossaryentry{([^{}]*)}\s*{[^{}]*}\s*{([^{}]*)}/gms,
            type: types_1.GlossaryType.glossary,
            getDescription: (result) => { return result[2]; }
        },
        'acronym': {
            regex: /\\newacronym(?:\[[^[\]]*\])?{([^{}]*)}{[^{}]*}{([^{}]*)}/gm,
            type: types_1.GlossaryType.acronym,
            getDescription: (result) => { return result[2]; }
        }
    };
    for (const key in regexes) {
        while (true) {
            const result = regexes[key].regex.exec(content);
            if (result === null) {
                break;
            }
            const positionContent = content.substring(0, result.index).split('\n');
            if (glossaryList.includes(result[1])) {
                continue;
            }
            glossaries.push({
                type: regexes[key].type,
                filePath,
                position: new vscode.Position(positionContent.length - 1, positionContent[positionContent.length - 1].length),
                label: result[1],
                detail: regexes[key].getDescription(result),
                kind: vscode.CompletionItemKind.Reference
            });
        }
    }
    return glossaries;
}
//# sourceMappingURL=glossary.js.map