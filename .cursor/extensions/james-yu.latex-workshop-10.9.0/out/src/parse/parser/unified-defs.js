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
exports.getMacroDefs = getMacroDefs;
exports.getEnvDefs = getEnvDefs;
const vscode = __importStar(require("vscode"));
const MACROS = {
    // \input{some-file}
    InputIfFileExists: { signature: 'm' },
    SweaveInput: { signature: 'm' },
    subfile: { signature: 'm' },
    loadglsentries: { signature: 'm' },
    markdownInput: { signature: 'm' },
    // \import{sections/}{some-file}
    import: { signature: 'm m' },
    inputfrom: { signature: 'm m' },
    includefrom: { signature: 'm m' },
    subimport: { signature: 'm m' },
    subinputfrom: { signature: 'm m' },
    subincludefrom: { signature: 'm m' },
    // \label{some-label}
    linelabel: { signature: 'd<> o m' },
    // \newglossaryentry{vscode}{name=VSCode, description=Editor}
    newglossaryentry: { signature: 'm m' },
    provideglossaryentry: { signature: 'm m' },
    // \newacronym[optional parameters]{lw}{LW}{LaTeX Workshop}
    longnewglossaryentry: { signature: 'o m m m' },
    longprovideglossaryentry: { signature: 'o m m m' },
    newacronym: { signature: 'o m m m' },
    newabbreviation: { signature: 'o m m m' },
    newabbr: { signature: 'o m m m' },
    newrobustcmd: { signature: 's d<> +m o +o +m' },
    renewrobustcmd: { signature: 's d<> +m o +o +m' },
    providerobustcmd: { signature: 's +m o +o +m' },
    DeclareRobustCommand: { signature: 's +m o +o +m' },
    DeclareMathOperator: { signature: 's m m' },
    DeclarePairedDelimiter: { signature: 'm m m' },
    DeclarePairedDelimiterX: { signature: 'm o m m m' },
    DeclarePairedDelimiterXPP: { signature: 'm o m m m m m' },
};
const ENVS = {};
function getMacroDefs() {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const cmds = [...new Set([
            ...configuration.get('view.outline.commands'),
            ...configuration.get('intellisense.label.command')
        ])];
    const secs = configuration.get('view.outline.sections').map(level => level.split('|')).flat();
    const macroDefs = Object.assign({}, MACROS);
    cmds.forEach(cmd => macroDefs[cmd] = { signature: 'd<> o m' });
    secs.forEach(sec => macroDefs[sec] = { signature: 's o m' });
    return macroDefs;
}
function getEnvDefs() {
    return ENVS;
}
//# sourceMappingURL=unified-defs.js.map