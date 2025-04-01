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
exports.lw = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const cs = __importStar(require("cross-spawn"));
const wrapper = (fn) => {
    return (...args) => fn(...args);
};
/* eslint-disable */
exports.lw = {
    extensionRoot: '',
    previousActive: undefined,
    constant: {},
    log: {},
    event: {},
    file: {},
    watcher: {},
    cache: {},
    root: {},
    parser: {},
    compile: {},
    viewer: {},
    server: {},
    preview: {},
    locate: {},
    completion: {},
    language: {},
    lint: {},
    outline: {},
    extra: {},
    commands: Object.create(null),
    external: {
        spawn: wrapper(cs.spawn),
        sync: wrapper(cs.sync),
        stat: wrapper(vscode.workspace.fs.stat.bind(vscode.workspace.fs)),
        mkdirSync: wrapper(fs.mkdirSync),
        chmodSync: wrapper(fs.chmodSync)
    },
    onConfigChange,
    onDispose
};
/* eslint-enable */
const constant = {
    TEX_EXT: ['.tex', '.bib'],
    TEX_NOCACHE_EXT: ['.cls', '.sty', '.bst', '.bbx', '.cbx', '.def', '.cfg'],
    RSWEAVE_EXT: ['.rnw', '.Rnw', '.rtex', '.Rtex', '.snw', '.Snw'],
    JLWEAVE_EXT: ['.jnw', '.jtexw'],
    PWEAVE_EXT: ['.pnw', '.ptexw'],
    TEX_MAGIC_PROGRAM_NAME: 'TEX_MAGIC_PROGRAM_NAME',
    BIB_MAGIC_PROGRAM_NAME: 'BIB_MAGIC_PROGRAM_NAME',
    MAGIC_PROGRAM_ARGS_SUFFIX: '_WITH_ARGS',
    MAX_PRINT_LINE: '10000',
    /**
     * Prefix that server.ts uses to distinguish requests on pdf files from
     * others. We use '.' because it is not converted by encodeURIComponent and
     * other functions.
     * See https://stackoverflow.com/questions/695438/safe-characters-for-friendly-url
     * See https://tools.ietf.org/html/rfc3986#section-2.3
     */
    PDF_PREFIX: 'pdf..',
    MATHJAX_EXT: [
        'amscd', 'bbox', 'boldsymbol', 'braket', 'bussproofs', 'cancel',
        'cases', 'centernot', 'colortbl', 'empheq', 'enclose', 'extpfeil',
        'gensymb', 'html', 'mathtools', 'mhchem', 'physics', 'textcomp',
        'textmacros', 'unicode', 'upgreek', 'verb'
    ],
    FILE_URI_SCHEMES: ['file', 'vsls']
};
exports.lw.constant = constant;
let disposables = undefined;
const tempDisposables = [];
/**
 * Handle configuration changes and invoke the specified callback function when
 * relevant configurations are updated.
 *
 * @param {string | string[]} [configs] - Optional. A string or an array of
 * configuration keys to monitor for changes. The leading `latex-workshop.`
 * should be omitted. A '*' can also be passed here for wildcard.
 * @param {Function} [callback] - Optional. The callback function to be executed
 * when relevant configurations change.
 * @param {vscode.ConfigurationScope} [scope] - Optional. The configuration
 * scope to consider when checking for changes.
 */
function onConfigChange(configs, callback, scope) {
    const disposable = vscode.workspace.onDidChangeConfiguration((e) => {
        if (configs && callback &&
            ([configs].flat().some(config => e.affectsConfiguration(`latex-workshop.${config}`, scope))
                || configs === '*')) {
            callback();
        }
    });
    if (disposables === undefined) {
        tempDisposables.push(disposable);
    }
    else {
        disposables.push(...tempDisposables, disposable);
        tempDisposables.length = 0;
    }
}
/**
 * @param {vscode.Disposable[]} [extensionDisposables] - Optional. An array of
 *   disposables associated with the extension. If provided, the function sets
 *   the global disposables array to extensionDisposables and adds
 *   tempDisposables to it. If not provided, the function creates a disposable
 *   to listen for configuration changes and adds it to tempDisposables.
 */
function onDispose(disposable, extensionDisposables) {
    if (extensionDisposables && disposable === undefined) {
        disposables = extensionDisposables;
        disposables.push(...tempDisposables);
        tempDisposables.length = 0;
        return;
    }
    if (disposable === undefined) {
        return;
    }
    if (disposables === undefined) {
        tempDisposables.push(disposable);
    }
    else {
        disposables.push(...tempDisposables, disposable);
        tempDisposables.length = 0;
    }
}
//# sourceMappingURL=lw.js.map