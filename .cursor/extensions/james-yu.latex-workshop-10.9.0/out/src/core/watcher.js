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
exports.watcher = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw_1 = require("../lw");
const logger = lw_1.lw.log('Cacher', 'Watcher');
class Watcher {
    /**
     * Map of folder paths to watcher information. Each folder has its own
     * watcher to save resources.
     */
    get watchers() {
        return this._watchers;
    }
    /**
     * Set of handlers to be called when a file is created.
     */
    get onCreateHandlers() {
        return this._onCreateHandlers;
    }
    /**
     * Set of handlers to be called when a file is changed.
     */
    get onChangeHandlers() {
        return this._onChangeHandlers;
    }
    /**
     * Set of handlers to be called when a file is deleted.
     */
    get onDeleteHandlers() {
        return this._onDeleteHandlers;
    }
    /**
     * Creates a new Watcher instance.
     *
     * @param {'.*' | '.bib' | '.pdf'} [fileExt='.*'] - The file extension to watch.
     */
    constructor(fileExt = '.*') {
        this.fileExt = fileExt;
        this._watchers = {};
        this._onCreateHandlers = new Set();
        this._onChangeHandlers = new Set();
        this._onDeleteHandlers = new Set();
        /**
         * Map of file paths to polling information. This may be of particular use
         * when large binary files are progressively write to disk, and multiple
         * 'change' events are therefore emitted in a short period of time.
         */
        this.polling = {};
    }
    /**
     * Adds a handler for file creation events.
     *
     * @param {(uri: vscode.Uri) => void} handler - The handler function.
     */
    onCreate(handler) {
        this.onCreateHandlers.add(handler);
    }
    /**
     * Adds a handler for file change events.
     *
     * @param {(uri: vscode.Uri) => void} handler - The handler function.
     */
    onChange(handler) {
        this.onChangeHandlers.add(handler);
    }
    /**
     * Adds a handler for file deletion events.
     *
     * @param {(uri: vscode.Uri) => void} handler - The handler function.
     */
    onDelete(handler) {
        this.onDeleteHandlers.add(handler);
    }
    /**
     * Creates a new file system watcher based on the provided glob pattern.
     *
     * @param {vscode.GlobPattern} globPattern - The glob pattern for the
     * watcher.
     * @returns {vscode.FileSystemWatcher} - The created file system watcher.
     */
    createWatcher(globPattern) {
        const watcher = vscode.workspace.createFileSystemWatcher(globPattern);
        watcher.onDidCreate((uri) => this.onDidChange('create', uri));
        watcher.onDidChange((uri) => this.onDidChange('change', uri));
        watcher.onDidDelete((uri) => this.onDidDelete(uri));
        return watcher;
    }
    /**
     * Handles file change events.
     *
     * @param {'create' | 'change'} event - The type of event.
     * @param {vscode.Uri} uri - The URI of the changed file.
     */
    async onDidChange(event, uri) {
        const folder = path.dirname(uri.fsPath);
        const fileName = path.basename(uri.fsPath);
        const watcherInfo = this.watchers[folder];
        if (!watcherInfo?.files.has(fileName)) {
            return;
        }
        if (!lw_1.lw.file.hasBinaryExt(path.extname(uri.fsPath))) {
            this.handleNonBinaryFileChange(event, uri);
        }
        else if (!this.polling[uri.toString(true)]) {
            await this.initiatePolling(uri);
        }
    }
    /**
     * Handles non-binary file (e.g., TeX and Bib) change events.
     *
     * @param {'create' | 'change'} event - The type of event.
     * @param {vscode.Uri} uri - The URI of the changed file.
     */
    handleNonBinaryFileChange(event, uri) {
        const uriString = uri.toString(true);
        logger.log(`"${event}" emitted on ${uriString}.`);
        this.onChangeHandlers.forEach(handler => handler(uri));
        lw_1.lw.event.fire(lw_1.lw.event.FileChanged, uriString);
    }
    /**
     * Initiates polling for a binary file.
     *
     * This function is triggered when a non-binary file is changed, and polling
     * is required to accurately detect the change. It sets up an interval to
     * periodically check for changes in the file's size. When a change is
     * detected, the `handlePolling` function is called to further validate the
     * change and trigger the appropriate handlers.
     *
     * @param {vscode.Uri} uri - The URI of the changed file.
     */
    async initiatePolling(uri) {
        const uriString = uri.toString(true);
        const firstChangeTime = Date.now();
        const size = (await lw_1.lw.external.stat(uri)).size;
        this.polling[uriString] = { size, time: firstChangeTime };
        const pollingInterval = setInterval(() => {
            void this.handlePolling(uri, firstChangeTime, pollingInterval);
        }, vscode.workspace.getConfiguration('latex-workshop').get('latex.watch.pdf.delay'));
    }
    /**
     * Handles polling.
     *
     * This function is responsible for polling a file to accurately detect
     * changes when the file is non-binary and other events have initiated
     * polling. It compares the current size of the file with the recorded size
     * during the initiation of polling. If the size remains unchanged for a
     * specified time (200 milliseconds), it is considered a valid change, and
     * the appropriate handlers are triggered.
     *
     * @param {uri: vscode.Uri} uri - The uri of the changed file.
     * @param {number} size - The size of the file.
     * @param {number} firstChangeTime - The timestamp of the first change.
     * @param {NodeJS.Timeout} interval - The polling interval.
     */
    async handlePolling(uri, firstChangeTime, interval) {
        const uriString = uri.toString(true);
        if (!await lw_1.lw.file.exists(uri)) {
            clearInterval(interval);
            delete this.polling[uriString];
            return;
        }
        const currentSize = (await lw_1.lw.external.stat(uri)).size;
        if (currentSize !== this.polling[uriString].size) {
            this.polling[uriString].size = currentSize;
            this.polling[uriString].time = Date.now();
            return;
        }
        // Resume vscode may cause accidental "change", do nothing
        if (!(uriString in this.polling)) {
            clearInterval(interval);
            return;
        }
        if (Date.now() - this.polling[uriString].time >= 200) {
            logger.log(`"change" emitted on ${uriString} after polling for ${Date.now() - firstChangeTime} ms.`);
            clearInterval(interval);
            delete this.polling[uriString];
            this.onChangeHandlers.forEach(handler => handler(uri));
            lw_1.lw.event.fire(lw_1.lw.event.FileChanged, uriString);
        }
    }
    /**
     * Handles file deletion events.
     *
     * @param {vscode.Uri} uri - The URI of the deleted file.
     */
    async onDidDelete(uri) {
        const folder = path.dirname(uri.fsPath);
        const fileName = path.basename(uri.fsPath);
        const watcherInfo = this.watchers[folder];
        if (!watcherInfo?.files.has(fileName)) {
            return;
        }
        const uriString = uri.toString(true);
        logger.log(`"delete" emitted on ${uriString}.`);
        return new Promise(resolve => {
            setTimeout(async () => {
                if (await lw_1.lw.file.exists(uri)) {
                    logger.log(`File deleted and re-created: ${uriString} .`);
                    resolve();
                    return;
                }
                logger.log(`File deletion confirmed: ${uriString} .`);
                this.onDeleteHandlers.forEach(handler => handler(uri));
                watcherInfo.files.delete(fileName);
                if (watcherInfo.files.size === 0) {
                    this.disposeWatcher(folder);
                }
                lw_1.lw.event.fire(lw_1.lw.event.FileRemoved, uriString);
                resolve();
            }, vscode.workspace.getConfiguration('latex-workshop').get('latex.watch.delay'));
        });
    }
    /**
     * Disposes of a watcher for a specific folder.
     *
     * @param {string} folder - The path of the folder.
     */
    disposeWatcher(folder) {
        const watcherInfo = this.watchers[folder];
        watcherInfo.watcher.dispose();
        delete this.watchers[folder];
        logger.log(`Unwatched folder ${folder}.`);
    }
    /**
     * Adds a file to be watched.
     *
     * This function is responsible for adding a file to the list of watched
     * files. It checks whether a watcher for the file's folder already exists.
     * If not, a new watcher is created for the folder, and the file is added to
     * the set of files being watched. If a watcher already exists, the file is
     * simply added to the set of files being watched by the existing watcher.
     *
     * @param {vscode.Uri} uri - The uri of the file to watch.
     */
    add(uri) {
        const fileName = path.basename(uri.fsPath);
        const folder = path.dirname(uri.fsPath);
        if (!this.watchers[folder]) {
            this.watchers[folder] = {
                watcher: this.createWatcher(new vscode.RelativePattern(folder, `*${this.fileExt}`)),
                files: new Set([fileName])
            };
            this.onCreateHandlers.forEach(handler => handler(uri));
            logger.log(`Watched ${uri.toString(true)} with a new ${this.fileExt} watcher on ${folder} .`);
        }
        else {
            this.watchers[folder].files.add(fileName);
            this.onCreateHandlers.forEach(handler => handler(uri));
            logger.log(`Watched ${uri.toString(true)} by the ${this.fileExt} watcher.`);
        }
        lw_1.lw.event.fire(lw_1.lw.event.FileWatched, uri.toString(true));
    }
    /**
     * Removes a file from being watched.
     *
     * @param {vscode.Uri} uri - The uri of the file to stop watching.
     */
    remove(uri) {
        this.watchers[path.dirname(uri.fsPath)]?.files.delete(path.basename(uri.fsPath));
    }
    /**
     * Checks if a file is currently being watched.
     *
     * @param {vscode.Uri} uri - The uri of the file to check.
     * @returns {boolean} - Indicates whether the file is being watched.
     */
    has(uri) {
        return this.watchers[path.dirname(uri.fsPath)]?.files.has(path.basename(uri.fsPath));
    }
    /**
     * Resets all watchers.
     */
    reset() {
        Object.entries(this.watchers).forEach(([folder, watcher]) => {
            watcher.watcher.dispose();
            delete this.watchers[folder];
        });
        logger.log('Reset.');
    }
}
exports.watcher = {
    src: new Watcher(),
    pdf: new Watcher('.pdf'),
    bib: new Watcher('.bib')
};
//# sourceMappingURL=watcher.js.map