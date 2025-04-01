"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const parser_1 = require("./parser");
const find_1 = require("./find");
const newcommandfinder_1 = require("./newcommandfinder");
exports.parser = {
    parse: parser_1.parser,
    find: {
        tex: find_1.findTeX,
        math: find_1.findMath,
        macro: newcommandfinder_1.findMacros,
        endPair: find_1.findEndPair
    }
};
//# sourceMappingURL=index.js.map