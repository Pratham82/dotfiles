"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossaryType = exports.EnvSnippetType = exports.TeXElementType = void 0;
var TeXElementType;
(function (TeXElementType) {
    TeXElementType[TeXElementType["Environment"] = 0] = "Environment";
    TeXElementType[TeXElementType["Macro"] = 1] = "Macro";
    TeXElementType[TeXElementType["Section"] = 2] = "Section";
    TeXElementType[TeXElementType["SectionAst"] = 3] = "SectionAst";
    TeXElementType[TeXElementType["SubFile"] = 4] = "SubFile";
    TeXElementType[TeXElementType["BibItem"] = 5] = "BibItem";
    TeXElementType[TeXElementType["BibField"] = 6] = "BibField";
})(TeXElementType || (exports.TeXElementType = TeXElementType = {}));
var EnvSnippetType;
(function (EnvSnippetType) {
    EnvSnippetType[EnvSnippetType["AsName"] = 0] = "AsName";
    EnvSnippetType[EnvSnippetType["AsMacro"] = 1] = "AsMacro";
    EnvSnippetType[EnvSnippetType["ForBegin"] = 2] = "ForBegin";
})(EnvSnippetType || (exports.EnvSnippetType = EnvSnippetType = {}));
var GlossaryType;
(function (GlossaryType) {
    GlossaryType[GlossaryType["glossary"] = 0] = "glossary";
    GlossaryType[GlossaryType["acronym"] = 1] = "acronym";
})(GlossaryType || (exports.GlossaryType = GlossaryType = {}));
//# sourceMappingURL=types.js.map