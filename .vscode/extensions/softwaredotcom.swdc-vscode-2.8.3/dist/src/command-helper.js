"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommands = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("./Util");
const AccountManager_1 = require("./menu/AccountManager");
const Constants_1 = require("./Constants");
const FlowManager_1 = require("./managers/FlowManager");
const WebViewManager_1 = require("./managers/WebViewManager");
const ConfigManager_1 = require("./managers/ConfigManager");
const StatusBarManager_1 = require("./managers/StatusBarManager");
const CodeTimeView_1 = require("./sidebar/CodeTimeView");
const ProgressManager_1 = require("./managers/ProgressManager");
const DataController_1 = require("./DataController");
const AuthProvider_1 = require("./auth/AuthProvider");
function createCommands(ctx, kpmController, storageManager) {
    let cmds = [];
    ctx.subscriptions.push((0, AuthProvider_1.getAuthInstance)());
    cmds.push(kpmController);
    // INITALIZE SIDEBAR WEB VIEW PROVIDER
    const sidebar = new CodeTimeView_1.CodeTimeView(ctx.extensionUri);
    cmds.push(vscode_1.commands.registerCommand('codetime.softwareKpmDashboard', () => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/dashboard/code_time`);
    }));
    cmds.push(vscode_1.window.registerWebviewViewProvider('codetime.webView', sidebar, {
        webviewOptions: {
            retainContextWhenHidden: false,
        },
    }));
    // REFRESH EDITOR OPS SIDEBAR
    cmds.push(vscode_1.commands.registerCommand('codetime.refreshCodeTimeView', () => {
        sidebar.refresh();
    }));
    // DISPLAY EDITOR OPS SIDEBAR
    cmds.push(vscode_1.commands.registerCommand('codetime.displaySidebar', () => {
        // opens the sidebar manually from a the above command
        vscode_1.commands.executeCommand('workbench.view.extension.code-time-sidebar');
    }));
    // TOGGLE STATUS BAR METRIC VISIBILITY
    cmds.push(vscode_1.commands.registerCommand('codetime.toggleStatusBar', () => {
        (0, StatusBarManager_1.toggleStatusBar)();
        vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
    }));
    // LAUNCH SWITCH ACCOUNT
    cmds.push(vscode_1.commands.registerCommand('codetime.switchAccount', () => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH EMAIL LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.codeTimeLogin', (item) => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH EMAIL LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.codeTimeSignup', (item) => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH SIGN UP FLOW
    cmds.push(vscode_1.commands.registerCommand('codetime.registerAccount', () => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH EXISTING ACCOUNT LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.login', () => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH GOOGLE LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.googleLogin', (item) => {
        (0, AccountManager_1.authLogin)();
    }));
    // LAUNCH GITHUB LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.githubLogin', (item) => {
        (0, AccountManager_1.authLogin)();
    }));
    // SUBMIT AN ISSUE
    cmds.push(vscode_1.commands.registerCommand('codetime.submitAnIssue', (item) => {
        (0, Util_1.launchWebUrl)(Constants_1.vscode_issues_url);
    }));
    // DISPLAY README MD
    cmds.push(vscode_1.commands.registerCommand('codetime.displayReadme', () => {
        (0, Util_1.displayReadme)();
    }));
    // DISPLAY PROJECT METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand('codetime.viewProjectReports', () => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/code_time/reports`);
    }));
    // DISPLAY CODETIME DASHBOARD WEBVIEW
    cmds.push(vscode_1.commands.registerCommand('codetime.viewDashboard', (params) => {
        (0, WebViewManager_1.showDashboard)(params);
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.connectSlack', () => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/code_time/integration_type/slack`);
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.enableFlowMode', () => {
        (0, FlowManager_1.enableFlow)({ automated: false });
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.exitFlowMode', () => {
        (0, FlowManager_1.pauseFlow)();
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.manageSlackConnection', () => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/code_time/integration_type/slack`);
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.skipSlackConnect', () => {
        (0, Util_1.setItem)('vscode_CtskipSlackConnect', true);
        // refresh the view
        vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.updateViewMetrics', () => {
        (0, StatusBarManager_1.updateFlowModeStatusBar)();
        (0, StatusBarManager_1.updateStatusBarWithSummaryData)();
    }));
    // Close the settings view
    cmds.push(vscode_1.commands.registerCommand('codetime.closeSettings', (payload) => {
        (0, ConfigManager_1.closeSettings)();
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.configureSettings', () => {
        (0, ConfigManager_1.configureSettings)();
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.updateSidebarSettings', (payload) => {
        (0, ProgressManager_1.progressIt)('Updating settings...', ConfigManager_1.updateSettings, [payload.path, payload.json, true]);
    }));
    // Update the settings preferences
    cmds.push(vscode_1.commands.registerCommand('codetime.updateSettings', (payload) => {
        (0, ProgressManager_1.progressIt)('Updating settings...', ConfigManager_1.updateSettings, [payload.path, payload.json]);
    }));
    // show the org overview
    cmds.push(vscode_1.commands.registerCommand('codetime.showOrgDashboard', (slug) => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/organizations/${slug}/overview`);
    }));
    // show the connect org view
    cmds.push(vscode_1.commands.registerCommand('codetime.createOrg', () => {
        (0, Util_1.launchWebUrl)(`${Constants_1.app_url}/organizations/new`);
    }));
    // show the Software.com flow mode info
    cmds.push(vscode_1.commands.registerCommand('codetime.displayFlowModeInfo', () => {
        (0, Util_1.launchWebUrl)("https://www.software.com/src/auto-flow-mode");
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.logout', async () => {
        const user = await (0, DataController_1.getCachedUser)();
        if (user?.registered) {
            // clear the storage and recreate an anon user
            storageManager.clearStorage();
            // reset the user session
            await (0, AccountManager_1.createAnonymousUser)();
            // update the login status
            (0, Util_1.showInformationMessage)(`Successfully logged out of your Code Time account`);
            await (0, DataController_1.reload)();
        }
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.authSignIn', async () => {
        (0, AccountManager_1.authLogin)();
    }));
    cmds.push(vscode_1.authentication.onDidChangeSessions(async (e) => {
        await vscode_1.authentication.getSession(AuthProvider_1.AUTH_TYPE, ['profile'], { createIfNone: false });
    }));
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map