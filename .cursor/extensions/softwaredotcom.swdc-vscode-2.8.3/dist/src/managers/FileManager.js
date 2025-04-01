"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJsonData = exports.getFileDataAsJson = exports.setJsonItem = exports.getJsonItem = exports.getBooleanJsonItem = void 0;
const Util_1 = require("../Util");
const LocalStorageManager_1 = require("./LocalStorageManager");
const fs = require("fs");
const path = require("path");
let storageMgr = undefined;
function getStorageManager() {
    if (!storageMgr) {
        storageMgr = LocalStorageManager_1.LocalStorageManager.getCachedStorageManager();
    }
    return storageMgr;
}
function getBooleanJsonItem(file, key) {
    const value = getJsonItem(file, key);
    try {
        return !!JSON.parse(value);
    }
    catch (e) {
        return false;
    }
}
exports.getBooleanJsonItem = getBooleanJsonItem;
function getJsonItem(file, key, defaultValue = '') {
    return getStorageManager()?.getValue(`${(0, Util_1.getFileNameFromPath)(file)}_${key}`) || defaultValue;
}
exports.getJsonItem = getJsonItem;
function setJsonItem(file, key, value) {
    getStorageManager()?.setValue(`${(0, Util_1.getFileNameFromPath)(file)}_${key}`, value);
}
exports.setJsonItem = setJsonItem;
function getFileDataAsJson(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8')?.trim();
        return JSON.parse(content);
    }
    catch (e) {
        (0, Util_1.logIt)(`Unable to read ${getBaseName(filePath)} info: ${e.message}`, true);
    }
    return null;
}
exports.getFileDataAsJson = getFileDataAsJson;
/**
 * Single place to write json data (json obj or json array)
 * @param filePath
 * @param json
 */
function storeJsonData(filePath, json) {
    try {
        const content = JSON.stringify(json);
        fs.writeFileSync(filePath, content, 'utf8');
    }
    catch (e) {
        (0, Util_1.logIt)(`Unable to write ${getBaseName(filePath)} info: ${e.message}`, true);
    }
}
exports.storeJsonData = storeJsonData;
function getBaseName(filePath) {
    let baseName = filePath;
    try {
        baseName = path.basename(filePath);
    }
    catch (e) { }
    return baseName;
}
//# sourceMappingURL=FileManager.js.map