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
exports.CmdEnvSuggestion = void 0;
exports.splitSignatureString = splitSignatureString;
exports.filterNonLetterSuggestions = filterNonLetterSuggestions;
exports.computeFilteringRange = computeFilteringRange;
exports.filterArgumentHint = filterArgumentHint;
const vscode = __importStar(require("vscode"));
/**
 * Return {name, args} from a signature string `name` + `args`
 */
function splitSignatureString(signature) {
    const i = signature.search(/[[{]/);
    if (i > -1) {
        return {
            name: signature.substring(0, i),
            args: signature.substring(i, undefined)
        };
    }
    else {
        return {
            name: signature,
            args: ''
        };
    }
}
class CmdEnvSuggestion extends vscode.CompletionItem {
    constructor(label, packageName, keys, keyPos, signature, kind, ifCond, unusual) {
        super(label, kind);
        this.label = label;
        this.packageName = packageName;
        this.keys = keys;
        this.keyPos = keyPos;
        this.signature = signature;
        this.ifCond = ifCond;
        this.unusual = unusual;
    }
    /**
     * Return the signature, ie the name + {} for mandatory arguments + [] for optional arguments.
     * The leading backward slash is not part of the signature
     */
    signatureAsString() {
        return this.signature.name + this.signature.args;
    }
    /**
     * Return the name without the arguments
     * The leading backward slash is not part of the signature
     */
    name() {
        return this.signature.name;
    }
    hasOptionalArgs() {
        return this.signature.args.includes('[');
    }
}
exports.CmdEnvSuggestion = CmdEnvSuggestion;
function filterNonLetterSuggestions(suggestions, typedText, pos) {
    if (typedText.match(/[^a-zA-Z]/)) {
        const exactSuggestion = suggestions.filter(entry => entry.label.startsWith(typedText));
        if (exactSuggestion.length > 0) {
            return exactSuggestion.map(item => {
                item.range = new vscode.Range(pos.translate(undefined, -typedText.length), pos);
                return item;
            });
        }
    }
    return suggestions;
}
function computeFilteringRange(line, position) {
    const curlyStart = line.lastIndexOf('{', position.character);
    const commaStart = line.lastIndexOf(',', position.character);
    const startPos = Math.max(curlyStart, commaStart);
    if (startPos >= 0) {
        return new vscode.Range(position.line, startPos + 1, position.line, position.character);
    }
    return;
}
function filterArgumentHint(suggestions) {
    if (!vscode.workspace.getConfiguration('latex-workshop').get('intellisense.argumentHint.enabled')) {
        suggestions.forEach(item => {
            if (!item.insertText) {
                return;
            }
            if (typeof item.insertText === 'string') {
                item.insertText = item.insertText.replace(/\$\{(\d+):[^$}]*\}/g, '$${$1}');
            }
            else {
                item.insertText = new vscode.SnippetString(item.insertText.value.replace(/\$\{(\d+):[^$}]*\}/g, '$${$1}'));
            }
        });
    }
}
//# sourceMappingURL=completerutils.js.map