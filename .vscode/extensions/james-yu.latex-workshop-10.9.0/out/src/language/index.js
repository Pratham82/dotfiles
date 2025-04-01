"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.language = void 0;
const symbol_document_1 = require("./symbol-document");
const symbol_project_1 = require("./symbol-project");
const definition_1 = require("./definition");
const folding_1 = require("./folding");
const selection_1 = require("./selection");
const l10n_1 = require("./l10n");
exports.language = {
    docSymbol: new symbol_document_1.DocSymbolProvider(),
    projectSymbol: new symbol_project_1.ProjectSymbolProvider(),
    definition: new definition_1.DefinitionProvider(),
    folding: new folding_1.FoldingProvider(),
    doctexFolding: new folding_1.DoctexFoldingProvider(),
    weaveFolding: new folding_1.WeaveFoldingProvider(),
    selectionRage: new selection_1.SelectionRangeProvider(),
    getLocaleString: l10n_1.getLocaleString
};
//# sourceMappingURL=index.js.map