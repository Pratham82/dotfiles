"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function buildFilepath(oldPath, oldStat, newName, settings) {
    var newPath = path.parse(newName);
    // Check ability to add original extension
    var needAddExtension = (settings.keepOriginalExtension && !newName.endsWith('!!ext')) || newName.endsWith('&&ext');
    // Clean the new name from special characters
    var newStripedName = newName.replace(/(!!|&&)ext$/, '');
    // The new path has no extension and we must save original extension
    if (oldStat.isFile() && newPath.ext === '' && needAddExtension) {
        newStripedName += oldPath.ext;
    }
    return path.join(oldPath.dir, newStripedName);
}
exports.buildFilepath = buildFilepath;
