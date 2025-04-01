"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completion = void 0;
const citation_1 = require("./completer/citation");
const environment_1 = require("./completer/environment");
const macro_1 = require("./completer/macro");
const subsuperscript_1 = require("./completer/subsuperscript");
const reference_1 = require("./completer/reference");
const package_1 = require("./completer/package");
const input_1 = require("./completer/input");
const glossary_1 = require("./completer/glossary");
const latex_1 = require("./latex");
const bibtex_1 = require("./bibtex");
exports.completion = {
    citation: citation_1.citation,
    environment: environment_1.environment,
    macro: macro_1.macro,
    subsuperscript: subsuperscript_1.subsuperscript,
    reference: reference_1.reference,
    usepackage: package_1.usepackage,
    input: input_1.input,
    glossary: glossary_1.glossary,
    provider: new latex_1.Provider(),
    atProvider: new latex_1.AtProvider(),
    bibProvider: new bibtex_1.BibProvider()
};
//# sourceMappingURL=index.js.map