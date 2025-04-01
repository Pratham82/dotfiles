"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
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
exports.getNodeIdFromFile = exports.genFileName = exports.genFileExt = void 0;
const fse = require("fs-extra");
const _ = require("lodash");
const path = require("path");
const shared_1 = require("../shared");
function genFileExt(language) {
    const ext = shared_1.langExt.get(language);
    if (!ext) {
        throw new Error(`The language "${language}" is not supported.`);
    }
    return ext;
}
exports.genFileExt = genFileExt;
function genFileName(node, language) {
    const slug = _.kebabCase(node.name);
    const ext = genFileExt(language);
    return `${node.id}.${slug}.${ext}`;
}
exports.genFileName = genFileName;
function getNodeIdFromFile(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = yield fse.readFile(fsPath, "utf8");
        let id = "";
        const matchResults = fileContent.match(/@lc.+id=(.+?) /);
        if (matchResults && matchResults.length === 2) {
            id = matchResults[1];
        }
        // Try to get id from file name if getting from comments failed
        if (!id) {
            id = path.basename(fsPath).split(".")[0];
        }
        return id;
    });
}
exports.getNodeIdFromFile = getNodeIdFromFile;
//# sourceMappingURL=problemUtils.js.map