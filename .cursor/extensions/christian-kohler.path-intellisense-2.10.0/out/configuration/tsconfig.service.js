"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToTsConfigChanges = exports.getWorkfolderTsConfigConfiguration = void 0;
const vscode = require("vscode");
const JSON5 = require("json5");
const path_1 = require("path");
const file_utills_1 = require("../utils/file-utills");
exports.getWorkfolderTsConfigConfiguration = memoize(function (workfolder, showHiddenFiles, filesExclude) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedFiles = yield findTsConfigFiles(workfolder);
        let mappings = [];
        for (const parsedFile of parsedFiles) {
            try {
                const newMappings = yield createMappingsFromWorkspaceConfig(parsedFile, workfolder, showHiddenFiles, filesExclude);
                mappings.push(...newMappings);
            }
            catch (_a) { }
        }
        return mappings;
    });
});
function subscribeToTsConfigChanges(context) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const workfolder of vscode.workspace.workspaceFolders || []) {
            /**
             * Invalidate Cache when tsconfig changes
             */
            let baseUrlWatchers = yield subscribeToBaseUrlFolderChanges(workfolder);
            context.subscriptions.push(...baseUrlWatchers);
            /**
             * Invalidate Cache when tsconfig changes
             */
            const pattern = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
            const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
            fileWatcher.onDidChange(() => __awaiter(this, void 0, void 0, function* () {
                invalidateCache(workfolder);
                // Throw away old base url subscriptions...
                for (const disposable of baseUrlWatchers) {
                    disposable.dispose();
                }
                // .. and create new subscriptions
                baseUrlWatchers = yield subscribeToBaseUrlFolderChanges(workfolder);
                context.subscriptions.push(...baseUrlWatchers);
            }));
            context.subscriptions.push(fileWatcher);
        }
    });
}
exports.subscribeToTsConfigChanges = subscribeToTsConfigChanges;
/**
 * Invalidate Cache when tsconfig changes
 */
function subscribeToBaseUrlFolderChanges(workfolder) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        const tsConfigs = yield findTsConfigFiles(workfolder);
        for (const tsconfig of tsConfigs) {
            const baseUrl = (_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.baseUrl;
            if (!baseUrl) {
                continue;
            }
            const patternBaseUrl = new vscode.RelativePattern(path_1.join(workfolder.uri.fsPath, baseUrl), "*");
            const fileWatcherBaseUrl = vscode.workspace.createFileSystemWatcher(patternBaseUrl, false, true, false);
            fileWatcherBaseUrl.onDidCreate((file) => invalidateCacheIfDirectory(file, workfolder));
            fileWatcherBaseUrl.onDidDelete((file) => invalidateCacheIfDirectory(file, workfolder));
            disposables.push(fileWatcherBaseUrl);
        }
        return disposables;
    });
}
function invalidateCacheIfDirectory(file, workdfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStat = yield vscode.workspace.fs.stat(file);
        if (fileStat.type === vscode.FileType.Directory) {
            invalidateCache(workdfolder);
        }
    });
}
function findTsConfigFiles(workfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
        const exclude = new vscode.RelativePattern(workfolder, "**/node_modules/**");
        const files = yield vscode.workspace.findFiles(include, exclude);
        const parsedFiles = [];
        for (const file of files) {
            try {
                const fileUri = vscode.Uri.file(file.fsPath);
                const fileContents = yield vscode.workspace.fs.readFile(fileUri);
                const parsedFile = JSON5.parse(fileContents.toString());
                parsedFiles.push(parsedFile);
            }
            catch (_a) { }
        }
        return parsedFiles;
    });
}
function createMappingsFromWorkspaceConfig(tsconfig, workfolder, showHiddenFiles, filesExclude) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const mappings = [];
        const baseUrl = (_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.baseUrl;
        const paths = (_b = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _b === void 0 ? void 0 : _b.paths;
        if (paths && baseUrl && workfolder) {
            for (const [key, value] of Object.entries(paths)) {
                if (value.length === 0) {
                    continue;
                }
                mappings.push({
                    key: key.replace(/\*$/, ""),
                    value: "${workspaceFolder}/" + path_1.join(baseUrl, value[0].replace(/\*$/, "")),
                });
            }
        }
        if (baseUrl && workfolder) {
            const foldersInBaseUrl = yield getFoldersInBaseUrl(workfolder, baseUrl, showHiddenFiles, filesExclude);
            for (const folderInBaseUrl of foldersInBaseUrl) {
                mappings.push({
                    key: folderInBaseUrl,
                    // value: `${workfolder.uri.path}/${baseUrl}`
                    value: "${workspaceFolder}/" + baseUrl + "/" + folderInBaseUrl,
                });
            }
        }
        return mappings;
    });
}
function getFoldersInBaseUrl(workfolder, baseUrl, showHiddenFiles, filesExclude) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield file_utills_1.getChildrenOfPath(path_1.join(workfolder.uri.fsPath, baseUrl), showHiddenFiles, filesExclude);
        const folders = allFiles.filter((file) => !file.isFile);
        return folders.map((folder) => folder.file);
    });
}
/** Caching */
let cachedMappings = new Map();
function memoize(fn) {
    function cachedFunction(workfolder, showHiddenFiles, filesExclude) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!workfolder) {
                return Promise.resolve([]);
            }
            const key = workfolder.name;
            const cachedMapping = cachedMappings.get(key);
            if (cachedMapping) {
                return cachedMapping;
            }
            else {
                let result = yield fn(workfolder, showHiddenFiles || false, filesExclude || {});
                cachedMappings.set(key, result);
                return result;
            }
        });
    }
    return cachedFunction;
}
function invalidateCache(workfolder) {
    cachedMappings.delete(workfolder.name);
}
//# sourceMappingURL=tsconfig.service.js.map