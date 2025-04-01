"use strict";
// Copyright (c) 2018 Software. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentColorKind = exports.intializePlugin = exports.activate = exports.deactivate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const DataController_1 = require("./DataController");
const OnboardManager_1 = require("./user/OnboardManager");
const Util_1 = require("./Util");
const command_helper_1 = require("./command-helper");
const KpmManager_1 = require("./managers/KpmManager");
const TrackerManager_1 = require("./managers/TrackerManager");
const websockets_1 = require("./websockets");
const StatusBarManager_1 = require("./managers/StatusBarManager");
const SummaryManager_1 = require("./managers/SummaryManager");
const SyncManger_1 = require("./managers/SyncManger");
const ChangeStateManager_1 = require("./managers/ChangeStateManager");
const FlowManager_1 = require("./managers/FlowManager");
const ExtensionManager_1 = require("./managers/ExtensionManager");
const LocalStorageManager_1 = require("./managers/LocalStorageManager");
const endOfDay_1 = require("./notifications/endOfDay");
const AuthProvider_1 = require("./auth/AuthProvider");
let currentColorKind = undefined;
let storageManager = undefined;
let user = null;
const tracker = TrackerManager_1.TrackerManager.getInstance();
//
// Add the keystroke controller to the ext ctx, which
// will then listen for text document changes.
//
const kpmController = KpmManager_1.KpmManager.getInstance();
function deactivate(ctx) {
    // store the deactivate event
    tracker.trackEditorAction('editor', 'deactivate');
    TrackerManager_1.TrackerManager.getInstance().dispose();
    ChangeStateManager_1.ChangeStateManager.getInstance().dispose();
    ExtensionManager_1.ExtensionManager.getInstance().dispose();
    // dispose the file watchers
    kpmController.dispose();
    if ((0, Util_1.isPrimaryWindow)()) {
        if (storageManager)
            storageManager.clearDupStorageKeys();
    }
    (0, websockets_1.disposeWebsocketTimeouts)();
}
exports.deactivate = deactivate;
async function activate(ctx) {
    const authProvider = new AuthProvider_1.AuthProvider(ctx);
    storageManager = LocalStorageManager_1.LocalStorageManager.getInstance(ctx);
    initializeSession(storageManager);
    (0, DataController_1.initializeAuthProvider)(authProvider);
    // add the code time commands
    ctx.subscriptions.push((0, command_helper_1.createCommands)(ctx, kpmController, storageManager));
    TrackerManager_1.TrackerManager.storageMgr = storageManager;
    // session: {id: <String>, accessToken: <String>, account: {label: <String>, id: <Number>}, scopes: [<String>,...]}
    const session = await vscode_1.authentication.getSession(AuthProvider_1.AUTH_TYPE, [], { createIfNone: false });
    let jwt = (0, Util_1.getItem)('jwt');
    user = await (0, DataController_1.getUser)();
    if (session) {
        // fetch the user with the non-session jwt to compare
        if (!user || user.email != session.account.label) {
            jwt = session.accessToken;
            // update the local storage with the new user
            (0, Util_1.setItem)('name', session.account.label);
            (0, Util_1.setItem)('jwt', jwt);
            user = await (0, DataController_1.getUser)(jwt);
        }
    }
    else if (jwt && user?.registered) {
        // update the session with the existing jwt
        authProvider.updateSession(jwt);
    }
    if (jwt) {
        intializePlugin();
    }
    else if (vscode_1.window.state.focused) {
        (0, OnboardManager_1.onboardInit)(ctx, intializePlugin /*successFunction*/);
    }
    else {
        // 5 to 10 second delay
        const secondDelay = (0, Util_1.getRandomNumberWithinRange)(6, 10);
        setTimeout(() => {
            (0, OnboardManager_1.onboardInit)(ctx, intializePlugin /*successFunction*/);
        }, 1000 * secondDelay);
    }
}
exports.activate = activate;
async function intializePlugin() {
    (0, Util_1.logIt)(`Loaded ${(0, Util_1.getPluginName)()} v${(0, Util_1.getVersion)()}`);
    // INIT websockets
    try {
        (0, websockets_1.initializeWebsockets)();
    }
    catch (e) {
        (0, Util_1.logIt)(`Failed to initialize websockets: ${e.message}`);
    }
    // INIT keystroke analysis tracker
    await tracker.init();
    // initialize user and preferences
    if (!user)
        user = await (0, DataController_1.getUser)();
    // show the sidebar if this is the 1st
    if (!(0, Util_1.getBooleanItem)('vscode_CtInit')) {
        (0, Util_1.setItem)('vscode_CtInit', true);
        setTimeout(() => {
            vscode_1.commands.executeCommand('codetime.displaySidebar');
        }, 1000);
        (0, Util_1.displayReadme)();
    }
    (0, StatusBarManager_1.initializeStatusBar)();
    if ((0, Util_1.isPrimaryWindow)()) {
        // store the activate event
        tracker.trackEditorAction('editor', 'activate');
        // it's the primary window. initialize flow mode and session summary information
        (0, FlowManager_1.initializeFlowModeState)();
        SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
    }
    else {
        // it's a secondary window. update the statusbar
        (0, StatusBarManager_1.updateFlowModeStatusBar)();
        (0, StatusBarManager_1.updateStatusBarWithSummaryData)();
    }
    setTimeout(() => {
        // INIT doc change events
        ChangeStateManager_1.ChangeStateManager.getInstance();
        // INIT extension manager change listener
        ExtensionManager_1.ExtensionManager.getInstance().initialize();
        // INIT session summary sync manager
        SyncManger_1.SyncManager.getInstance();
    }, 3000);
    setTimeout(() => {
        // Set the end of the day notification trigger if it's enabled
        (0, endOfDay_1.setEndOfDayNotification)();
    }, 5000);
}
exports.intializePlugin = intializePlugin;
function getCurrentColorKind() {
    if (!currentColorKind) {
        currentColorKind = vscode_1.window.activeColorTheme.kind;
    }
    return currentColorKind;
}
exports.getCurrentColorKind = getCurrentColorKind;
function initializeSession(storageManager) {
    if (vscode_1.window.state.focused) {
        (0, Util_1.setItem)('vscode_primary_window', (0, Util_1.getWorkspaceName)());
        if (storageManager)
            storageManager.clearDupStorageKeys();
    }
}
//# sourceMappingURL=extension.js.map