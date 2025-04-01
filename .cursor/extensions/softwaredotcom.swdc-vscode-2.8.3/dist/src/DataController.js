"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reload = exports.userDeletedCompletionHandler = exports.authenticationCompleteHandler = exports.getUser = exports.getUserPreferences = exports.isRegistered = exports.getCachedUser = exports.getCachedSlackIntegrations = exports.initializeAuthProvider = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("./http/HttpClient");
const Util_1 = require("./Util");
const websockets_1 = require("./websockets");
const SummaryManager_1 = require("./managers/SummaryManager");
const FlowManager_1 = require("./managers/FlowManager");
let currentUser = null;
let authProvider = null;
function initializeAuthProvider(provider) {
    authProvider = provider;
}
exports.initializeAuthProvider = initializeAuthProvider;
async function getCachedSlackIntegrations() {
    currentUser = await getCachedUser();
    if (currentUser?.integration_connections?.length) {
        return currentUser?.integration_connections?.filter((integration) => integration.status === 'ACTIVE' && (integration.integration_type_id === 14));
    }
    return [];
}
exports.getCachedSlackIntegrations = getCachedSlackIntegrations;
async function getCachedUser() {
    if (!currentUser) {
        currentUser = await getUser();
    }
    return currentUser;
}
exports.getCachedUser = getCachedUser;
function isRegistered() {
    return !!(0, Util_1.getItem)('name');
}
exports.isRegistered = isRegistered;
async function getUserPreferences() {
    currentUser = await getCachedUser();
    if (currentUser) {
        return currentUser.preferences_parsed;
    }
    return {};
}
exports.getUserPreferences = getUserPreferences;
async function getUser(token_override = '') {
    const resp = await (0, HttpClient_1.appGet)('/api/v1/user', {}, token_override);
    if ((0, HttpClient_1.isResponseOk)(resp) && resp.data) {
        currentUser = resp.data;
        return currentUser;
    }
    return null;
}
exports.getUser = getUser;
async function authenticationCompleteHandler(user, override_jwt = '') {
    (0, Util_1.setAuthCallbackState)(null);
    if (user?.registered === 1) {
        currentUser = user;
        // new user
        if (override_jwt) {
            (0, Util_1.setItem)('jwt', override_jwt);
        }
        else if (user.plugin_jwt) {
            (0, Util_1.setItem)('jwt', user.plugin_jwt);
        }
        (0, Util_1.setItem)('name', user.email);
        (0, Util_1.setItem)('updatedAt', new Date().getTime());
        (0, Util_1.setItem)('logging_in', false);
        // ensure the session is updated
        if (authProvider) {
            authProvider.updateSession((0, Util_1.getItem)('jwt'), user);
        }
        // update the login status
        (0, Util_1.showInformationMessage)('Successfully logged on to Code Time');
        await reload();
    }
}
exports.authenticationCompleteHandler = authenticationCompleteHandler;
async function userDeletedCompletionHandler() {
    vscode_1.commands.executeCommand('codetime.logout');
}
exports.userDeletedCompletionHandler = userDeletedCompletionHandler;
async function reload() {
    (0, FlowManager_1.updateFlowModeStatus)();
    try {
        (0, websockets_1.initializeWebsockets)();
    }
    catch (e) {
        (0, Util_1.logIt)(`Failed to initialize websockets: ${e.message}`);
    }
    // re-initialize user and preferences
    await getUser();
    // fetch after logging on
    SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
    if ((0, Util_1.musicTimeExtInstalled)()) {
        setTimeout(() => {
            vscode_1.commands.executeCommand("musictime.refreshMusicTimeView");
        }, 1000);
    }
    if ((0, Util_1.editorOpsExtInstalled)()) {
        setTimeout(() => {
            vscode_1.commands.executeCommand("editorOps.refreshEditorOpsView");
        }, 1000);
    }
    vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
}
exports.reload = reload;
//# sourceMappingURL=DataController.js.map