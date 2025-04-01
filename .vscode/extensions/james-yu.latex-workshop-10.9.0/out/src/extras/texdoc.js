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
exports.texdoc = texdoc;
const vscode = __importStar(require("vscode"));
const cs = __importStar(require("cross-spawn"));
const lw_1 = require("../lw");
const logger = lw_1.lw.log('TeXDoc');
function runTexdoc(packageName) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop');
    const texdocPath = configuration.get('texdoc.path');
    const texdocArgs = Array.from(configuration.get('texdoc.args'));
    texdocArgs.push(packageName);
    logger.logCommand('Run texdoc command', texdocPath, texdocArgs);
    const proc = cs.spawn(texdocPath, texdocArgs);
    let stdout = '';
    proc.stdout.on('data', newStdout => {
        stdout += newStdout;
    });
    let stderr = '';
    proc.stderr.on('data', newStderr => {
        stderr += newStderr;
    });
    proc.on('error', err => {
        logger.log(`Cannot run texdoc: ${err.message}, ${stderr}`);
        void logger.showErrorMessage('Texdoc failed. Please refer to LaTeX Workshop Output for details.');
    });
    proc.on('exit', exitCode => {
        if (exitCode !== 0) {
            logger.logError(`Cannot find documentation for ${packageName}.`, exitCode);
            void logger.showErrorMessage('Texdoc failed. Please refer to LaTeX Workshop Output for details.');
        }
        else {
            const regex = new RegExp(`(no documentation found)|(Documentation for ${packageName} could not be found)`);
            if (stdout.match(regex) || stderr.match(regex)) {
                logger.log(`Cannot find documentation for ${packageName}.`);
                void logger.showErrorMessage(`Cannot find documentation for ${packageName}.`);
            }
            else {
                logger.log(`Opening documentation for ${packageName}.`);
            }
        }
        logger.log(`texdoc stdout: ${stdout}`);
        logger.log(`texdoc stderr: ${stderr}`);
    });
}
function texdoc(packageName, useonly = false) {
    if (packageName) {
        runTexdoc(packageName);
        return;
    }
    if (useonly) {
        const names = new Set();
        for (const tex of lw_1.lw.cache.getIncludedTeX()) {
            const content = lw_1.lw.cache.get(tex);
            const pkgs = content && content.elements.package;
            if (!pkgs) {
                continue;
            }
            Object.keys(pkgs).forEach(pkg => names.add(pkg));
        }
        const packageNames = Array.from(new Set(names));
        const items = packageNames.map(pkg => ({ label: pkg }));
        void vscode.window.showQuickPick(items).then(selectedPkg => {
            if (!selectedPkg) {
                return;
            }
            runTexdoc(selectedPkg.label);
        });
    }
    else {
        void vscode.window.showInputBox({ value: '', prompt: 'Package name' }).then(selectedPkg => {
            if (!selectedPkg) {
                return;
            }
            runTexdoc(selectedPkg);
        });
    }
}
//# sourceMappingURL=texdoc.js.map