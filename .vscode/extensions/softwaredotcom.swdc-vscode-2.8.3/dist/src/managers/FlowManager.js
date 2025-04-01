"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineFlowModeFromApi = exports.pauseFlowInitiate = exports.pauseFlow = exports.initiateFlow = exports.enableFlow = exports.updateFlowModeStatus = exports.initializeFlowModeState = exports.updateInFlowLocally = exports.isInFlowLocally = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("../http/HttpClient");
const Util_1 = require("../Util");
const SlackManager_1 = require("./SlackManager");
const ScreenManager_1 = require("./ScreenManager");
const StatusBarManager_1 = require("./StatusBarManager");
const DataController_1 = require("../DataController");
let inFlowLocally = false;
function isInFlowLocally() {
    return inFlowLocally;
}
exports.isInFlowLocally = isInFlowLocally;
function updateInFlowLocally(inFlow) {
    inFlowLocally = inFlow;
}
exports.updateInFlowLocally = updateInFlowLocally;
async function initializeFlowModeState() {
    await determineFlowModeFromApi();
    updateFlowStatus();
}
exports.initializeFlowModeState = initializeFlowModeState;
async function updateFlowModeStatus() {
    await initializeFlowModeState();
}
exports.updateFlowModeStatus = updateFlowModeStatus;
async function enableFlow({ automated = false }) {
    vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: 'Enabling flow...',
        cancellable: false,
    }, async (progress) => {
        await initiateFlow({ automated }).catch((e) => {
            console.error('[Code Time] Unable to initiate flow. ', e.message);
        });
    });
}
exports.enableFlow = enableFlow;
async function initiateFlow({ automated = false }) {
    if (!(0, DataController_1.isRegistered)() && !automated) {
        // manually initiated, show the flow mode prompt
        (0, SlackManager_1.showModalSignupPrompt)('To enable Flow Mode, please sign up or log in.');
        return;
    }
    const skipSlackCheck = !!(0, Util_1.getBooleanItem)('vscode_CtskipSlackConnect');
    if (!skipSlackCheck && !automated) {
        const connectInfo = await (0, SlackManager_1.checkSlackConnectionForFlowMode)();
        if (!connectInfo.continue) {
            return;
        }
    }
    const preferredScreenMode = await (0, ScreenManager_1.getConfiguredScreenMode)();
    // process if...
    // 1) its the primary window
    // 2) flow mode is not current enabled via the flowChange.json state
    const primary = (0, Util_1.isPrimaryWindow)();
    const flowEnabled = (0, Util_1.isFlowModeEnabled)();
    if (primary && !flowEnabled) {
        (0, Util_1.logIt)('Entering Flow Mode');
        await (0, HttpClient_1.appPost)('/plugin/flow_sessions', { automated: automated });
        // only update flow change here
        inFlowLocally = true;
        (0, Util_1.updateFlowChange)(true);
    }
    // update screen mode
    if (preferredScreenMode === ScreenManager_1.FULL_SCREEN_MODE_ID) {
        (0, ScreenManager_1.showFullScreenMode)();
    }
    else if (preferredScreenMode === ScreenManager_1.ZEN_MODE_ID) {
        (0, ScreenManager_1.showZenMode)();
    }
    else {
        (0, ScreenManager_1.showNormalScreenMode)();
    }
    updateFlowStatus();
}
exports.initiateFlow = initiateFlow;
async function pauseFlow() {
    vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: 'Turning off flow...',
        cancellable: false,
    }, async (progress) => {
        await pauseFlowInitiate().catch((e) => { });
    });
}
exports.pauseFlow = pauseFlow;
async function pauseFlowInitiate() {
    const flowEnabled = (0, Util_1.isFlowModeEnabled)();
    if (flowEnabled) {
        (0, Util_1.logIt)('Exiting Flow Mode');
        await (0, HttpClient_1.appDelete)('/plugin/flow_sessions');
        // only update flow change in here
        inFlowLocally = false;
        (0, Util_1.updateFlowChange)(false);
    }
    (0, ScreenManager_1.showNormalScreenMode)();
    updateFlowStatus();
}
exports.pauseFlowInitiate = pauseFlowInitiate;
function updateFlowStatus() {
    setTimeout(() => {
        vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
    }, 2000);
    (0, StatusBarManager_1.updateFlowModeStatusBar)();
}
async function determineFlowModeFromApi() {
    const flowSessionsReponse = (0, Util_1.getItem)('jwt')
        ? await (0, HttpClient_1.appGet)('/plugin/flow_sessions')
        : { data: { flow_sessions: [] } };
    const openFlowSessions = flowSessionsReponse?.data?.flow_sessions ?? [];
    // make sure "enabledFlow" is set as it's used as a getter outside this export
    const enabledFlow = !!(openFlowSessions?.length);
    // update the local inFlow state
    inFlowLocally = enabledFlow;
    // initialize the file value
    (0, Util_1.updateFlowChange)(enabledFlow);
}
exports.determineFlowModeFromApi = determineFlowModeFromApi;
//# sourceMappingURL=FlowManager.js.map