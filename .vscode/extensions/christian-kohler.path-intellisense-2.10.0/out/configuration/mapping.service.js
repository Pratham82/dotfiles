"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceWorkspaceFolder = exports.parseMappings = void 0;
const file_utills_1 = require("../utils/file-utills");
/**
 * From { "lib": "libraries", "other": "otherpath" }
 * To [ { key: "lib", value: "libraries" }, { key: "other", value: "otherpath" } ]
 * @param mappings { "lib": "libraries" }
 */
function parseMappings(mappings) {
    return Object.entries(mappings).map(([key, value]) => ({ key, value }));
}
exports.parseMappings = parseMappings;
/**
 * Replace ${workspaceRoot} with workfolder.uri.path
 * @param mappings
 * @param workfolder
 */
function replaceWorkspaceFolder(mappings, workfolder) {
    const rootPath = workfolder === null || workfolder === void 0 ? void 0 : workfolder.uri.path;
    if (rootPath) {
        /** Replace placeholder with workspace folder */
        return mappings.map(({ key, value }) => ({
            key,
            value: file_utills_1.replaceWorkspaceFolderWithRootPath(value, rootPath),
        }));
    }
    else {
        /** Filter items out which contain a workspace root */
        return mappings.filter(({ value }) => !valueContainsWorkspaceFolder(value));
    }
}
exports.replaceWorkspaceFolder = replaceWorkspaceFolder;
function valueContainsWorkspaceFolder(value) {
    return (value.indexOf("${workspaceRoot}") >= 0 ||
        value.indexOf("${workspaceFolder}") >= 0);
}
//# sourceMappingURL=mapping.service.js.map