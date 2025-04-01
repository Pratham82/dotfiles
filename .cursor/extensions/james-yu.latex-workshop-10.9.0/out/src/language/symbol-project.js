"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSymbolProvider = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const latex_1 = require("../outline/structure/latex");
class ProjectSymbolProvider {
    async provideWorkspaceSymbols() {
        if (lw_1.lw.root.file.path === undefined) {
            return [];
        }
        const sections = await (0, latex_1.construct)();
        return this.sectionToSymbols(sections);
    }
    sectionToSymbols(sections, containerName = 'Document') {
        let symbols = [];
        sections.forEach(section => {
            const location = new vscode.Location(lw_1.lw.file.toUri(section.filePath), new vscode.Range(section.lineFr, 0, section.lineTo, 65535));
            symbols.push(new vscode.SymbolInformation(section.label, vscode.SymbolKind.String, containerName, location));
            if (section.children.length > 0) {
                symbols = [...symbols, ...this.sectionToSymbols(section.children, section.label)];
            }
        });
        return symbols;
    }
}
exports.ProjectSymbolProvider = ProjectSymbolProvider;
//# sourceMappingURL=symbol-project.js.map