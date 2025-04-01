"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimaryWindow = exports.getImage = exports.checkRegistrationForReport = exports.noSpacesProjectDir = exports.showWarningMessage = exports.showInformationMessage = exports.humanizeMinutes = exports.launchWebUrl = exports.launchWebDashboard = exports.getAuthQueryObject = exports.getOffsetSeconds = exports.logIt = exports.getLogId = exports.getExtensionName = exports.displayReadme = exports.getLocalREADMEFile = exports.getSoftwareDir = exports.getExtensionsFile = exports.getFlowChangeFile = exports.getSessionSummaryFile = exports.getGitEventFile = exports.getSoftwareSessionFile = exports.getDeviceFile = exports.getOsUsername = exports.getOs = exports.getHostname = exports.isMac = exports.isWindows = exports.isLinux = exports.setAuthCallbackState = exports.getAuthCallbackState = exports.getPluginUuid = exports.isActiveIntegration = exports.getBooleanItem = exports.getItem = exports.setItem = exports.isFlowModeEnabled = exports.updateFlowChange = exports.getNumberOfTextDocumentsOpen = exports.getFirstWorkspaceFolder = exports.getWorkspaceFolders = exports.isGitProject = exports.getEditorName = exports.getVersion = exports.getPluginType = exports.getPluginName = exports.getPluginId = exports.getWorkspaceName = exports.getRandomNumberWithinRange = exports.alpha = void 0;
exports.getFileNameFromPath = exports.editorOpsExtInstalled = exports.musicTimeExtInstalled = void 0;
const vscode_1 = require("vscode");
const Constants_1 = require("./Constants");
const uuid_1 = require("uuid");
const SlackManager_1 = require("./managers/SlackManager");
const ExecManager_1 = require("./managers/ExecManager");
const FileManager_1 = require("./managers/FileManager");
const date_fns_1 = require("date-fns");
const websockets_1 = require("./websockets");
const open = require('open');
const fs = require("fs");
const path = require("path");
const os = require("os");
const outputChannel = vscode_1.window.createOutputChannel('CodeTime');
exports.alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
let workspace_name = null;
let hostname = null;
let osUsername = null;
let editorName = '';
let osName = '';
function getRandomNumberWithinRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
exports.getRandomNumberWithinRange = getRandomNumberWithinRange;
function getWorkspaceName() {
    if (!workspace_name) {
        workspace_name = (0, uuid_1.v4)();
    }
    return workspace_name;
}
exports.getWorkspaceName = getWorkspaceName;
function getPluginId() {
    return Constants_1.CODE_TIME_PLUGIN_ID;
}
exports.getPluginId = getPluginId;
function getPluginName() {
    return Constants_1.CODE_TIME_EXT_ID;
}
exports.getPluginName = getPluginName;
function getPluginType() {
    return Constants_1.CODE_TIME_TYPE;
}
exports.getPluginType = getPluginType;
function getVersion() {
    const extension = vscode_1.extensions.getExtension(Constants_1.CODE_TIME_EXT_ID);
    return extension ? extension.packageJSON.version : '2.5.27';
}
exports.getVersion = getVersion;
function getEditorName() {
    if (!editorName) {
        try {
            editorName = vscode_1.env.appName;
        }
        catch (e) {
            editorName = 'vscode';
        }
    }
    return editorName;
}
exports.getEditorName = getEditorName;
function isGitProject(projectDir) {
    if (!projectDir) {
        return false;
    }
    const gitRemotesDir = path.join(projectDir, '.git', 'refs', 'remotes');
    if (!fs.existsSync(gitRemotesDir)) {
        return false;
    }
    return true;
}
exports.isGitProject = isGitProject;
/**
 * These will return the workspace folders.
 * use the uri.fsPath to get the full path
 * use the name to get the folder name
 */
function getWorkspaceFolders() {
    let folders = [];
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            let folderUri = workspaceFolder.uri;
            if (folderUri && folderUri.fsPath) {
                folders.push(workspaceFolder);
            }
        }
    }
    return folders;
}
exports.getWorkspaceFolders = getWorkspaceFolders;
function getFirstWorkspaceFolder() {
    const workspaceFolders = getWorkspaceFolders();
    if (workspaceFolders && workspaceFolders.length) {
        return workspaceFolders[0];
    }
    return null;
}
exports.getFirstWorkspaceFolder = getFirstWorkspaceFolder;
function getNumberOfTextDocumentsOpen() {
    return vscode_1.workspace.textDocuments ? vscode_1.workspace.textDocuments.length : 0;
}
exports.getNumberOfTextDocumentsOpen = getNumberOfTextDocumentsOpen;
function updateFlowChange(in_flow) {
    (0, FileManager_1.setJsonItem)(getFlowChangeFile(), "in_flow", in_flow);
}
exports.updateFlowChange = updateFlowChange;
function isFlowModeEnabled() {
    // nullish coalesce the "in_flow" flag if it doesn't exist
    return (0, FileManager_1.getBooleanJsonItem)(getFlowChangeFile(), "in_flow") ?? false;
}
exports.isFlowModeEnabled = isFlowModeEnabled;
function setItem(key, value) {
    (0, FileManager_1.setJsonItem)(getSoftwareSessionFile(), key, value);
}
exports.setItem = setItem;
function getItem(key) {
    return (0, FileManager_1.getJsonItem)(getSoftwareSessionFile(), key);
}
exports.getItem = getItem;
function getBooleanItem(key) {
    return (0, FileManager_1.getBooleanJsonItem)(getSoftwareSessionFile(), key);
}
exports.getBooleanItem = getBooleanItem;
function isActiveIntegration(type, integration) {
    if (integration && integration.status.toLowerCase() === "active") {
        // handle integration_connection attribute
        if (integration.integration_type) {
            return !!(integration.integration_type.type.toLowerCase() === type.toLowerCase());
        }
        // still hasn't updated to use that in within the file, check the older version attribute
        return !!(integration.name.toLowerCase() === type.toLowerCase());
    }
    return false;
}
exports.isActiveIntegration = isActiveIntegration;
function getPluginUuid() {
    let plugin_uuid = (0, FileManager_1.getJsonItem)(getDeviceFile(), 'plugin_uuid');
    if (!plugin_uuid) {
        let name = `${getOsUsername()}${getHostname()}`;
        if (!name) {
            name = getOs();
        }
        const hashName = require('crypto')
            .createHash('sha1')
            .update(name)
            .digest('hex');
        plugin_uuid = `${hashName.trim()}:${(0, uuid_1.v4)()}`;
        // set it for the 1st and only time
        (0, FileManager_1.setJsonItem)(getDeviceFile(), 'plugin_uuid', plugin_uuid);
    }
    return plugin_uuid;
}
exports.getPluginUuid = getPluginUuid;
function getAuthCallbackState(autoCreate = true) {
    let auth_callback_state = (0, FileManager_1.getJsonItem)(getDeviceFile(), 'auth_callback_state', false);
    if (!auth_callback_state && autoCreate) {
        auth_callback_state = (0, uuid_1.v4)();
        setAuthCallbackState(auth_callback_state);
    }
    return auth_callback_state;
}
exports.getAuthCallbackState = getAuthCallbackState;
function setAuthCallbackState(value) {
    (0, FileManager_1.setJsonItem)(getDeviceFile(), 'auth_callback_state', value);
}
exports.setAuthCallbackState = setAuthCallbackState;
function isLinux() {
    return isWindows() || isMac() ? false : true;
}
exports.isLinux = isLinux;
// process.platform return the following...
//   -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
function isWindows() {
    return process.platform.indexOf('win32') !== -1;
}
exports.isWindows = isWindows;
function isMac() {
    return process.platform.indexOf('darwin') !== -1;
}
exports.isMac = isMac;
function getHostname() {
    if (!hostname) {
        hostname = (0, ExecManager_1.execCmd)('hostname');
    }
    return hostname;
}
exports.getHostname = getHostname;
function getOs() {
    if (!osName) {
        let parts = [];
        let osType = os.type();
        if (osType) {
            parts.push(osType);
        }
        let osRelease = os.release();
        if (osRelease) {
            parts.push(osRelease);
        }
        let platform = os.platform();
        if (platform) {
            parts.push(platform);
        }
        if (parts.length > 0) {
            osName = parts.join('_');
        }
    }
    return osName;
}
exports.getOs = getOs;
function getOsUsername() {
    if (!osUsername) {
        try {
            // Throws a SystemError if a user has no username or homedir
            osUsername = os.userInfo().username;
        }
        catch (e) {
            console.error('Username not available.', e.message);
        }
        if (!osUsername) {
            osUsername = (0, ExecManager_1.execCmd)('whoami');
        }
    }
    return osUsername;
}
exports.getOsUsername = getOsUsername;
function getFile(name, default_data = {}) {
    const file_path = getSoftwareDir();
    const file = isWindows() ? `${file_path}\\${name}` : `${file_path}/${name}`;
    if (!fs.existsSync(file)) {
        (0, FileManager_1.storeJsonData)(file, default_data);
    }
    return file;
}
function getDeviceFile() {
    return getFile('device.json');
}
exports.getDeviceFile = getDeviceFile;
function getSoftwareSessionFile() {
    return getFile('session.json');
}
exports.getSoftwareSessionFile = getSoftwareSessionFile;
function getGitEventFile() {
    return getFile('gitEvents.json');
}
exports.getGitEventFile = getGitEventFile;
function getSessionSummaryFile() {
    return getFile('sessionSummary.json');
}
exports.getSessionSummaryFile = getSessionSummaryFile;
function getFlowChangeFile() {
    return getFile('flowChange.json');
}
exports.getFlowChangeFile = getFlowChangeFile;
function getExtensionsFile() {
    return getFile('extensions.json');
}
exports.getExtensionsFile = getExtensionsFile;
function getSoftwareDir() {
    const homedir = os.homedir();
    const softwareDataDir = isWindows() ? `${homedir}\\${Constants_1.SOFTWARE_DIRECTORY}` : (process.env.XDG_CONFIG_HOME ? `${process.env.XDG_CONFIG_HOME}/${Constants_1.SOFTWARE_DIRECTORY.substring(1)}` : `${homedir}/${Constants_1.SOFTWARE_DIRECTORY}`);
    if (!fs.existsSync(softwareDataDir)) {
        fs.mkdirSync(softwareDataDir);
    }
    return softwareDataDir;
}
exports.getSoftwareDir = getSoftwareDir;
function getLocalREADMEFile() {
    const resourcePath = path.join(__dirname, 'resources');
    const file = path.join(resourcePath, 'README.md');
    return file;
}
exports.getLocalREADMEFile = getLocalREADMEFile;
function displayReadme() {
    const readmeUri = vscode_1.Uri.file(getLocalREADMEFile());
    vscode_1.commands.executeCommand('markdown.showPreview', readmeUri, vscode_1.ViewColumn.One);
    setItem('vscode_CtReadme', true);
}
exports.displayReadme = displayReadme;
function getExtensionName() {
    return 'swdc-vscode';
}
exports.getExtensionName = getExtensionName;
function getLogId() {
    return 'CodeTime';
}
exports.getLogId = getLogId;
function logIt(message, isError = false) {
    const windowMsg = isPrimaryWindow() ? '(p)' : '';
    outputChannel.appendLine(`${(0, date_fns_1.formatISO)(new Date())} ${getLogId()}${windowMsg}: ${message}`);
    if (isError) {
        console.error(message);
    }
}
exports.logIt = logIt;
function getOffsetSeconds() {
    let d = new Date();
    return d.getTimezoneOffset() * 60;
}
exports.getOffsetSeconds = getOffsetSeconds;
function getAuthQueryObject() {
    const params = new URLSearchParams();
    params.append('plugin_uuid', getPluginUuid());
    params.append('plugin_id', `${getPluginId()}`);
    params.append('plugin_version', getVersion());
    params.append('auth_callback_state', getAuthCallbackState(true));
    return params;
}
exports.getAuthQueryObject = getAuthQueryObject;
async function launchWebDashboard() {
    // add the token=jwt
    const jwt = getItem('jwt');
    const encodedJwt = encodeURIComponent(jwt);
    const webUrl = `${Constants_1.app_url}?token=${encodedJwt}`;
    launchWebUrl(webUrl);
}
exports.launchWebDashboard = launchWebDashboard;
function launchWebUrl(url) {
    if (!(0, websockets_1.websocketAlive)()) {
        try {
            (0, websockets_1.initializeWebsockets)();
        }
        catch (e) {
            console.error('Failed to initialize websockets', e);
        }
    }
    open(url);
}
exports.launchWebUrl = launchWebUrl;
/**
 * humanize the minutes
 */
function humanizeMinutes(min) {
    min = parseInt(min, 0) || 0;
    let str = '';
    if (min === 60) {
        str = '1h';
    }
    else if (min > 60) {
        const hours = Math.floor(min / 60);
        const minutes = min % 60;
        const hoursStr = Math.floor(hours).toFixed(0) + 'h';
        if ((parseFloat(min) / 60) % 1 === 0) {
            str = hoursStr;
        }
        else {
            str = `${hoursStr} ${minutes}m`;
        }
    }
    else if (min === 1) {
        str = '1m';
    }
    else {
        // less than 60 seconds
        str = min.toFixed(0) + 'm';
    }
    return str;
}
exports.humanizeMinutes = humanizeMinutes;
function showInformationMessage(message) {
    logIt(message);
    return vscode_1.window.showInformationMessage(`${message}`);
}
exports.showInformationMessage = showInformationMessage;
function showWarningMessage(message) {
    return vscode_1.window.showWarningMessage(`${message}`);
}
exports.showWarningMessage = showWarningMessage;
function noSpacesProjectDir(projectDir) {
    return projectDir.replace(/^\s+/g, '');
}
exports.noSpacesProjectDir = noSpacesProjectDir;
function checkRegistrationForReport(showSignup = true) {
    if (!getItem('name')) {
        if (showSignup) {
            (0, SlackManager_1.showModalSignupPrompt)('Unlock your personalized dashboard and visualize your coding activity. Create an account to get started.');
        }
        return false;
    }
    return true;
}
exports.checkRegistrationForReport = checkRegistrationForReport;
function getImage(name) {
    const resourcePath = path.join(__dirname, 'images');
    const file = path.join(resourcePath, name);
    return file;
}
exports.getImage = getImage;
function isPrimaryWindow() {
    let workspaceWindow = getItem('vscode_primary_window');
    if (!workspaceWindow) {
        // its not set yet, update it to this window
        workspaceWindow = getWorkspaceName();
        setItem('vscode_primary_window', workspaceWindow);
    }
    return !!(workspaceWindow === getWorkspaceName());
}
exports.isPrimaryWindow = isPrimaryWindow;
function musicTimeExtInstalled() {
    return !!vscode_1.extensions.getExtension(Constants_1.MUSIC_TIME_EXT_ID);
}
exports.musicTimeExtInstalled = musicTimeExtInstalled;
function editorOpsExtInstalled() {
    return !!vscode_1.extensions.getExtension(Constants_1.EDITOR_OPS_EXT_ID);
}
exports.editorOpsExtInstalled = editorOpsExtInstalled;
function getFileNameFromPath(filePath) {
    const parts = isWindows() ? filePath.split('\\') : filePath.split('/');
    return parts[parts.length - 1].split('.')[0];
}
exports.getFileNameFromPath = getFileNameFromPath;
//# sourceMappingURL=Util.js.map