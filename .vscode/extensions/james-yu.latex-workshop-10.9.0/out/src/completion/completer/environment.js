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
exports.environment = exports.provider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const lw_1 = require("../../lw");
const types_1 = require("../../types");
const completerutils_1 = require("./completerutils");
exports.provider = { from };
exports.environment = {
    parse,
    getDefaultEnvs,
    setPackageEnvs,
    getEnvFromPkg,
    provideEnvsAsMacroInPkg,
};
const data = {
    defaultEnvsAsName: [],
    defaultEnvsAsMacro: [],
    defaultEnvsForBegin: [],
    packageEnvs: new Map(),
    packageEnvsAsName: new Map(),
    packageEnvsAsMacro: new Map(),
    packageEnvsForBegin: new Map(),
};
lw_1.lw.onConfigChange('intellisense.package.exclude', initialize);
initialize();
function initialize() {
    const excludeDefault = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.package.exclude').includes('lw-default');
    const envs = excludeDefault
        ? []
        : JSON.parse(fs.readFileSync(`${lw_1.lw.extensionRoot}/data/environments.json`, { encoding: 'utf8' })).map((env) => envRawToInfo('latex', env));
    data.defaultEnvsAsMacro = [];
    data.defaultEnvsForBegin = [];
    data.defaultEnvsAsName = [];
    envs.forEach((env) => {
        data.defaultEnvsAsMacro.push(entryEnvToCompletion(env, types_1.EnvSnippetType.AsMacro));
        data.defaultEnvsForBegin.push(entryEnvToCompletion(env, types_1.EnvSnippetType.ForBegin));
        data.defaultEnvsAsName.push(entryEnvToCompletion(env, types_1.EnvSnippetType.AsName));
    });
    return data;
}
/**
 * This function is called by Macro.initialize with type=EnvSnippetType.AsMacro
 * to build a `\envname` macro for every default environment.
 */
function getDefaultEnvs(type) {
    switch (type) {
        case types_1.EnvSnippetType.AsName:
            return data.defaultEnvsAsName;
            break;
        case types_1.EnvSnippetType.AsMacro:
            return data.defaultEnvsAsMacro;
            break;
        case types_1.EnvSnippetType.ForBegin:
            return data.defaultEnvsForBegin;
            break;
        default:
            return [];
    }
}
function getPackageEnvs(type) {
    switch (type) {
        case types_1.EnvSnippetType.AsName:
            return data.packageEnvsAsName;
        case types_1.EnvSnippetType.AsMacro:
            return data.packageEnvsAsMacro;
        case types_1.EnvSnippetType.ForBegin:
            return data.packageEnvsForBegin;
        default:
            return new Map();
    }
}
function from(result, args) {
    const suggestions = provide(args.langId, args.line, args.position);
    // Macros starting with a non letter character are not filtered properly because of wordPattern definition.
    return (0, completerutils_1.filterNonLetterSuggestions)(suggestions, result[1], args.position);
}
function provide(langId, line, position) {
    let snippetType = types_1.EnvSnippetType.AsName;
    if (vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.selections.length === 1 &&
        line.indexOf('\\begin') > line.indexOf('\\end') &&
        line.slice(position.character).match(/[a-zA-Z*]*}/) === null) {
        snippetType = types_1.EnvSnippetType.ForBegin;
    }
    // Extract cached envs and add to default ones
    const suggestions = Array.from(getDefaultEnvs(snippetType));
    const envList = getDefaultEnvs(snippetType).map((env) => env.label);
    // Insert package environments
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    if (configuration.get('intellisense.package.enabled')) {
        const unusual = configuration.get('intellisense.package.unusual');
        const packages = lw_1.lw.completion.usepackage.getAll(langId);
        Object.entries(packages).forEach(([packageName, options]) => {
            getEnvFromPkg(packageName, snippetType).forEach((env) => {
                if (env.ifCond && !options.includes(env.ifCond)) {
                    return;
                }
                if (env.unusual && !unusual) {
                    return;
                }
                if (!envList.includes(env.label)) {
                    suggestions.push(env);
                    envList.push(env.label);
                }
            });
        });
    }
    // Insert environments defined in tex
    lw_1.lw.cache.getIncludedTeX().forEach((cachedFile) => {
        const cachedEnvs = lw_1.lw.cache.get(cachedFile)?.elements.environment;
        if (cachedEnvs !== undefined) {
            cachedEnvs.forEach((env) => {
                if (!envList.includes(env.label)) {
                    if (snippetType === types_1.EnvSnippetType.ForBegin) {
                        env.insertText = new vscode.SnippetString(`${env.label}}\n\t$0\n\\end{${env.label}}`);
                    }
                    else {
                        env.insertText = env.label;
                    }
                    suggestions.push(env);
                    envList.push(env.label);
                }
            });
        }
    });
    (0, completerutils_1.filterArgumentHint)(suggestions);
    return suggestions;
}
/**
 * Environments can be inserted using `\envname`.
 * This function is called by Macro.provide to compute these macros for every package in use.
 */
function provideEnvsAsMacroInPkg(packageName, options, suggestions, defined) {
    defined = defined ?? new Set();
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const useOptionalArgsEntries = configuration.get('intellisense.optionalArgsEntries.enabled');
    if (!configuration.get('intellisense.package.env.enabled')) {
        return;
    }
    // Load environments from the package if not already done
    const envs = getEnvFromPkg(packageName, types_1.EnvSnippetType.AsMacro);
    // No environment defined in package
    if (!envs || envs.length === 0) {
        return;
    }
    const unusual = configuration.get('intellisense.package.unusual');
    // Insert env snippets
    envs.forEach((env) => {
        if (!useOptionalArgsEntries && env.hasOptionalArgs()) {
            return;
        }
        if (!defined.has(env.signatureAsString())) {
            if (env.ifCond && !options.includes(env.ifCond)) {
                return;
            }
            if (env.unusual && !unusual) {
                return;
            }
            suggestions.push(env);
            defined.add(env.signatureAsString());
        }
    });
}
function parse(cache) {
    if (cache.ast !== undefined) {
        cache.elements.environment = parseAst(cache.ast);
    }
    else {
        cache.elements.environment = parseContent(cache.contentTrimmed);
    }
}
function parseAst(node) {
    let envs = [];
    if (node.type === 'environment' || node.type === 'mathenv') {
        const content = typeof node.env === 'string' ? node.env : node.env.content;
        const env = new completerutils_1.CmdEnvSuggestion(`${content}`, '', [], -1, { name: content, args: '' }, vscode.CompletionItemKind.Module);
        env.documentation = '`' + content + '`';
        env.filterText = content;
        envs.push(env);
    }
    const parseNodeContent = (content) => {
        for (const subNode of content) {
            envs = [...envs, ...parseAst(subNode)];
        }
    };
    if (node.type === 'macro' && node.args) {
        for (const arg of node.args) {
            parseNodeContent(arg.content);
        }
    }
    else if ('content' in node && typeof node.content !== 'string') {
        parseNodeContent(node.content);
    }
    return envs;
}
function parseContent(content) {
    const envReg = /\\begin\s?{([^{}]*)}/g;
    const envs = [];
    const envList = [];
    while (true) {
        const result = envReg.exec(content);
        if (result === null) {
            break;
        }
        if (envList.includes(result[1])) {
            continue;
        }
        const env = new completerutils_1.CmdEnvSuggestion(`${result[1]}`, '', [], -1, { name: result[1], args: '' }, vscode.CompletionItemKind.Module);
        env.documentation = '`' + result[1] + '`';
        env.filterText = result[1];
        envs.push(env);
        envList.push(result[1]);
    }
    return envs;
}
function getEnvFromPkg(packageName, type) {
    const packageEnvs = getPackageEnvs(type);
    const entry = packageEnvs.get(packageName);
    if (entry !== undefined) {
        return entry;
    }
    lw_1.lw.completion.usepackage.load(packageName);
    // No package macro defined
    const pkgEnvs = data.packageEnvs.get(packageName);
    if (!pkgEnvs || pkgEnvs.length === 0) {
        return [];
    }
    const newEntry = [];
    pkgEnvs.forEach((env) => {
        // \array{} : detail=array{}, name=array.
        newEntry.push(entryEnvToCompletion(env, type));
    });
    packageEnvs.set(packageName, newEntry);
    return newEntry;
}
function envRawToInfo(packageName, env) {
    const envInfo = {
        ...env,
        package: packageName,
        detail: env.name,
    };
    return envInfo;
}
function setPackageEnvs(packageName, envs) {
    data.packageEnvs.set(packageName, envs.map((env) => envRawToInfo(packageName, env)));
}
function entryEnvToCompletion(item, type) {
    const label = item.detail ? item.detail : item.name;
    const suggestion = new completerutils_1.CmdEnvSuggestion(item.name + (item.arg?.format ?? ''), item.package || 'latex', item.arg?.keys ?? [], item.arg?.keyPos ?? -1, { name: item.name, args: item.arg?.format ?? '' }, vscode.CompletionItemKind.Module, item.if, item.unusual);
    suggestion.detail = `\\begin{${item.name}}${item.arg?.snippet.replace(/\$\{\d+:([^$}]*)\}/g, '$1') ?? ''}\n...\n\\end{${item.name}}`;
    suggestion.documentation = `Environment ${item.name} .`;
    if (item.package) {
        suggestion.documentation += ` From package: ${item.package}.`;
    }
    suggestion.sortText = label.replace(/([a-z])/g, '$10').toLowerCase();
    if (type === types_1.EnvSnippetType.AsName) {
        return suggestion;
    }
    else {
        if (type === types_1.EnvSnippetType.AsMacro) {
            suggestion.kind = vscode.CompletionItemKind.Snippet;
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const useTabStops = configuration.get('intellisense.useTabStops.enabled');
        const prefix = type === types_1.EnvSnippetType.ForBegin ? '' : 'begin{';
        let snippet = item.arg?.snippet ?? '';
        if (item.arg?.snippet && useTabStops) {
            snippet = item.arg.snippet.replace(/\$\{(\d+):[^}]*\}/g, '$${$1}');
        }
        if (snippet.match(/\$\{?0\}?/)) {
            snippet = snippet.replace(/\$\{?0\}?/, '$${0:$${TM_SELECTED_TEXT}}');
            snippet += '\n';
        }
        else {
            snippet += '\n\t${0:${TM_SELECTED_TEXT}}\n';
        }
        if (item.detail) {
            suggestion.label = item.detail;
        }
        suggestion.filterText = item.detail;
        suggestion.insertText = new vscode.SnippetString(`${prefix}${item.name}}${snippet}\\end{${item.name}}`);
        return suggestion;
    }
}
//# sourceMappingURL=environment.js.map