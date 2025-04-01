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
exports.dupLabelDetector = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("../lw");
const duplicatedLabelsDiagnostics = vscode.languages.createDiagnosticCollection('Duplicate Labels');
exports.dupLabelDetector = {
    check,
    reset
};
/**
 * Compute the dictionary of labels
 */
function computeDuplicates() {
    const labelsCount = new Map();
    lw_1.lw.cache.getIncludedTeX().forEach(cachedFile => {
        const cachedRefs = lw_1.lw.cache.get(cachedFile)?.elements.reference;
        if (cachedRefs === undefined) {
            return;
        }
        cachedRefs.forEach(ref => {
            if (ref.range === undefined) {
                return;
            }
            let count = labelsCount.get(ref.label);
            if (count === undefined) {
                count = 0;
            }
            count += 1;
            labelsCount.set(ref.label, count);
        });
    });
    const duplicates = [];
    for (const [label, count] of labelsCount) {
        if (count > 1) {
            duplicates.push(label);
        }
    }
    return duplicates;
}
function check() {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    if (!configuration.get('check.duplicatedLabels.enabled')) {
        return;
    }
    const duplicates = computeDuplicates();
    showDiagnostics(duplicates);
}
function showDiagnostics(duplicates) {
    duplicatedLabelsDiagnostics.clear();
    if (duplicates.length === 0) {
        return;
    }
    const diagsCollection = Object.create(null);
    lw_1.lw.cache.getIncludedTeX().forEach(cachedFile => {
        const cachedRefs = lw_1.lw.cache.get(cachedFile)?.elements.reference;
        if (cachedRefs === undefined) {
            return;
        }
        cachedRefs.forEach(ref => {
            if (ref.range === undefined) {
                return;
            }
            if (duplicates.includes(ref.label)) {
                if (!(cachedFile in diagsCollection)) {
                    diagsCollection[cachedFile] = [];
                }
                const range = ref.range instanceof vscode.Range ? ref.range : ref.range.inserting;
                const diag = new vscode.Diagnostic(range, `Duplicate label ${ref.label}`, vscode.DiagnosticSeverity.Warning);
                diag.source = 'DuplicateLabels';
                diagsCollection[cachedFile].push(diag);
            }
        });
    });
    for (const file in diagsCollection) {
        if (path.extname(file) === '.tex') {
            duplicatedLabelsDiagnostics.set(lw_1.lw.file.toUri(file), diagsCollection[file]);
        }
    }
}
function reset() {
    duplicatedLabelsDiagnostics.clear();
}
//# sourceMappingURL=duplicate-label.js.map