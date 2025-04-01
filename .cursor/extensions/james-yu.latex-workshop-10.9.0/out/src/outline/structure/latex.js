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
exports.outline = void 0;
exports.construct = construct;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("../../lw");
const types_1 = require("../../types");
const utils_1 = require("../../utils/utils");
const inputfilepath_1 = require("../../utils/inputfilepath");
const parser_1 = require("../../utils/parser");
const logger = lw_1.lw.log('Structure', 'LaTeX');
async function construct(filePath = undefined, subFile = true) {
    filePath = filePath ?? lw_1.lw.root.file.path;
    if (filePath === undefined) {
        return [];
    }
    const config = refreshLaTeXModelConfig(subFile);
    const structs = {};
    await constructFile(filePath, config, structs);
    // In rare cases, the following struct may be undefined. Typically in tests
    // where roots are changed rapidly.
    let struct = subFile ? insertSubFile(structs) : structs[filePath] ?? [];
    struct = nestNonSection(struct);
    struct = nestSection(struct, config);
    fixSectionToLine(struct, config, Number.MAX_SAFE_INTEGER);
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    if (subFile && configuration.get('view.outline.floats.number.enabled')) {
        struct = addFloatNumber(struct);
    }
    if (subFile && configuration.get('view.outline.numbers.enabled')) {
        struct = addSectionNumber(struct, config);
    }
    return struct;
}
async function constructFile(filePath, config, structs) {
    if (structs[filePath] !== undefined) {
        return;
    }
    await lw_1.lw.cache.wait(filePath);
    const content = lw_1.lw.cache.get(filePath)?.content;
    const ast = lw_1.lw.cache.get(filePath)?.ast;
    if (!content || !ast) {
        logger.log(`Error loading ${content ? 'AST' : 'content'} during structuring: ${filePath} .`);
        return;
    }
    // Get a list of rnw child chunks
    const rnwSub = await parseRnwChildMacro(content, filePath, lw_1.lw.root.file.path || '');
    // Parse each base-level node. If the node has contents, that function
    // will be called recursively.
    const rootElement = { children: [] };
    structs[filePath] = rootElement.children;
    let inAppendix = false;
    for (const node of ast.content) {
        if (['string', 'parbreak', 'whitespace'].includes(node.type)) {
            continue;
        }
        // Appendix is a one-way journey. Once in it, always in it.
        if (await parseNode(node, rnwSub, rootElement, filePath, config, structs, inAppendix)) {
            inAppendix = true;
        }
    }
}
function chooseCaption(...args) {
    for (const arg of args) {
        if ((arg?.content?.length ?? 0) > 0) {
            return (0, parser_1.argContentToStr)(arg?.content ?? []);
        }
    }
    return '';
}
async function parseNode(node, rnwSub, root, filePath, config, structs, inAppendix) {
    const attributes = {
        lineFr: (node.position?.start.line ?? 1) - 1,
        lineTo: (node.position?.end.line ?? 1) - 1,
        filePath, children: []
    };
    let element;
    if (node.type === 'macro' && config.macros.secs.includes(node.content) && node.args?.[2].openMark === '{') {
        // To use a macro as an outline item, the macro must have an explicit
        // mandatory argument e.g. \section{} instead of \section. This is to
        // ignore cases like \titleformat{\section} when \titleformat is not
        // globbing arguments in unified-latex.
        element = {
            type: node.args?.[0]?.content[0] ? types_1.TeXElementType.SectionAst : types_1.TeXElementType.Section,
            name: node.content,
            label: chooseCaption(node.args?.[1], node.args?.[2]),
            appendix: inAppendix,
            ...attributes
        };
    }
    else if (node.type === 'macro' && config.macros.cmds.includes(node.content)) {
        const argStr = (0, parser_1.argContentToStr)(node.args?.[2]?.content || []);
        element = {
            type: types_1.TeXElementType.Macro,
            name: node.content,
            label: `#${node.content}` + (argStr ? `: ${argStr}` : ''),
            ...attributes
        };
    }
    else if (node.type === 'macro' && node.content === 'appendix') {
        inAppendix = true;
    }
    else if ((node.type === 'environment') && node.env === 'frame') {
        const frameTitleMacro = node.content.find(sub => sub.type === 'macro' && sub.content === 'frametitle');
        const caption = chooseCaption(node.args?.[3], frameTitleMacro?.args?.[2]);
        element = {
            type: types_1.TeXElementType.Environment,
            name: node.env,
            label: `${node.env.charAt(0).toUpperCase()}${node.env.slice(1)}` + (config.caption && caption ? `: ${caption}` : ''),
            ...attributes
        };
    }
    else if ((node.type === 'environment') && ((node.env === 'figure' || node.env === 'figure*') && config.macros.envs.includes('figure') ||
        (node.env === 'table' || node.env === 'table*') && config.macros.envs.includes('table'))) {
        const captionMacro = node.content.find(sub => sub.type === 'macro' && sub.content === 'caption');
        const caption = chooseCaption(captionMacro?.args?.[0], captionMacro?.args?.[1]);
        if (node.env.endsWith('*')) {
            node.env = node.env.slice(0, -1);
        }
        element = {
            type: types_1.TeXElementType.Environment,
            name: node.env,
            label: `${node.env.charAt(0).toUpperCase()}${node.env.slice(1)}` + (config.caption && caption ? `: ${caption}` : ''),
            ...attributes
        };
    }
    else if ((node.type === 'environment') && (node.env === 'macro' || node.env === 'environment')) {
        // DocTeX: \begin{macro}{<macro>}
        const caption = node.content[0]?.content[0];
        element = {
            type: types_1.TeXElementType.Environment,
            name: node.env,
            label: `${node.env.charAt(0).toUpperCase()}${node.env.slice(1)}` + (config.caption && caption ? `: ${caption.content}` : ''),
            ...attributes
        };
    }
    else if ((node.type === 'environment' || node.type === 'mathenv') && config.macros.envs.includes(node.env)) {
        element = {
            type: types_1.TeXElementType.Environment,
            name: node.env,
            label: `${node.env.charAt(0).toUpperCase()}${node.env.slice(1)}`,
            ...attributes
        };
    }
    else if (node.type === 'macro' && ['input', 'InputIfFileExists', 'include', 'SweaveInput', 'subfile', 'loadglsentries', 'markdownInput'].includes(node.content)) {
        const arg0 = (0, inputfilepath_1.sanitizeInputFilePath)((0, parser_1.argContentToStr)(node.args?.[0]?.content || []));
        const subFile = await (0, utils_1.resolveFile)([path.dirname(filePath), path.dirname(lw_1.lw.root.file.path || ''), ...config.texDirs], arg0);
        if (subFile) {
            element = {
                type: types_1.TeXElementType.SubFile,
                name: node.content,
                label: config.subFile ? subFile : arg0,
                ...attributes
            };
            if (config.subFile) {
                await constructFile(subFile, config, structs);
            }
        }
    }
    else if (node.type === 'macro' && ['import', 'inputfrom', 'includefrom'].includes(node.content)) {
        const arg0 = (0, inputfilepath_1.sanitizeInputFilePath)((0, parser_1.argContentToStr)(node.args?.[0]?.content || []));
        const arg1 = (0, inputfilepath_1.sanitizeInputFilePath)((0, parser_1.argContentToStr)(node.args?.[1]?.content || []));
        const subFile = await (0, utils_1.resolveFile)([arg0, path.join(path.dirname(lw_1.lw.root.file.path || ''), arg0)], arg1);
        if (subFile) {
            element = {
                type: types_1.TeXElementType.SubFile,
                name: node.content,
                label: config.subFile ? subFile : arg1,
                ...attributes
            };
            if (config.subFile) {
                await constructFile(subFile, config, structs);
            }
        }
    }
    else if (node.type === 'macro' && ['subimport', 'subinputfrom', 'subincludefrom'].includes(node.content)) {
        const arg0 = (0, inputfilepath_1.sanitizeInputFilePath)((0, parser_1.argContentToStr)(node.args?.[0]?.content || []));
        const arg1 = (0, inputfilepath_1.sanitizeInputFilePath)((0, parser_1.argContentToStr)(node.args?.[1]?.content || []));
        const subFile = await (0, utils_1.resolveFile)([path.dirname(filePath)], path.join(arg0, arg1));
        if (subFile) {
            element = {
                type: types_1.TeXElementType.SubFile,
                name: node.content,
                label: config.subFile ? subFile : arg1,
                ...attributes
            };
            if (config.subFile) {
                await constructFile(subFile, config, structs);
            }
        }
    }
    if (rnwSub.length > 0 && rnwSub[rnwSub.length - 1].line >= attributes.lineFr) {
        const rnw = rnwSub.pop();
        if (rnw !== undefined) {
            root.children.push({
                type: types_1.TeXElementType.SubFile,
                name: 'RnwChild',
                label: config.subFile ? rnw.subFile : rnw.path,
                lineFr: attributes.lineFr,
                lineTo: attributes.lineTo,
                filePath, children: []
            });
            if (config.subFile) {
                await constructFile(rnw.subFile, config, structs);
            }
        }
    }
    if (element !== undefined) {
        root.children.push(element);
        root = element;
    }
    if ('content' in node && typeof node.content !== 'string') {
        for (const sub of node.content) {
            if (['string', 'parbreak', 'whitespace'].includes(sub.type)) {
                continue;
            }
            inAppendix = await parseNode(sub, rnwSub, root, filePath, config, structs, inAppendix);
        }
    }
    return inAppendix;
}
function insertSubFile(structs, struct, traversed) {
    if (lw_1.lw.root.file.path === undefined) {
        return [];
    }
    struct = JSON.parse(JSON.stringify(struct ?? structs[lw_1.lw.root.file.path] ?? []));
    traversed = traversed ?? [lw_1.lw.root.file.path];
    let elements = [];
    for (const element of struct) {
        if (element.type === types_1.TeXElementType.SubFile
            && structs[element.label]
            && !traversed.includes(element.label)) {
            elements = [...elements, ...insertSubFile(structs, structs[element.label], [...traversed, element.label])];
            continue;
        }
        if (element.children.length > 0) {
            element.children = insertSubFile(structs, element.children);
        }
        elements.push(element);
    }
    return elements;
}
function nestNonSection(struct) {
    const elements = [];
    let currentSection;
    for (const element of struct) {
        if (element.type === types_1.TeXElementType.Section || element.type === types_1.TeXElementType.SectionAst) {
            elements.push(element);
            currentSection = element;
        }
        else if (currentSection === undefined) {
            elements.push(element);
        }
        else {
            currentSection.children.push(element);
        }
        if (element.children.length > 0) {
            element.children = nestNonSection(element.children);
        }
    }
    return elements;
}
function nestSection(struct, config) {
    const stack = [];
    const elements = [];
    for (const element of struct) {
        if (element.type !== types_1.TeXElementType.Section && element.type !== types_1.TeXElementType.SectionAst) {
            elements.push(element);
        }
        else if (stack.length === 0) {
            stack.push(element);
            elements.push(element);
        }
        else if (config.secIndex[element.name] <= config.secIndex[stack[0].name]) {
            stack.length = 0;
            stack.push(element);
            elements.push(element);
        }
        else if (config.secIndex[element.name] > config.secIndex[stack[stack.length - 1].name]) {
            stack[stack.length - 1].children.push(element);
            stack.push(element);
        }
        else {
            while (config.secIndex[element.name] <= config.secIndex[stack[stack.length - 1].name]) {
                stack.pop();
            }
            stack[stack.length - 1].children.push(element);
            stack.push(element);
        }
    }
    return elements;
}
function fixSectionToLine(structure, config, lastLine) {
    const sections = structure.filter(section => config.secIndex[section.name] !== undefined);
    sections.forEach(section => {
        const sameFileSections = sections.filter(candidate => (candidate.filePath === section.filePath) &&
            (candidate.lineFr >= section.lineFr) &&
            (candidate !== section));
        if (sameFileSections.length > 0 && sameFileSections[0].lineFr === section.lineFr) {
            // On the same line, e.g., \section{one}\section{two}
            return;
        }
        else if (sameFileSections.length > 0) {
            section.lineTo = sameFileSections[0].lineFr - 1;
        }
        else {
            section.lineTo = lastLine;
        }
        if (section.children.length > 0) {
            fixSectionToLine(section.children, config, section.lineTo);
        }
    });
}
function addFloatNumber(struct, counter = {}) {
    for (const element of struct) {
        if (element.type === types_1.TeXElementType.Environment && element.name !== 'macro' && element.name !== 'environment') {
            counter[element.name] = (counter[element.name] ?? 0) + 1;
            const parts = element.label.split(':');
            parts[0] += ` ${(counter[element.name] ?? 0).toString()}`;
            element.label = parts.join(':');
        }
        if (element.children.length > 0) {
            addFloatNumber(element.children, counter);
        }
    }
    return struct;
}
function addSectionNumber(struct, config, tag, lowest) {
    tag = tag ?? '';
    lowest = lowest ?? Math.min(...struct
        .filter(element => config.secIndex[element.name] !== undefined)
        .map(element => config.secIndex[element.name]));
    let counter = {};
    let inAppendix = false;
    for (const element of struct) {
        if (element.appendix && !inAppendix) {
            inAppendix = true;
            counter = {};
        }
        if (config.secIndex[element.name] === undefined) {
            continue;
        }
        if (element.type === types_1.TeXElementType.Section) {
            counter[config.secIndex[element.name]] = (counter[config.secIndex[element.name]] ?? 0) + 1;
        }
        let sectionNumber = tag +
            '0.'.repeat(config.secIndex[element.name] - lowest) +
            (counter[config.secIndex[element.name]] ?? 0).toString();
        if (inAppendix) {
            const segments = sectionNumber.split('.');
            segments[0] = String.fromCharCode(parseInt(sectionNumber.split('.')[0]) + 64);
            sectionNumber = segments.join('.');
        }
        element.label = `${element.type === types_1.TeXElementType.Section ? sectionNumber : '*'} ${element.label}`;
        if (element.children.length > 0) {
            addSectionNumber(element.children, config, sectionNumber + '.', config.secIndex[element.name] + 1);
        }
    }
    return struct;
}
async function parseRnwChildMacro(content, file, rootFile) {
    const children = [];
    const childRegExp = new inputfilepath_1.InputFileRegExp();
    while (true) {
        const result = await childRegExp.execChild(content, file, rootFile);
        if (!result) {
            break;
        }
        const line = (content.slice(0, result.match.index).match(/\n/g) || []).length;
        children.push({ subFile: result.path, path: result.match.path, line });
    }
    return children;
}
function refreshLaTeXModelConfig(subFile = true, defaultFloats = ['frame']) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const structConfig = {
        macros: {
            cmds: configuration.get('view.outline.commands'),
            envs: configuration.get('view.outline.floats.enabled') ? ['figure', 'table', ...defaultFloats] : defaultFloats,
            secs: []
        },
        secIndex: {},
        texDirs: configuration.get('latex.texDirs'),
        subFile,
        caption: configuration.get('view.outline.floats.caption.enabled')
    };
    const hierarchy = configuration.get('view.outline.sections');
    hierarchy.forEach((sec, index) => {
        sec.split('|').forEach(cmd => {
            structConfig.secIndex[cmd] = index;
        });
    });
    structConfig.macros.secs = hierarchy.map(sec => sec.split('|')).flat();
    return structConfig;
}
exports.outline = {
    refreshLaTeXModelConfig,
    parseNode,
    nestNonSection,
    nestSection,
    addFloatNumber,
    addSectionNumber
};
//# sourceMappingURL=latex.js.map