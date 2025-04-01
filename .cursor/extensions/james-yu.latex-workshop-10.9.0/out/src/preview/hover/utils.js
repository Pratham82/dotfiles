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
exports.getColor = getColor;
exports.mathjaxify = mathjaxify;
exports.stripTeX = stripTeX;
exports.addDummyCodeBlock = addDummyCodeBlock;
exports.svg2DataUrl = svg2DataUrl;
const vscode = __importStar(require("vscode"));
const utils_1 = require("../../utils/utils");
function getColor() {
    return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Light ? '#000000' : '#ffffff';
}
function mathjaxify(tex, envname, opt = { stripLabel: true }) {
    // remove TeX comments
    let s = (0, utils_1.stripComments)(tex);
    // remove \label{...}
    if (opt.stripLabel) {
        s = s.replace(/\\label\{.*?\}/g, '');
    }
    if (envname.match(/^(aligned|alignedat|array|Bmatrix|bmatrix|cases|CD|gathered|matrix|pmatrix|smallmatrix|split|subarray|Vmatrix|vmatrix)$/)) {
        s = '\\begin{equation}' + s + '\\end{equation}';
    }
    // #4528
    s = s.replace(/\\llbracket(?!\w)/g, '\\left[\\!\\left[')
        .replace(/\\rrbracket(?!\w)/g, '\\right]\\!\\right]');
    return s;
}
function stripTeX(tex, macros) {
    // First remove math env declaration
    if (tex.startsWith('$$') && tex.endsWith('$$')) {
        tex = tex.slice(2, tex.length - 2);
    }
    else if (tex.startsWith('$') && tex.endsWith('$')) {
        tex = tex.slice(1, tex.length - 1);
    }
    else if (tex.startsWith('\\(') && tex.endsWith('\\)')) {
        tex = tex.slice(2, tex.length - 2);
    }
    else if (tex.startsWith('\\[') && tex.endsWith('\\]')) {
        tex = tex.slice(2, tex.length - 2);
    }
    // Then remove the star variant of new macros
    [...macros.matchAll(/\\newcommand\{(.*?)\}/g)].forEach(match => {
        tex = tex.replaceAll(match[1] + '*', match[1]);
    });
    return tex;
}
function addDummyCodeBlock(md) {
    // We need a dummy code block in hover to make the width of hover larger.
    const dummyCodeBlock = '```\n```';
    return dummyCodeBlock + '\n' + md + '\n' + dummyCodeBlock;
}
function svg2DataUrl(xml) {
    // We have to call encodeURIComponent and unescape because SVG can includes non-ASCII characters.
    // We have to encode them before converting them to base64.
    const svg64 = Buffer.from(unescape(encodeURIComponent(xml)), 'binary').toString('base64');
    const b64Start = 'data:image/svg+xml;base64,';
    return b64Start + svg64;
}
//# sourceMappingURL=utils.js.map