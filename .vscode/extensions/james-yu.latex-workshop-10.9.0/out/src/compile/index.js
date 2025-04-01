"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const build_1 = require("./build");
const terminate_1 = require("./terminate");
exports.compile = {
    build: build_1.build,
    autoBuild: build_1.autoBuild,
    terminate: terminate_1.terminate,
    lastAutoBuildTime: 0,
    compiledPDFPath: '',
    compiledPDFWriting: 0,
    process: undefined
};
//# sourceMappingURL=index.js.map