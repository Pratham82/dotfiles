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
exports.atSuggestion = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const lw_1 = require("../../lw");
const utils_1 = require("../../utils/utils");
exports.provider = { from };
exports.atSuggestion = {
    initialize
};
const data = {
    triggerCharacter: '',
    escapedTriggerCharacter: '',
    suggestions: []
};
lw_1.lw.onConfigChange(['intellisense.atSuggestion.user'], initialize);
// AtSuggestion is not initialized here, but in AtSuggestionCompleter
function initialize(triggerCharacter) {
    if (triggerCharacter) {
        data.triggerCharacter = triggerCharacter;
        data.escapedTriggerCharacter = (0, utils_1.escapeRegExp)(data.triggerCharacter);
    }
    const userSnippets = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.user');
    data.suggestions.length = 0;
    Object.entries(userSnippets).forEach(([prefix, body]) => {
        if (body === '') {
            return;
        }
        const completionItem = new vscode.CompletionItem(prefix.replace('@', data.triggerCharacter), vscode.CompletionItemKind.Function);
        completionItem.insertText = new vscode.SnippetString(body);
        completionItem.documentation = 'User defined @suggestion';
        completionItem.detail = 'User defined @suggestion';
        data.suggestions.push(completionItem);
    });
    const suggestions = JSON.parse(fs.readFileSync(`${lw_1.lw.extensionRoot}/data/at-suggestions.json`).toString());
    Object.values(suggestions).forEach(item => {
        if (item.prefix in userSnippets) {
            return;
        }
        const completionItem = new vscode.CompletionItem(item.prefix.replace('@', data.triggerCharacter), vscode.CompletionItemKind.Function);
        completionItem.insertText = new vscode.SnippetString(item.body);
        completionItem.documentation = new vscode.MarkdownString(item.description);
        completionItem.detail = item.description;
        data.suggestions.push(completionItem);
    });
}
function from(result, args) {
    const suggestions = provide(args.line, args.position);
    // Manually filter suggestions when there are several consecutive trigger characters
    const reg = new RegExp(data.escapedTriggerCharacter + '{2,}$');
    if (result[0].match(reg)) {
        const filteredSuggestions = suggestions.filter(item => item.label === result[0]);
        if (filteredSuggestions.length > 0) {
            return filteredSuggestions.map(item => {
                item.range = new vscode.Range(args.position.translate(undefined, -item.label.toString().length), args.position);
                return item;
            });
        }
    }
    return suggestions;
}
function provide(line, position) {
    let range = undefined;
    const startPos = line.lastIndexOf(data.triggerCharacter, position.character - 1);
    if (startPos >= 0) {
        range = new vscode.Range(position.line, startPos, position.line, position.character);
    }
    data.suggestions.forEach(suggestion => { suggestion.range = range; });
    return data.suggestions;
}
//# sourceMappingURL=atsuggestion.js.map