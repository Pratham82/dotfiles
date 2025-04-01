"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerManager = void 0;
const swdc_tracker_1 = require("swdc-tracker");
const Constants_1 = require("../Constants");
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const GitUtil_1 = require("../repo/GitUtil");
const FileManager_1 = require("./FileManager");
const DataController_1 = require("../DataController");
class TrackerManager {
    constructor() {
        this.trackerReady = false;
        this.pluginParams = this.getPluginParams();
        this.eventVersions = new Map();
    }
    static getInstance() {
        if (!TrackerManager.instance) {
            TrackerManager.instance = new TrackerManager();
        }
        return TrackerManager.instance;
    }
    dispose() {
        swdc_tracker_1.default.dispose();
    }
    async init() {
        // initialize tracker with swdc api host, namespace, and appId
        const result = await swdc_tracker_1.default.initialize(Constants_1.api_endpoint, 'CodeTime', 'swdc-vscode');
        if (result.status === 200) {
            this.trackerReady = true;
        }
    }
    async trackCodeTimeEvent(projectChangeInfo) {
        if (!this.trackerReady) {
            return;
        }
        // extract the project info from the keystroke stats
        const projectInfo = {
            project_directory: projectChangeInfo.project_directory,
            project_name: projectChangeInfo.project_name,
        };
        // loop through the files in the keystroke stats "source"
        const fileKeys = Object.keys(projectChangeInfo.docs_changed);
        for await (const file of fileKeys) {
            const docChangeInfo = projectChangeInfo.docs_changed[file];
            const startDate = new Date(docChangeInfo.start).toISOString();
            const endDate = new Date(docChangeInfo.end).toISOString();
            // check if this is a dup (i.e. secondary workspace or window sending the same event)
            if (this.isDupCodeTimeEvent(startDate, endDate))
                return;
            const codetime_entity = {
                keystrokes: docChangeInfo.keystrokes,
                lines_added: docChangeInfo.linesAdded,
                lines_deleted: docChangeInfo.linesDeleted,
                characters_added: docChangeInfo.charactersAdded,
                characters_deleted: docChangeInfo.charactersDeleted,
                single_deletes: docChangeInfo.singleDeletes,
                multi_deletes: docChangeInfo.multiDeletes,
                single_adds: docChangeInfo.singleAdds,
                multi_adds: docChangeInfo.multiAdds,
                auto_indents: docChangeInfo.autoIndents,
                replacements: docChangeInfo.replacements,
                start_time: startDate,
                end_time: endDate,
            };
            const file_entity = {
                file_name: docChangeInfo.file_name,
                file_path: docChangeInfo.file_path,
                syntax: docChangeInfo.syntax,
                line_count: docChangeInfo.line_count,
                character_count: docChangeInfo.character_count,
            };
            const repoParams = await this.getRepoParams(projectChangeInfo.project_directory);
            const codetime_event = {
                ...codetime_entity,
                ...file_entity,
                ...projectInfo,
                ...this.pluginParams,
                ...this.getJwtParams(),
                ...repoParams,
            };
            swdc_tracker_1.default.trackCodeTimeEvent(codetime_event);
        }
    }
    async trackUIInteraction(item) {
        // ui interaction doesn't require a jwt, no need to check for that here
        if (!this.trackerReady || !item) {
            return;
        }
        const ui_interaction = {
            interaction_type: item.interactionType,
        };
        const ui_element = {
            element_name: item.name,
            element_location: item.location,
            color: item.color ? item.color : null,
            icon_name: item.interactionIcon ? item.interactionIcon : null,
            cta_text: !item.hideCTAInTracker ? item.label || item.description || item.tooltip : 'redacted',
        };
        const ui_event = {
            ...ui_interaction,
            ...ui_element,
            ...this.pluginParams,
            ...this.getJwtParams(),
        };
        swdc_tracker_1.default.trackUIInteraction(ui_event);
    }
    async trackGitLocalEvent(gitEventName, branch, commit) {
        if (!this.trackerReady) {
            return;
        }
        const projectParams = this.getProjectParams();
        if (gitEventName === 'uncommitted_change') {
            this.trackUncommittedChangeGitEvent(projectParams);
        }
        else if (gitEventName === 'local_commit' && branch) {
            this.trackLocalCommitGitEvent(projectParams, branch, commit);
        }
        else {
            return;
        }
    }
    async trackGitRemoteEvent(event) {
        if (!this.trackerReady) {
            return;
        }
        const projectParams = this.getProjectParams();
        const remoteBranch = event.path.split('.git/')[1];
        this.trackBranchCommitGitEvent(projectParams, remoteBranch, event.path);
    }
    async trackGitDeleteEvent(event) {
        this.removeBranchFromTrackingHistory(event.path);
    }
    async trackUncommittedChangeGitEvent(projectParams) {
        const uncommittedChanges = await this.getUncommittedChangesParams(projectParams.project_directory);
        this.sendGitEvent('uncommitted_change', projectParams, uncommittedChanges);
    }
    async trackLocalCommitGitEvent(projectParams, branch, commit) {
        if (!commit) {
            commit = await (0, GitUtil_1.getLatestCommitForBranch)(projectParams.project_directory, branch);
        }
        if (await (0, GitUtil_1.commitAlreadyOnRemote)(projectParams.project_directory, commit)) {
            return;
        }
        if (await (0, GitUtil_1.isMergeCommit)(projectParams.project_directory, commit)) {
            return;
        }
        const commitInfo = await (0, GitUtil_1.getInfoForCommit)(projectParams.project_directory, commit);
        const file_changes = await (0, GitUtil_1.getChangesForCommit)(projectParams.project_directory, commit);
        const eventData = { commit_id: commit, git_event_timestamp: commitInfo.authoredTimestamp, file_changes };
        this.sendGitEvent('local_commit', projectParams, eventData);
    }
    async trackBranchCommitGitEvent(projectParams, remoteBranch, event_path) {
        const defaultBranch = await (0, GitUtil_1.getDefaultBranchFromRemoteBranch)(projectParams.project_directory, remoteBranch);
        const gitAuthors = await (0, GitUtil_1.authors)(projectParams.project_directory);
        let lastTrackedRef = this.getLatestTrackedCommit(event_path);
        let gitEventName;
        if (remoteBranch === defaultBranch) {
            gitEventName = 'default_branch_commit';
        }
        else {
            gitEventName = 'branch_commit';
            // If we have not tracked this branch before, then pull all commits
            // based on the default branch being the parent. This may not be true
            // but it will prevent us from pulling the entire commit history of
            // the author.
            if (lastTrackedRef === '') {
                lastTrackedRef = defaultBranch;
            }
        }
        const commits = await (0, GitUtil_1.getCommitsForAuthors)(projectParams.project_directory, remoteBranch, lastTrackedRef, gitAuthors);
        for (const commit of commits) {
            const file_changes = await (0, GitUtil_1.getChangesForCommit)(projectParams.project_directory, commit.commit);
            const eventData = { commit_id: commit.commit, git_event_timestamp: commit.authoredTimestamp, file_changes };
            this.sendGitEvent(gitEventName, projectParams, eventData);
        }
        // Save the latest commit SHA
        if (commits[0]) {
            this.setLatestTrackedCommit(event_path, commits[0].commit);
        }
    }
    async sendGitEvent(gitEventName, projectParams, eventData) {
        const preferences = await (0, DataController_1.getUserPreferences)();
        if (preferences?.disableGitData)
            return;
        const repoParams = await this.getRepoParams(projectParams.project_directory);
        const gitEvent = {
            git_event_type: gitEventName,
            ...eventData,
            ...this.pluginParams,
            ...this.getJwtParams(),
            ...projectParams,
            ...repoParams,
        };
        // send the event
        swdc_tracker_1.default.trackGitEvent(gitEvent);
    }
    async trackEditorAction(entity, type, event) {
        if (!this.trackerReady) {
            return;
        }
        const projectParams = this.getProjectParams();
        if (type == 'save') {
            if (this.eventVersionIsTheSame(event))
                return;
            if ((0, Util_1.isGitProject)(projectParams.project_directory)) {
                this.trackGitLocalEvent('uncommitted_change', event);
            }
        }
        const repoParams = await this.getRepoParams(projectParams.project_directory);
        const editor_event = {
            entity,
            type,
            ...this.pluginParams,
            ...this.getJwtParams(),
            ...projectParams,
            ...this.getFileParams(event, projectParams.project_directory),
            ...repoParams,
        };
        // send the event
        swdc_tracker_1.default.trackEditorAction(editor_event);
    }
    // action: installed | uninstalled | enabled | disabled
    async trackVSCodeExtension(eventData) {
        if (!this.trackerReady) {
            return;
        }
        const vscode_extension_event = {
            ...eventData,
            ...this.pluginParams,
            ...this.getJwtParams(),
        };
        swdc_tracker_1.default.trackVSCodeExtension(vscode_extension_event);
    }
    // Static attributes
    getPluginParams() {
        return {
            plugin_id: (0, Util_1.getPluginId)(),
            plugin_name: (0, Util_1.getPluginName)(),
            plugin_version: (0, Util_1.getVersion)(),
            editor_name: (0, Util_1.getEditorName)(),
            editor_version: vscode_1.version,
        };
    }
    // Dynamic attributes
    getJwtParams() {
        let token = (0, Util_1.getItem)('jwt');
        if (token?.match(/\s/)) {
            return { jwt: token?.split(/\s/)[1] };
        }
        return { jwt: token };
    }
    getProjectParams() {
        const workspaceFolders = (0, Util_1.getWorkspaceFolders)();
        const project_directory = workspaceFolders.length ? workspaceFolders[0].uri.fsPath : '';
        const project_name = workspaceFolders.length ? workspaceFolders[0].name : '';
        return { project_directory, project_name };
    }
    async getRepoParams(projectRootPath) {
        const resourceInfo = await (0, KpmRepoManager_1.getResourceInfo)(projectRootPath);
        if (!resourceInfo || !resourceInfo.identifier) {
            // return empty data, no need to parse further
            return {
                identifier: '',
                org_name: '',
                repo_name: '',
                repo_identifier: '',
                git_branch: '',
                git_tag: '',
            };
        }
        // retrieve the git identifier info
        const gitIdentifiers = (0, GitUtil_1.getRepoIdentifierInfo)(resourceInfo.identifier);
        return {
            ...gitIdentifiers,
            repo_identifier: resourceInfo.identifier,
            git_branch: resourceInfo.branch,
            git_tag: resourceInfo.tag,
        };
    }
    async getUncommittedChangesParams(projectRootPath) {
        const stats = await (0, GitUtil_1.getLocalChanges)(projectRootPath);
        return { file_changes: stats };
    }
    eventVersionIsTheSame(event) {
        const isSame = this.eventVersions.get(event.fileName) == event.version;
        if (isSame) {
            return true;
        }
        else {
            // Add filename and version to map
            this.eventVersions.set(event.fileName, event.version);
            if (this.eventVersions.size > 5) {
                // remove oldest entry in map to stay small
                try {
                    const key = this.eventVersions.keys().next().value;
                    if (key !== undefined) {
                        this.eventVersions.delete(key);
                    }
                }
                catch (e) {
                    // ignore
                }
            }
            return false;
        }
    }
    getFileParams(event, projectRootPath) {
        if (!event)
            return {};
        // File Open and Close have document attributes on the event.
        // File Change has it on a `document` attribute
        const textDoc = event.document || event;
        if (!textDoc) {
            return {
                file_name: '',
                file_path: '',
                syntax: '',
                line_count: 0,
                character_count: 0,
            };
        }
        let character_count = 0;
        if (typeof textDoc.getText === 'function') {
            character_count = textDoc.getText().length;
        }
        return {
            file_name: textDoc.fileName?.split(projectRootPath)?.[1],
            file_path: textDoc.fileName,
            syntax: textDoc.languageId || textDoc.fileName?.split('.')?.slice(-1)?.[0],
            line_count: textDoc.lineCount || 0,
            character_count,
        };
    }
    setLatestTrackedCommit(dotGitFilePath, commit) {
        // dotGitFilePath: /Users/somebody/code/repo_name/.git/refs/remotes/origin/main
        (0, FileManager_1.setJsonItem)((0, Util_1.getGitEventFile)(), dotGitFilePath, { latestTrackedCommit: commit });
    }
    getLatestTrackedCommit(dotGitFilePath) {
        // dotGitFilePath: /Users/somebody/code/repo_name/.git/refs/remotes/origin/main
        const data = (0, FileManager_1.getJsonItem)((0, Util_1.getGitEventFile)(), dotGitFilePath, null);
        if (data) {
            try {
                const jsonData = JSON.parse(data);
                return jsonData.latestTrackedCommit || '';
            }
            catch (e) {
                // ignore
            }
        }
        return '';
    }
    removeBranchFromTrackingHistory(dotGitFilePath) {
        let data = (0, FileManager_1.getFileDataAsJson)((0, Util_1.getGitEventFile)());
        delete data[dotGitFilePath];
        (0, FileManager_1.storeJsonData)((0, Util_1.getGitEventFile)(), data);
    }
    isDupCodeTimeEvent(startDate, endDate) {
        // check if this is a dup (i.e. secondary workspace or window sending the same event)
        const key = `$ct_event_${startDate}`;
        if (TrackerManager.storageMgr) {
            const dupEvent = TrackerManager.storageMgr.getValue(key);
            if (dupEvent) {
                return true;
            }
            else {
                TrackerManager.storageMgr.setValue(key, endDate);
                // delete the key/value after 10 seconds
                setTimeout(() => {
                    TrackerManager.storageMgr?.deleteValue(key);
                }, 1000 * 10);
            }
        }
        return false;
    }
}
exports.TrackerManager = TrackerManager;
TrackerManager.storageMgr = undefined;
//# sourceMappingURL=TrackerManager.js.map