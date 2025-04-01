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
exports.AtProvider = exports.Provider = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const citation_1 = require("./completer/citation");
const environment_1 = require("./completer/environment");
const macro_1 = require("./completer/macro");
const subsuperscript_1 = require("./completer/subsuperscript");
const argument_1 = require("./completer/argument");
const class_1 = require("./completer/class");
const reference_1 = require("./completer/reference");
const package_1 = require("./completer/package");
const input_1 = require("./completer/input");
const glossary_1 = require("./completer/glossary");
const closeenv_1 = require("./completer/closeenv");
const atsuggestion_1 = require("./completer/atsuggestion");
const utils_1 = require("../utils/utils");
const logger = lw_1.lw.log('Intelli');
class Provider {
    provideCompletionItems(document, position) {
        const currentLine = document.lineAt(position.line).text;
        if (position.character > 1 && currentLine[position.character - 1] === '\\' && currentLine[position.character - 2] === '\\') {
            return;
        }
        return this.provide({
            uri: document.uri,
            langId: document.languageId,
            line: document.lineAt(position).text,
            position
        });
    }
    provide(args) {
        // Note that the order of the following array affects the result.
        // 'macro' must be at the last because it matches any macros.
        for (const type of ['citation', 'reference', 'environment', 'package', 'documentclass', 'input', 'subimport', 'import', 'includeonly', 'glossary', 'argument', 'macro', 'subsuper', 'closeenv']) {
            const suggestions = this.completion(type, args);
            if (suggestions.length > 0) {
                if (type === 'citation') {
                    const configuration = vscode.workspace.getConfiguration('latex-workshop');
                    if (configuration.get('intellisense.citation.type') === 'browser') {
                        setTimeout(() => citation_1.citation.browser(args), 10);
                        return [];
                    }
                }
                return suggestions;
            }
        }
        return [];
    }
    async resolveCompletionItem(item, ctoken) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        if (item.kind === vscode.CompletionItemKind.Reference) {
            if (!('file' in item) || !configuration.get('hover.ref.enabled')) {
                return item;
            }
            const refItem = item;
            if (!refItem.math) {
                return item;
            }
            const svgDataUrl = await lw_1.lw.preview.mathjax.ref2svg(refItem, ctoken);
            item.documentation = new vscode.MarkdownString(`![equation](${svgDataUrl})`);
            return item;
        }
        else if (item.kind === vscode.CompletionItemKind.File) {
            const preview = configuration.get('intellisense.includegraphics.preview.enabled');
            if (!preview) {
                return item;
            }
            const filePath = item.documentation;
            if (typeof filePath !== 'string') {
                return item;
            }
            const md = await lw_1.lw.preview.graph2md(filePath, { height: 190, width: 300 });
            if (md === undefined) {
                return item;
            }
            const ret = new vscode.CompletionItem(item.label, vscode.CompletionItemKind.File);
            ret.documentation = md;
            return ret;
        }
        else {
            return item;
        }
    }
    completion(type, args) {
        let reg;
        let provider;
        switch (type) {
            case 'citation':
                reg = /(?:\\[a-zA-Z]*[Cc]ite[a-zA-Z]*\*?(?:\([^[)]*\)){0,2}(?:<[^<>]*>|\[[^[\]]*\]|{[^{}]*})*{([^}]*)$)|(?:\\[a-zA-Z]*cquote*\*?(?:\[[^[\]]*\]){0,2}{([^}]*)$)|(?:\\bibentry{([^}]*)$)/;
                provider = citation_1.provider;
                break;
            case 'reference':
                reg = /(?:\\hyperref\[([^\]]*)(?!\])$)|(?:(?:\\(?!hyper)[a-zA-Z]*ref[a-zA-Z]*\*?(?:\[[^[\]]*\])?){([^}]*)$)|(?:\\[Cc][a-z]*refrange\*?{[^{}]*}{([^}]*)$)/;
                provider = reference_1.provider;
                break;
            case 'environment':
                reg = /(?:\\begin|\\end){([^}]*)$/;
                provider = environment_1.provider;
                break;
            case 'macro':
                reg = args.langId === 'latex-expl3' ? /\\([a-zA-Z_@]*(?::[a-zA-Z]*)?)$/ : /\\(\+?[a-zA-Z]*|(?:left|[Bb]ig{1,2}l)?[({[]?)$/;
                provider = macro_1.provider;
                break;
            case 'argument':
                reg = args.langId === 'latex-expl3' ? /\\([a-zA-Z_@]*(?::[a-zA-Z]*)?)((?:\[.*?\]|{.*?})*)[[{][^[\]{}]*$/ : /\\(\+?[a-zA-Z]*)((?:\[.*?\]|{.*?})*)[[{][^[\]{}]*$/;
                provider = argument_1.provider;
                break;
            case 'package':
                reg = /(?:\\usepackage|\\RequirePackage|\\RequirePackageWithOptions)(?:\[[^[\]]*\])*{([^}]*)$/;
                provider = package_1.provider;
                break;
            case 'documentclass':
                reg = /(?:\\documentclass(?:\[[^[\]]*\])*){([^}]*)$/;
                provider = class_1.provider;
                break;
            case 'input':
                reg = /\\(input|include|subfile|subfileinclude|includegraphics|includesvg|lstinputlisting|verbatiminput|loadglsentries|markdownInput)\*?(?:\[[^[\]]*\])*{([^}]*)$/;
                provider = input_1.inputProvider;
                break;
            case 'includeonly':
                reg = /\\(includeonly|excludeonly){(?:{[^}]*},)*(?:[^,]*,)*{?([^},]*)$/;
                provider = input_1.inputProvider;
                break;
            case 'import':
                reg = /\\(import|includefrom|inputfrom)\*?(?:{([^}]*)})?{([^}]*)$/;
                provider = input_1.importProvider;
                break;
            case 'subimport':
                reg = /\\(sub(?:import|includefrom|inputfrom))\*?(?:{([^}]*)})?{([^}]*)$/;
                provider = input_1.subimportProvider;
                break;
            case 'glossary':
                reg = /\\(gls(?:str)?(?:pl|text|first|fmt(?:text|short|long)|plural|firstplural|name|symbol|desc|disp|user(?:i|ii|iii|iv|v|vi))?|Acr(?:long|full|short)?(?:pl)?|ac[slf]?p?)(?:\[[^[\]]*\])?{([^}]*)$/i;
                provider = glossary_1.provider;
                break;
            case 'subsuper':
                reg = /(?:\^|_){([^}]*)$/;
                provider = subsuperscript_1.provider;
                break;
            case 'closeenv':
                reg = /(?:\\begin){([^}]*)}$/;
                provider = closeenv_1.provider;
                break;
            default:
                // This shouldn't be possible, so mark as error case in log.
                logger.log(`Error - trying to complete unknown type ${type}`);
                return [];
        }
        let lineToPos = args.line.substring(0, args.position.character);
        if (type === 'argument' && (lineToPos.includes('\\documentclass') || lineToPos.includes('\\usepackage'))) {
            // Remove braced values from documentclass and usepackage
            // This is to allow argument regexp to match the following type of lines:
            // \documentclass[aspectratio=169,t,fontset=none,xcolor={x11names},|]{ctexbeamer}
            lineToPos = lineToPos.replace(/{[^[\]{}]*}/g, '').replace(/\[[^[\]{}]*\]/g, '');
        }
        const result = lineToPos.match(reg);
        let suggestions = [];
        if (result) {
            suggestions = provider.from(result, args);
        }
        return suggestions;
    }
}
exports.Provider = Provider;
class AtProvider {
    constructor() {
        this.reg = new RegExp('@[^\\\\s]*$');
        this.updateTrigger();
    }
    updateTrigger() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const triggerCharacter = configuration.get('intellisense.atSuggestion.trigger.latex');
        atsuggestion_1.atSuggestion.initialize(triggerCharacter);
        this.reg = new RegExp((0, utils_1.escapeRegExp)(triggerCharacter) + '[^\\\\s]*$');
    }
    provideCompletionItems(document, position) {
        return this.provide({
            uri: document.uri,
            langId: document.languageId,
            line: document.lineAt(position).text,
            position
        });
    }
    provide(args) {
        const result = args.line.substring(0, args.position.character).match(this.reg);
        let suggestions = [];
        if (result) {
            suggestions = atsuggestion_1.provider.from(result, args);
        }
        return suggestions;
    }
}
exports.AtProvider = AtProvider;
//# sourceMappingURL=latex.js.map