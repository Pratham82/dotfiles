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
exports.subimportProvider = exports.importProvider = exports.inputProvider = exports.input = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const micromatch = __importStar(require("micromatch"));
const lw_1 = require("../../lw");
const logger = lw_1.lw.log('Intelli', 'Input');
const ignoreFiles = ['**/.vscode', '**/.vscodeignore', '**/.gitignore'];
class InputAbstract {
    /**
     * Filter a list of completion paths
     *
     * @param document The textDocumt from which the filtering was launch
     * @param files The list of files to filter
     * @param baseDir The base directory to resolve paths from
     */
    filterIgnoredFiles(uri, files, baseDir) {
        const excludeGlob = (Object.keys(vscode.workspace.getConfiguration('files', null).get('exclude') || {})).concat(vscode.workspace.getConfiguration('latex-workshop', uri).get('intellisense.file.exclude') || []).concat(ignoreFiles);
        return files.filter(file => {
            const filePath = path.resolve(baseDir, file);
            return !micromatch.isMatch(filePath, excludeGlob, { basename: true });
        });
    }
    from(result, args) {
        const macro = result[1];
        const payload = [...result.slice(2).reverse()];
        return this.provide(args.uri, args.line, args.position, macro, payload);
    }
    /**
     * Provide file name intellisense
     *
     * @param payload an array of string
     *      payload[0]: The already typed path
     *      payload[1]: The path from which completion is triggered, may be empty
     */
    provide(uri, line, position, macro, payload) {
        const currentFile = uri.fsPath;
        const typedFolder = payload[0];
        const importFromDir = payload[1];
        const startPos = Math.max(line.lastIndexOf('{', position.character), line.lastIndexOf('/', position.character));
        const range = startPos >= 0 ? new vscode.Range(position.line, startPos + 1, position.line, position.character) : undefined;
        const baseDir = this.getBaseDir(currentFile, importFromDir, macro);
        const provideDirOnly = this.provideDirOnly(importFromDir);
        const suggestions = [];
        baseDir.forEach(dir => {
            if (typedFolder !== '') {
                let currentFolder = typedFolder;
                if (!typedFolder.endsWith('/')) {
                    currentFolder = path.dirname(typedFolder);
                }
                dir = path.resolve(dir, currentFolder);
            }
            try {
                let files = fs.readdirSync(dir);
                files = this.filterIgnoredFiles(uri, files, dir);
                files.forEach(file => {
                    const filePath = path.resolve(dir, file);
                    if (dir === '/') {
                        // Keep the leading '/' to have an absolute path
                        file = '/' + file;
                    }
                    if (fs.lstatSync(filePath).isDirectory()) {
                        const item = new vscode.CompletionItem(`${file}/`, vscode.CompletionItemKind.Folder);
                        item.range = range;
                        item.command = { title: 'Post-Action', command: 'editor.action.triggerSuggest' };
                        item.detail = dir;
                        suggestions.push(item);
                    }
                    else if (!provideDirOnly) {
                        const item = new vscode.CompletionItem(file, vscode.CompletionItemKind.File);
                        const preview = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.includegraphics.preview.enabled');
                        if (preview && ['includegraphics', 'includesvg'].includes(macro)) {
                            item.documentation = filePath;
                        }
                        item.range = range;
                        item.detail = dir;
                        if (['include', 'includeonly', 'excludeonly'].includes(macro)) {
                            item.insertText = path.parse(file).name;
                        }
                        suggestions.push(item);
                    }
                });
            }
            catch (err) {
                logger.logError(`Error reading directory ${dir} .`, err);
            }
        });
        return suggestions;
    }
}
class Input extends InputAbstract {
    constructor() {
        super(...arguments);
        this.graphicsPath = new Set();
    }
    /**
     * Set the graphics path
     */
    parseGraphicsPath(cache) {
        const regex = /\\graphicspath{[\s\n]*((?:{[^{}]*}[\s\n]*)*)}/g;
        let result;
        while (true) {
            result = regex.exec(cache.contentTrimmed);
            if (result === null) {
                break;
            }
            result[1].split(/\{|\}/).filter(s => s.replace(/^\s*$/, '')).forEach(dir => this.graphicsPath.add(dir));
        }
    }
    reset() {
        this.graphicsPath.clear();
    }
    provideDirOnly(_importFromDir) {
        return false;
    }
    getBaseDir(currentFile, _importFromDir, macro) {
        let baseDir = [];
        if (lw_1.lw.root.dir.path === undefined) {
            logger.log(`No root dir can be found. The current root file should be undefined, is ${lw_1.lw.root.file.path}. How did you get here?`);
            return [];
        }
        // If there is no root, 'root relative' and 'both' should fall back to 'file relative'
        const rootDir = lw_1.lw.root.dir.path;
        if (['includegraphics', 'includesvg'].includes(macro) && this.graphicsPath.size > 0) {
            baseDir = Array.from(this.graphicsPath).map(dir => path.join(rootDir, dir));
        }
        else {
            const baseConfig = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(currentFile)).get('intellisense.file.base');
            const baseDirCurrentFile = path.dirname(currentFile);
            switch (baseConfig) {
                case 'root relative':
                    baseDir = [rootDir];
                    break;
                case 'file relative':
                    baseDir = [baseDirCurrentFile];
                    break;
                case 'both':
                    if (baseDirCurrentFile !== rootDir) {
                        baseDir = [baseDirCurrentFile, rootDir];
                    }
                    else {
                        baseDir = [rootDir];
                    }
                    break;
                default:
            }
        }
        return baseDir;
    }
}
class Import extends InputAbstract {
    provideDirOnly(importFromDir) {
        return (!importFromDir);
    }
    getBaseDir(_currentFile, importFromDir, _macro) {
        if (importFromDir) {
            return [importFromDir];
        }
        else {
            return ['/'];
        }
    }
}
class SubImport extends InputAbstract {
    provideDirOnly(importFromDir) {
        return (!importFromDir);
    }
    getBaseDir(currentFile, importFromDir, _macro) {
        if (importFromDir) {
            return [path.join(path.dirname(currentFile), importFromDir)];
        }
        else {
            return [path.dirname(currentFile)];
        }
    }
}
exports.input = new Input();
exports.inputProvider = exports.input;
const importMacro = new Import();
const subimportMacro = new SubImport();
exports.importProvider = importMacro;
exports.subimportProvider = subimportMacro;
//# sourceMappingURL=input.js.map