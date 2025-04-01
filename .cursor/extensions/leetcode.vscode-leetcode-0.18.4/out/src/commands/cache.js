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
exports.deleteCache = void 0;
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const uiUtils_1 = require("../utils/uiUtils");
function deleteCache() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield leetCodeExecutor_1.leetCodeExecutor.deleteCache();
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to delete cache. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.deleteCache = deleteCache;
//# sourceMappingURL=cache.js.map