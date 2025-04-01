"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmManager = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const TrackerManager_1 = require("./TrackerManager");
const fs = require("fs");
class KpmManager {
    constructor() {
        let subscriptions = [];
        this.tracker = TrackerManager_1.TrackerManager.getInstance();
        const workspaceFolder = (0, Util_1.getFirstWorkspaceFolder)();
        if (workspaceFolder) {
            // Watch .git directory changes
            // Only works if the git directory is in the workspace
            const localGitWatcher = vscode_1.workspace.createFileSystemWatcher(new vscode_1.RelativePattern(workspaceFolder, '{**/.git/refs/heads/**}'));
            const remoteGitWatcher = vscode_1.workspace.createFileSystemWatcher(new vscode_1.RelativePattern(workspaceFolder, '{**/.git/refs/remotes/**}'));
            subscriptions.push(localGitWatcher);
            subscriptions.push(remoteGitWatcher);
            subscriptions.push(localGitWatcher.onDidChange(this._onCommitHandler, this));
            subscriptions.push(remoteGitWatcher.onDidChange(this._onCommitHandler, this));
            subscriptions.push(remoteGitWatcher.onDidCreate(this._onCommitHandler, this));
            subscriptions.push(remoteGitWatcher.onDidDelete(this._onBranchDeleteHandler, this));
        }
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    static getInstance() {
        if (!KpmManager.instance) {
            KpmManager.instance = new KpmManager();
        }
        return KpmManager.instance;
    }
    async _onCommitHandler(event) {
        const preferences = await (0, DataController_1.getUserPreferences)();
        if (preferences?.disableGitData)
            return;
        // Branches with naming style of "feature/fix_the_thing" will fire an
        // event when the /feature directory is created. Check if file.
        const stat = fs.statSync(event.path);
        if (!stat?.isFile())
            return;
        if (event.path.includes('/.git/refs/heads/')) {
            // /.git/refs/heads/<branch_name>
            const branch = event.path.split('.git/')[1];
            let commit;
            try {
                commit = fs.readFileSync(event.path, 'utf8').trimEnd();
            }
            catch (err) {
                (0, Util_1.logIt)(`Error reading ${event.path}: ${err.message}`);
            }
            this.tracker.trackGitLocalEvent('local_commit', branch, commit);
        }
        else if (event.path.includes('/.git/refs/remotes/')) {
            // /.git/refs/remotes/<branch_name>
            this.tracker.trackGitRemoteEvent(event);
        }
    }
    async _onBranchDeleteHandler(event) {
        this.tracker.trackGitDeleteEvent(event);
    }
    dispose() {
        this._disposable.dispose();
    }
}
exports.KpmManager = KpmManager;
//# sourceMappingURL=KpmManager.js.map