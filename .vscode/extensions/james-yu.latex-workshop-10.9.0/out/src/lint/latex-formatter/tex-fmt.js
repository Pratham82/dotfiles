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
exports.texfmt = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("../../lw");
const logger = lw_1.lw.log('Format', 'tex-fmt');
exports.texfmt = {
    formatDocument
};
async function formatDocument(document, range) {
    const config = vscode.workspace.getConfiguration('latex-workshop');
    const program = config.get('formatting.tex-fmt.path');
    const args = [...config.get('formatting.tex-fmt.args'), '--stdin'];
    const process = lw_1.lw.external.spawn(program, args, { cwd: path.dirname(document.uri.fsPath) });
    let stdout = Buffer.alloc(0);
    process.stdout?.on('data', (msg) => {
        stdout = Buffer.concat([stdout, Buffer.isBuffer(msg) ? msg : Buffer.from(msg)]);
    });
    const promise = new Promise(resolve => {
        process.on('error', err => {
            logger.logError(`Failed to run ${program}`, err);
            logger.showErrorMessage(`Failed to run ${program}. See extension log for more information.`);
            resolve(undefined);
        });
        process.on('exit', code => {
            if (code !== 0) {
                logger.log(`${program} returned ${code} .`);
                logger.showErrorMessage(`${program} returned ${code} . Be cautious on the edits.`);
                resolve(undefined);
            }
            let stdoutStr = stdout.toString();
            // tex-fmt adds an extra newline at the end
            if (stdoutStr.endsWith('\n\n')) {
                stdoutStr = stdoutStr.slice(0, -1);
            }
            logger.log(`Formatted using ${program} .`);
            resolve(vscode.TextEdit.replace(range ?? document.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)), stdoutStr));
        });
    });
    // 2024-12-4, for tex-fmt 0.4.7, when using `--stdin`, it requires a newline at the end of the input; Therefore, we need to add a newline at the end of the input if it doesn't exist, and remove it from the output if it exists.
    const text = document.getText(range);
    const endsWithNewline = text.endsWith('\n');
    process.stdin?.write(endsWithNewline ? text : text + '\n');
    process.stdin?.end();
    const edits = await promise;
    if (edits) {
        edits.newText = endsWithNewline ? edits.newText : edits.newText.replace(/\n$/, '');
    }
    return edits;
}
//# sourceMappingURL=tex-fmt.js.map