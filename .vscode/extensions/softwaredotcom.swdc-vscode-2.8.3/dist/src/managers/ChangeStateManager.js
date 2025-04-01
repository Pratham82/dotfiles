"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeStateManager = void 0;
const vscode_1 = require("vscode");
const TrackerManager_1 = require("./TrackerManager");
const editor_flow_1 = require("@swdotcom/editor-flow");
const ConfigManager_1 = require("./ConfigManager");
const Util_1 = require("../Util");
const websockets_1 = require("../websockets");
class ChangeStateManager {
    constructor() {
        let subscriptions = [];
        this.tracker = TrackerManager_1.TrackerManager.getInstance();
        const iface = {
            disposable: vscode_1.Disposable,
            window: vscode_1.window,
            workspace: vscode_1.workspace,
        };
        const editorFlow = editor_flow_1.EditorFlow.getInstance(editor_flow_1.EditorType.VSCODE, iface);
        const emitter = editorFlow.getEmitter();
        emitter.on('editor_flow_data', (data) => {
            switch (data.flow_event_type) {
                case editor_flow_1.FlowEventType.SAVE:
                    this.fileSaveHandler(data.event);
                    break;
                case editor_flow_1.FlowEventType.UNFOCUS:
                    this.windowStateChangeHandler(data.event);
                    break;
                case editor_flow_1.FlowEventType.FOCUS:
                    this.windowStateChangeHandler(data.event);
                    break;
                case editor_flow_1.FlowEventType.THEME:
                    this.themeKindChangeHandler(data.event);
                    break;
                case editor_flow_1.FlowEventType.KPM:
                    // get the project_change_info attribute and post it
                    this.kpmHandler(data.project_change_info);
                    break;
            }
        });
        this.disposable = vscode_1.Disposable.from(...subscriptions);
    }
    static getInstance() {
        if (!ChangeStateManager.instance) {
            ChangeStateManager.instance = new ChangeStateManager();
        }
        return ChangeStateManager.instance;
    }
    kpmHandler(projectChangeInfo) {
        this.tracker.trackCodeTimeEvent(projectChangeInfo);
    }
    fileSaveHandler(event) {
        this.tracker.trackEditorAction('file', 'save', event);
    }
    windowStateChangeHandler(event) {
        if (event.focused) {
            this.tracker.trackEditorAction('editor', 'focus');
            (0, Util_1.setItem)('vscode_primary_window', (0, Util_1.getWorkspaceName)());
            // check if the websocket connection is stale
            (0, websockets_1.checkWebsocketConnection)();
        }
        else if ((0, Util_1.isPrimaryWindow)() && event.active) {
            // primary editor window is unfocused
            this.tracker.trackEditorAction('editor', 'unfocus');
        }
    }
    themeKindChangeHandler(event) {
        // let the sidebar know the new current color kind
        setTimeout(() => {
            vscode_1.commands.executeCommand('codetime.refreshCodeTimeView');
            if ((0, ConfigManager_1.showingConfigureSettingsPanel)()) {
                setTimeout(() => {
                    (0, ConfigManager_1.configureSettings)();
                }, 500);
            }
        }, 150);
    }
    dispose() {
        this.disposable.dispose();
    }
}
exports.ChangeStateManager = ChangeStateManager;
//# sourceMappingURL=ChangeStateManager.js.map