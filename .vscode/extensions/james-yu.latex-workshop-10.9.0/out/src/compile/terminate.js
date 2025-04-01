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
exports.terminate = terminate;
const cp = __importStar(require("child_process"));
const lw_1 = require("../lw");
const queue_1 = require("./queue");
const logger = lw_1.lw.log('Build', 'Terminate');
/**
 * Terminate the current process of LaTeX building. This OS-specific function
 * uses a kill command (pkill for Linux and macOS, taskkill for Windows) with
 * the process PID. Regardless of success, `kill()` from the `child_process`
 * module is later called for a "double kill." Subsequent tools in the queue,
 * including those from the current recipe and (if available) those from the
 * cached recipe to be executed, are cleared.
 */
function terminate() {
    if (lw_1.lw.compile.process === undefined) {
        logger.log('LaTeX build process to kill is not found.');
        return;
    }
    const pid = lw_1.lw.compile.process.pid;
    try {
        logger.log(`Kill child processes of the current process with PID ${pid}.`);
        if (process.platform === 'linux' || process.platform === 'darwin') {
            // Use pkill to kill child processes
            cp.execSync(`pkill -P ${pid}`, { timeout: 1000 });
        }
        else if (process.platform === 'win32') {
            // Use taskkill on Windows to forcefully terminate child processes
            cp.execSync(`taskkill /F /T /PID ${pid}`, { timeout: 1000 });
        }
    }
    catch (e) {
        logger.logError('Failed killing child processes of the current process.', e);
    }
    finally {
        // Clear all subsequent tools in the queue
        queue_1.queue.clear();
        // Perform a "double kill" using kill() from child_process
        lw_1.lw.compile.process.kill();
        logger.log(`Killed the current process with PID ${pid}`);
    }
}
//# sourceMappingURL=terminate.js.map