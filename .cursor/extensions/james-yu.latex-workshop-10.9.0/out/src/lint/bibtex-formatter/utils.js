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
exports.getBibtexFormatConfig = getBibtexFormatConfig;
exports.bibtexSort = bibtexSort;
exports.bibtexFormat = bibtexFormat;
const vscode = __importStar(require("vscode"));
const latex_utensils_1 = require("latex-utensils");
const lw_1 = require("../../lw");
const logger = lw_1.lw.log('Format', 'Bib');
/**
 * Read the indentation from vscode configuration
 *
 * @param tab VSCode configuration for bibtex-format.tab
 * @return the indentation as a string or undefined if the configuration variable is not correct
 */
function getBibtexFormatTab(tab) {
    if (tab === 'tab') {
        return '\t';
    }
    else {
        const res = /^(\d+)( spaces)?$/.exec(tab);
        if (res) {
            const nSpaces = parseInt(res[1], 10);
            return ' '.repeat(nSpaces);
        }
        else {
            return;
        }
    }
}
function getBibtexFormatConfig(scope) {
    const config = vscode.workspace.getConfiguration('latex-workshop', scope);
    const leftright = config.get('bibtex-format.surround') === 'Curly braces' ? ['{', '}'] : ['"', '"'];
    let tabs = getBibtexFormatTab(config.get('bibtex-format.tab'));
    if (tabs === undefined) {
        logger.log(`Wrong value for bibtex-format.tab: ${config.get('bibtex-format.tab')}`);
        logger.log('Setting bibtex-format.tab to \'2 spaces\'');
        tabs = '  ';
    }
    const formatConfig = {
        tab: tabs,
        case: config.get('bibtex-format.case'),
        left: leftright[0],
        right: leftright[1],
        trailingComma: config.get('bibtex-format.trailingComma'),
        sort: config.get('bibtex-format.sortby'),
        alignOnEqual: config.get('bibtex-format.align-equal.enabled'),
        sortFields: config.get('bibtex-fields.sort.enabled'),
        fieldsOrder: config.get('bibtex-fields.order'),
        firstEntries: config.get('bibtex-entries.first')
    };
    logger.log(`Bibtex format config: ${JSON.stringify(formatConfig)}`);
    return formatConfig;
}
/**
 * Sorting function for bibtex entries
 * @param keys Array of sorting keys
 */
function bibtexSort(duplicates, config) {
    return (a, b) => bibtexSortSwitch(a, b, duplicates, config);
}
function bibtexSortSwitch(a, b, duplicates, config) {
    const firstEntryCompare = bibtexSortFirstEntries(config.firstEntries, a, b);
    if (firstEntryCompare !== 0) {
        return firstEntryCompare;
    }
    const keys = config.sort;
    let r = 0;
    for (const key of keys) {
        // Select the appropriate sort function
        switch (key) {
            case 'key':
                r = bibtexSortByKey(a, b);
                break;
            case 'year-desc':
                r = -bibtexSortByField('year', a, b, config);
                break;
            case 'type':
                r = bibtexSortByType(a, b);
                break;
            default:
                r = bibtexSortByField(key, a, b, config);
        }
        // Compare until different
        if (r !== 0) {
            break;
        }
    }
    if (r === 0 && latex_utensils_1.bibtexParser.isEntry(a)) {
        // It seems that items earlier in the list appear as the variable b here, rather than a
        duplicates.add(a);
    }
    return r;
}
/**
 * If one of the entries `a` or `b` is in `firstEntries` or `stickyEntries`, return an order.
 * Otherwise, return undefined
 */
function bibtexSortFirstEntries(firstEntries, a, b) {
    const aFirst = firstEntries.includes(a.entryType);
    const bFirst = firstEntries.includes(b.entryType);
    if (aFirst && !bFirst) {
        return -1;
    }
    else if (!aFirst && bFirst) {
        return 1;
    }
    else if (aFirst && bFirst) {
        const aIndex = firstEntries.indexOf(a.entryType);
        const bIndex = firstEntries.indexOf(b.entryType);
        if (aIndex < bIndex) {
            return -1;
        }
        else if (aIndex > bIndex) {
            return 1;
        }
        else {
            return 0;
        }
    }
    return 0;
}
/**
 * Handles all sorting keys that are some bibtex field name
 * @param fieldName which field name to sort by
 */
function bibtexSortByField(fieldName, a, b, config) {
    let fieldA = '';
    let fieldB = '';
    if (latex_utensils_1.bibtexParser.isEntry(a)) {
        for (let i = 0; i < a.content.length; i++) {
            if (a.content[i].name === fieldName) {
                fieldA = fieldToString(a.content[i].value, '', config);
                break;
            }
        }
    }
    if (latex_utensils_1.bibtexParser.isEntry(b)) {
        for (let i = 0; i < b.content.length; i++) {
            if (b.content[i].name === fieldName) {
                fieldB = fieldToString(b.content[i].value, '', config);
                break;
            }
        }
    }
    // Remove braces to sort properly
    fieldA = fieldA.replace(/{|}/g, '');
    fieldB = fieldB.replace(/{|}/g, '');
    return fieldA.localeCompare(fieldB);
}
function bibtexSortByKey(a, b) {
    let aKey = undefined;
    let bKey = undefined;
    if (latex_utensils_1.bibtexParser.isEntry(a)) {
        aKey = a.internalKey;
    }
    if (latex_utensils_1.bibtexParser.isEntry(b)) {
        bKey = b.internalKey;
    }
    if (!aKey && !bKey) {
        return 0;
    }
    else if (!aKey) {
        return -1; // sort undefined keys first
    }
    else if (!bKey) {
        return 1;
    }
    else {
        return aKey.localeCompare(bKey);
    }
}
function bibtexSortByType(a, b) {
    return a.entryType.localeCompare(b.entryType);
}
/**
 * Creates an aligned string from a bibtexParser.Entry
 * @param entry the bibtexParser.Entry
 */
function bibtexFormat(entry, config) {
    let s = '';
    s += '@' + entry.entryType + '{' + (entry.internalKey ? entry.internalKey : '');
    // Find the longest field name in entry
    let maxFieldLength = 0;
    if (config.alignOnEqual) {
        entry.content.forEach(field => {
            maxFieldLength = Math.max(maxFieldLength, field.name.length);
        });
    }
    let fields = entry.content;
    if (config.sortFields) {
        fields = entry.content.sort(bibtexSortFields(config.fieldsOrder));
    }
    fields.forEach(field => {
        s += ',\n' + config.tab + (config.case === 'lowercase' ? field.name : field.name.toUpperCase());
        let indent = config.tab + ' '.repeat(field.name.length);
        if (config.alignOnEqual) {
            const adjustedLength = ' '.repeat(maxFieldLength - field.name.length);
            s += adjustedLength;
            indent += adjustedLength;
        }
        s += ' = ';
        indent += ' '.repeat(' = '.length + config.left.length);
        s += fieldToString(field.value, indent, config);
    });
    if (config.trailingComma) {
        s += ',';
    }
    s += '\n}';
    return s;
}
/**
 * Convert a bibtexParser.FieldValue to a string
 * @param field the bibtexParser.FieldValue to parse
 * @param prefix what to add to every but the first line of a multiline field.
 */
function fieldToString(field, prefix, config) {
    const left = config.left;
    const right = config.right;
    switch (field.kind) {
        case 'abbreviation':
        case 'number':
            return field.content;
        case 'text_string': {
            if (prefix !== '') {
                const lines = field.content.split(/\r\n|\r|\n/g);
                for (let i = 1; i < lines.length; i++) {
                    lines[i] = prefix + lines[i].trimStart();
                }
                return left + lines.join('\n') + right;
            }
            else {
                return left + field.content + right;
            }
        }
        case 'concat':
            return field.content.map(value => fieldToString(value, prefix, config)).reduce((acc, cur) => { return acc + ' # ' + cur; });
        default:
            return '';
    }
}
/**
 * Sorting function for bibtex entries
 * @param keys Array of sorting keys
 */
function bibtexSortFields(keys) {
    return function (a, b) {
        const indexA = keys.indexOf(a.name);
        const indexB = keys.indexOf(b.name);
        if (indexA === -1 && indexB === -1) {
            return a.name.localeCompare(b.name);
        }
        else if (indexA === -1) {
            return 1;
        }
        else if (indexB === -1) {
            return -1;
        }
        else {
            return indexA - indexB;
        }
    };
}
//# sourceMappingURL=utils.js.map