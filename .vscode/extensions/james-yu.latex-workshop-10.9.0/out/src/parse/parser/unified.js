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
const workerpool = __importStar(require("workerpool"));
// import { getParser } from '@unified-latex/unified-latex-util-parse'
// import { attachMacroArgs } from '@unified-latex/unified-latex-util-arguments'
const latex_utensils_1 = require("latex-utensils");
// @ts-expect-error Load unified.js from /out/src/...
const unified_js_1 = require("../../../../resources/unified.js");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
let unifiedParser = (0, unified_js_1.getParser)({ flags: { autodetectExpl3AndAtLetter: true } });
function parseLaTeX(content) {
    return unifiedParser.parse(content);
}
function parseArgs(ast, macros) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (0, unified_js_1.attachMacroArgs)(ast, macros);
}
function reset(macros, environments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    unifiedParser = (0, unified_js_1.getParser)({ macros, environments, flags: { autodetectExpl3AndAtLetter: true } });
}
function parseBibTeX(s) {
    try {
        return latex_utensils_1.bibtexParser.parse(s);
    }
    catch (err) {
        if (latex_utensils_1.bibtexParser.isSyntaxError(err)) {
            return JSON.stringify(err);
        }
        return undefined;
    }
}
const worker = {
    parseLaTeX,
    parseArgs,
    reset,
    parseBibTeX
};
workerpool.worker(worker);
//# sourceMappingURL=unified.js.map