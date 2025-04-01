"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutDir = toOutDir;
const Path = require("path");
const outDir = 'lib';
function toOutDir(filename) {
    if (!filename || !Path.basename(filename) || /\bsrc$/.test(filename))
        return filename.replace(/\bsrc$/, outDir);
    return Path.join(toOutDir(Path.dirname(filename)), Path.basename(filename));
}
//# sourceMappingURL=toOutDir.js.map