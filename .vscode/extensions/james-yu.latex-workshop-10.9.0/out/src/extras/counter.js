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
exports.count = count;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const cs = __importStar(require("cross-spawn"));
const lw_1 = require("../lw");
const logger = lw_1.lw.log('Counter');
const state = {
    useDocker: false,
    disableCountAfterSave: false,
    autoRunEnabled: false,
    autoRunInterval: 0,
    commandArgs: [],
    commandPath: '',
    texCountMessage: '',
    wordCount: '',
    // gotoLine status item has priority 100.5 and selectIndentation item has priority 100.4
    statusBar: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.45)
};
loadConfigs();
lw_1.lw.onConfigChange(['texcount', 'docker.enabled'], loadConfigs);
lw_1.lw.onDispose(vscode.window.onDidChangeActiveTextEditor((e) => {
    if (e && lw_1.lw.file.hasTeXLangId(e.document.languageId)) {
        loadConfigs(e.document.uri);
    }
    else {
        state.statusBar.hide();
    }
}));
function loadConfigs(scope) {
    scope = scope ?? vscode.window.activeTextEditor?.document.uri ?? lw_1.lw.root.getWorkspace();
    const configuration = vscode.workspace.getConfiguration('latex-workshop', scope);
    state.autoRunEnabled = (configuration.get('texcount.autorun') === 'onSave');
    state.autoRunInterval = configuration.get('texcount.interval');
    state.commandArgs = configuration.get('texcount.args');
    state.commandPath = configuration.get('texcount.path');
    state.useDocker = configuration.get('docker.enabled');
    if (state.autoRunEnabled) {
        updateWordCount();
        state.statusBar.show();
    }
    else {
        state.statusBar.hide();
    }
}
function updateWordCount() {
    if (state.wordCount === '') {
        state.statusBar.text = '';
        state.statusBar.tooltip = '';
    }
    else {
        state.statusBar.text = state.wordCount + ' words';
        state.statusBar.tooltip = state.texCountMessage;
    }
}
function count(file, merge = true, manual = false) {
    if (!manual) {
        if (!state.autoRunEnabled) {
            return;
        }
        if (state.disableCountAfterSave) {
            logger.log('Auto texcount is temporarily disabled in favor of `texcount.interval`.');
            return;
        }
        logger.log(`Auto texcount started on saving file ${file} .`);
        state.disableCountAfterSave = true;
        setTimeout(() => state.disableCountAfterSave = false, state.autoRunInterval);
        void runTeXCount(file).then(() => {
            updateWordCount();
        });
    }
    else {
        void runTeXCount(file, merge).then(() => {
            void vscode.window.showInformationMessage(state.texCountMessage);
        });
    }
}
function runTeXCount(file, merge = true) {
    let command = state.commandPath;
    if (state.useDocker) {
        logger.log('Use Docker to invoke the command.');
        if (process.platform === 'win32') {
            command = path.resolve(lw_1.lw.extensionRoot, './scripts/texcount.bat');
        }
        else {
            command = path.resolve(lw_1.lw.extensionRoot, './scripts/texcount');
            fs.chmodSync(command, 0o755);
        }
    }
    const args = Array.from(state.commandArgs);
    if (merge && !args.includes('-merge')) {
        args.push('-merge');
    }
    args.push(path.basename(file));
    logger.logCommand('Count words using command.', command, args);
    const proc = cs.spawn(command, args, { cwd: path.dirname(file) });
    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    let stdout = '';
    proc.stdout.on('data', newStdout => {
        stdout += newStdout;
    });
    let stderr = '';
    proc.stderr.on('data', newStderr => {
        stderr += newStderr;
    });
    proc.on('error', err => {
        logger.logError('Cannot count words.', err, stderr);
        void logger.showErrorMessage('TeXCount failed. Please refer to LaTeX Workshop Output for details.');
    });
    return new Promise(resolve => {
        proc.on('exit', exitCode => {
            if (exitCode !== 0) {
                logger.logError('Cannot count words', exitCode, stderr);
                void logger.showErrorMessage('TeXCount failed. Please refer to LaTeX Workshop Output for details.');
            }
            else {
                const words = /Words in text: ([0-9]*)/g.exec(stdout);
                const floats = /Number of floats\/tables\/figures: ([0-9]*)/g.exec(stdout);
                if (words) {
                    let floatMsg = '';
                    if (floats && parseInt(floats[1]) > 0) {
                        floatMsg = `and ${floats[1]} float${parseInt(floats[1]) > 1 ? 's' : ''} (tables, figures, etc.) `;
                    }
                    state.wordCount = words[1];
                    state.texCountMessage = `There are ${words[1]} words ${floatMsg}in the ${merge ? 'LaTeX project' : 'opened LaTeX file'}.`;
                    resolve(true);
                }
            }
        });
    });
}
//# sourceMappingURL=counter.js.map