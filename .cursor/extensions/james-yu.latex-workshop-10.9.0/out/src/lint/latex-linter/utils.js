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
exports.processWrapper = processWrapper;
const os = __importStar(require("os"));
const lw_1 = require("../../lw");
const logger = lw_1.lw.log('Linter');
function processWrapper(linterId, proc, stdin) {
    return new Promise((resolve, reject) => {
        const startTime = process.hrtime();
        proc.stdout.setEncoding('binary');
        proc.stderr.setEncoding('binary');
        let stdout = '';
        proc.stdout.on('data', newStdout => {
            stdout += newStdout;
        });
        let stderr = '';
        proc.stderr.on('data', newStderr => {
            stderr += newStderr;
        });
        proc.on('error', err => {
            logger.log(`Linter for ${linterId} failed to spawn command, encountering error: ${err.message}`);
            return reject(err);
        });
        proc.on('exit', exitCode => {
            if (exitCode !== 0) {
                let msg;
                if (stderr === '') {
                    msg = stderr;
                }
                else {
                    msg = '\n' + stderr;
                }
                logger.log(`Linter for ${linterId} failed with exit code ${exitCode} and error:${msg}`);
                return reject({ exitCode, stdout, stderr });
            }
            else {
                const [s, ms] = process.hrtime(startTime);
                logger.log(`Linter for ${linterId} successfully finished in ${s}s ${Math.round(ms / 1000000)}ms`);
                return resolve(stdout);
            }
        });
        if (stdin !== undefined) {
            proc.stdin.write(stdin);
            if (!stdin.endsWith(os.EOL)) {
                // Always ensure we end with EOL otherwise ChkTeX will report line numbers as off by 1.
                proc.stdin.write(os.EOL);
            }
            proc.stdin.end();
        }
    });
}
//# sourceMappingURL=utils.js.map