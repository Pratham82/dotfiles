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
exports.mathjax = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const workerpool = __importStar(require("workerpool"));
const lw_1 = require("../lw");
exports.mathjax = {
    typeset
};
const pool = workerpool.pool(path.join(__dirname, 'mathjax', 'mathjax.js'), { minWorkers: 1, maxWorkers: 1, workerType: 'process' });
const proxy = pool.proxy();
lw_1.lw.onConfigChange('hover.preview.mathjax.extensions', initialize);
lw_1.lw.onDispose({ dispose: async () => { await pool.terminate(true); } });
void initialize();
async function initialize() {
    const extensions = vscode.workspace.getConfiguration('latex-workshop').get('hover.preview.mathjax.extensions', []);
    const extensionsToLoad = extensions.filter((ex) => lw_1.lw.constant.MATHJAX_EXT.includes(ex));
    void (await proxy).loadExtensions(extensionsToLoad);
}
async function typeset(arg, opts) {
    return (await proxy).typeset(arg, opts).timeout(3000);
}
//# sourceMappingURL=mathjax.js.map