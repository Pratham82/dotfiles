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
exports.onRef = onRef;
exports.ref2svg = ref2svg;
exports.tex2svg = tex2svg;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const utils_1 = require("./utils");
const parse_1 = require("../../parse");
const logger = lw_1.lw.log('Preview', 'Ref');
async function onRef(document, position, refData, ctoken) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const line = refData.position.line;
    const link = vscode.Uri.parse('command:latex-workshop.synctexto').with({ query: JSON.stringify([line, refData.file]) });
    const mdLink = new vscode.MarkdownString(`[View on pdf](${link})`);
    mdLink.isTrusted = true;
    if (configuration.get('hover.ref.enabled') && refData.math) {
        return onRefMathJax(refData, ctoken);
    }
    const md = '```latex\n' + refData.documentation + '\n```\n';
    const refRange = document.getWordRangeAtPosition(position, /\{.*?\}/);
    const refMessage = refNumberMessage(refData);
    if (refMessage !== undefined && configuration.get('hover.ref.number.enabled')) {
        return new vscode.Hover([md, refMessage, mdLink], refRange);
    }
    return new vscode.Hover([md, mdLink], refRange);
}
async function onRefMathJax(refData, ctoken) {
    const md = await ref2svg(refData, ctoken);
    const line = refData.position.line;
    const link = vscode.Uri.parse('command:latex-workshop.synctexto').with({ query: JSON.stringify([line, refData.file]) });
    const mdLink = new vscode.MarkdownString(`[View on pdf](${link})`);
    mdLink.isTrusted = true;
    return new vscode.Hover([(0, utils_1.addDummyCodeBlock)(`![equation](${md})`), mdLink], refData.math?.range);
}
function refNumberMessage(refData) {
    if (refData.prevIndex) {
        const refNum = refData.prevIndex.refNumber;
        const refMessage = `numbered ${refNum} at last compilation`;
        return refMessage;
    }
    return;
}
async function ref2svg(refData, ctoken) {
    if (refData.math === undefined) {
        return '';
    }
    const texMath = refData.math;
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const macros = await parse_1.parser.find.macro(ctoken);
    let texStr = undefined;
    if (refData.prevIndex !== undefined && configuration.get('hover.ref.number.enabled')) {
        const tag = refData.prevIndex.refNumber;
        const texString = replaceLabelWithTag(texMath.texString, refData.label, tag);
        texStr = (0, utils_1.mathjaxify)(texString, texMath.envname, { stripLabel: false });
    }
    const svg = await tex2svg(texMath, macros, texStr);
    return svg.svgDataUrl;
}
function replaceLabelWithTag(tex, refLabel, tag) {
    const texWithoutTag = tex.replace(/\\tag\{(\{[^{}]*?\}|.)*?\}/g, '');
    let newTex = texWithoutTag.replace(/\\label\{(.*?)\}/g, (_matchString, matchLabel, _offset, _s) => {
        if (refLabel) {
            if (refLabel === matchLabel) {
                if (tag) {
                    return `\\tag{${tag}}`;
                }
                else {
                    return `\\tag{${matchLabel}}`;
                }
            }
            return '\\notag';
        }
        else {
            return `\\tag{${matchLabel}}`;
        }
    });
    // To work around a bug of \tag with multi-line environments,
    // we have to put \tag after the environments.
    // See https://github.com/mathjax/MathJax/issues/1020
    newTex = newTex.replace(/(\\tag\{.*?\})([\r\n\s]*)(\\begin\{(aligned|alignedat|gathered|split)\}[^]*?\\end\{\4\})/gm, '$3$2$1');
    newTex = newTex.replace(/^\\begin\{(\w+?)\}/, '\\begin{$1*}');
    newTex = newTex.replace(/\\end\{(\w+?)\}$/, '\\end{$1*}');
    return newTex;
}
async function tex2svg(tex, macros, texStr) {
    macros = macros ?? await parse_1.parser.find.macro();
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const scale = configuration.get('hover.preview.scale');
    texStr = texStr ?? (0, utils_1.mathjaxify)(tex.texString, tex.envname);
    texStr = macros + (0, utils_1.stripTeX)(texStr, macros);
    try {
        const data = (0, utils_1.svg2DataUrl)(await lw_1.lw.preview.mathjax.typeset(texStr, { scale, color: (0, utils_1.getColor)() }));
        return { svgDataUrl: data, macros };
    }
    catch (e) {
        logger.logError(`Failed rendering MathJax ${texStr} .`, e);
        throw e;
    }
}
//# sourceMappingURL=onref.js.map