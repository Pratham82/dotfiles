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
exports.pickRootPath = pickRootPath;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
async function pickRootPath(rootPath, subRootPath, verb) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(rootPath));
    const doNotPrompt = configuration.get('latex.rootFile.doNotPrompt');
    if (doNotPrompt) {
        if (configuration.get('latex.rootFile.useSubFile')) {
            return subRootPath;
        }
        else {
            return rootPath;
        }
    }
    const pickedRootFile = await vscode.window.showQuickPick([{
            label: 'Default root file',
            description: `Path: ${rootPath}`
        }, {
            label: 'Subfiles package root file',
            description: `Path: ${subRootPath}`
        }], {
        placeHolder: `Subfiles package detected. Which file to ${verb}?`,
        matchOnDescription: true
    }).then(selected => {
        if (!selected) {
            return;
        }
        switch (selected.label) {
            case 'Default root file':
                return rootPath;
            case 'Subfiles package root file':
                return subRootPath;
            default:
                return;
        }
    });
    return pickedRootFile;
}
//# sourceMappingURL=quick-pick.js.map