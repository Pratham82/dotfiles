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
exports.getConfiguration = void 0;
const vscode = require("vscode");
const tsconfig_service_1 = require("./tsconfig.service");
const mapping_service_1 = require("./mapping.service");
const file_utills_1 = require("../utils/file-utills");
function getConfiguration(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(resource);
        const getConfig = (key) => vscode.workspace.getConfiguration(key, resource);
        const cfgExtension = getConfig("path-intellisense");
        const cfgGeneral = getConfig("files");
        const mappings = yield getMappings(cfgExtension, workspaceFolder);
        return {
            autoSlash: cfgExtension["autoSlashAfterDirectory"],
            autoTrigger: cfgExtension["autoTriggerNextSuggestion"],
            showHiddenFiles: cfgExtension["showHiddenFiles"],
            withExtension: cfgExtension["extensionOnImport"],
            absolutePathToWorkspace: cfgExtension["absolutePathToWorkspace"],
            absolutePathTo: resolveAbsolutePathTo(cfgExtension["absolutePathTo"], workspaceFolder),
            showOnAbsoluteSlash: cfgExtension["showOnAbsoluteSlash"],
            filesExclude: cfgGeneral["exclude"],
            mappings,
        };
    });
}
exports.getConfiguration = getConfiguration;
function getMappings(configuration, workfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const mappings = mapping_service_1.parseMappings(configuration["mappings"]);
        const ignoreTsConfigBaseUrl = configuration["ignoreTsConfigBaseUrl"];
        const showHiddenFiles = configuration["showHiddenFiles"];
        const filesExclude = configuration["exclude"];
        const tsConfigMappings = yield (ignoreTsConfigBaseUrl
            ? []
            : tsconfig_service_1.getWorkfolderTsConfigConfiguration(workfolder, showHiddenFiles, filesExclude));
        const allMappings = [...mappings, ...tsConfigMappings];
        return mapping_service_1.replaceWorkspaceFolder(allMappings, workfolder);
    });
}
function resolveAbsolutePathTo(cfgPath, workfolder) {
    const rootPath = workfolder === null || workfolder === void 0 ? void 0 : workfolder.uri.path;
    return rootPath && cfgPath
        ? file_utills_1.replaceWorkspaceFolderWithRootPath(cfgPath, rootPath)
        : null;
}
//# sourceMappingURL=configuration.service.js.map