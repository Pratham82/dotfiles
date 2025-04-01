"use strict";
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
exports.NixProvider = void 0;
const vscode = require("vscode");
const configuration_service_1 = require("../../configuration/configuration.service");
const createContext_1 = require("../../utils/createContext");
const file_utills_1 = require("../../utils/file-utills");
const createCompletionItem_1 = require("../../utils/createCompletionItem");
exports.NixProvider = {
    selector: {
        pattern: '**/*.nix',
        scheme: 'file'
    },
    provider: {
        provideCompletionItems,
    },
    triggerCharacters: ["/"],
};
function provideCompletionItems(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = createContext_1.createContext(document, position);
        const config = yield configuration_service_1.getConfiguration(document.uri);
        const typedString = getTypedString(context, config);
        return typedString === null
            ? Promise.resolve([])
            : provide(context, config, typedString);
    });
}
/**
 * Returns the currently typed string, prior to the cursor position.
 * Should have the same effect as context.fromString, expect that it doesn't
 * require string quotations to be present, making it compatible with nix files.
 * This is important because in nix, string quoted paths are explicitly forced as absolute,
 * a relative path may not use any quotations, making context.fromString return null.
 * This function will too return null if it decides a path completion is not appropriate
 * at the current cursor position.
 * @param context
 * @param config
 */
function getTypedString(context, config) {
    var _a;
    const { fromString: contextFromString } = context;
    let noQuoteString = undefined;
    if (!contextFromString) {
        const cursorPos = context.importRange.start.character;
        const lineUpToCursor = context.textFullLine.slice(0, cursorPos);
        noQuoteString = (_a = lineUpToCursor.match(/\.{0,2}\/[^\"\'\,\s]*$/)) === null || _a === void 0 ? void 0 : _a[0];
    }
    const fromString = noQuoteString !== null && noQuoteString !== void 0 ? noQuoteString : contextFromString;
    if (fromString) {
        const startsWithDot = fromString[0] === ".";
        const startsWithSlash = fromString[0] === "/";
        const startsWithMapping = config.mappings.some(({ key }) => fromString.startsWith(key));
        return (startsWithDot ||
            startsWithMapping ||
            (startsWithSlash && config.showOnAbsoluteSlash)) ? fromString : null;
    }
    return null;
}
/**
 * Provide Completion Items
 */
function provide(context, config, directPathString) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = vscode.workspace.getWorkspaceFolder(context.document.uri);
        const rootPath = config.absolutePathTo ||
            (config.absolutePathToWorkspace ? workspace === null || workspace === void 0 ? void 0 : workspace.uri.fsPath : undefined);
        const path = file_utills_1.getPathOfFolderToLookupFiles(context.document.uri.fsPath, directPathString, rootPath, config.mappings);
        const childrenOfPath = yield file_utills_1.getChildrenOfPath(path, config.showHiddenFiles, config.filesExclude);
        return [
            ...childrenOfPath.map((child) => createCompletionItem_1.createPathCompletionItem(child, config, context)),
        ];
    });
}
//# sourceMappingURL=nixos.provider.js.map