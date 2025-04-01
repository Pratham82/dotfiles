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
exports.lint = void 0;
const vscode = __importStar(require("vscode"));
const lw_1 = require("../lw");
const chktex_1 = require("./latex-linter/chktex");
const lacheck_1 = require("./latex-linter/lacheck");
const logger = lw_1.lw.log('Linter');
exports.lint = {
    on,
    root
};
let linterTimeout;
function getLinters(scope) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', scope);
    const linters = [];
    if (configuration.get('linting.chktex.enabled')) {
        linters.push(chktex_1.chkTeX);
    }
    else {
        chktex_1.chkTeX.linterDiagnostics.clear();
    }
    if (configuration.get('linting.lacheck.enabled')) {
        linters.push(lacheck_1.laCheck);
    }
    else {
        lacheck_1.laCheck.linterDiagnostics.clear();
    }
    return linters;
}
function root() {
    const linters = getLinters(lw_1.lw.root.getWorkspace());
    linters.forEach(linter => {
        if (lw_1.lw.root.file.path === undefined) {
            logger.log(`No root file found for ${linter.getName()}.`);
            return;
        }
        logger.log(`${linter.getName()} lints root ${lw_1.lw.root.file.path} .`);
        void linter.lintRootFile(lw_1.lw.root.file.path);
    });
}
function on(document) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', document.uri);
    const linters = getLinters(document.uri);
    if (linters.length > 0
        && configuration.get('linting.run') === 'onType') {
        const interval = configuration.get('linting.delay');
        if (linterTimeout) {
            clearTimeout(linterTimeout);
        }
        linterTimeout = setTimeout(() => linters.forEach(linter => {
            logger.log(`${linter.getName()} lints ${document.fileName} .`);
            void linter.lintFile(document);
        }), interval);
    }
}
//# sourceMappingURL=latex-linter.js.map