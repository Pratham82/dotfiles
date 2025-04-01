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
exports.onMath = onMath;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../../lw");
const cursor_1 = require("./cursor");
const utils_1 = require("./utils");
const logger = lw_1.lw.log('Preview', 'Math');
async function onMath(document, tex, macros) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const scale = configuration.get('hover.preview.scale');
    let s = await (0, cursor_1.renderCursor)(document, tex, (0, utils_1.getColor)());
    s = (0, utils_1.mathjaxify)(s, tex.envname);
    const typesetArg = macros + (0, utils_1.stripTeX)(s, macros);
    const typesetOpts = { scale, color: (0, utils_1.getColor)() };
    try {
        const markdown = (0, utils_1.svg2DataUrl)(await lw_1.lw.preview.mathjax.typeset(typesetArg, typesetOpts));
        return new vscode.Hover(new vscode.MarkdownString((0, utils_1.addDummyCodeBlock)(`![equation](${markdown})`)), tex.range);
    }
    catch (e) {
        if (macros !== '') {
            logger.log(`Failed rendering MathJax ${typesetArg} . Try removing macro definitions.`);
            return onMath(document, tex, '');
        }
        else {
            logger.logError(`Failed rendering MathJax ${typesetArg} .`, e);
            throw e;
        }
    }
}
//# sourceMappingURL=onmath.js.map