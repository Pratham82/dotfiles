"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = void 0;
const latex_linter_1 = require("./latex-linter");
const latex_formatter_1 = require("./latex-formatter");
const latex_code_actions_1 = require("./latex-code-actions");
const bibtex_formatter_1 = require("./bibtex-formatter");
const duplicate_label_1 = require("./duplicate-label");
exports.lint = {
    latex: {
        formatter: latex_formatter_1.formatter,
        actionprovider: latex_code_actions_1.provider,
        action: latex_code_actions_1.action,
        ...latex_linter_1.lint
    },
    bibtex: {
        format: bibtex_formatter_1.format,
        formatter: bibtex_formatter_1.formatter
    },
    label: duplicate_label_1.dupLabelDetector
};
//# sourceMappingURL=index.js.map