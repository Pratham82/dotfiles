"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeTimeEvent = exports.DiffNumStats = exports.SessionSummary = exports.KpmItem = exports.UIInteractionType = void 0;
const Util_1 = require("../Util");
const vscode_1 = require("vscode");
var UIInteractionType;
(function (UIInteractionType) {
    UIInteractionType["Keyboard"] = "keyboard";
    UIInteractionType["Click"] = "click";
})(UIInteractionType || (exports.UIInteractionType = UIInteractionType = {}));
class KpmItem {
    constructor() {
        this.id = '';
        this.label = '';
        this.description = '';
        this.value = '';
        this.tooltip = '';
        this.command = '';
        this.commandArgs = [];
        this.type = '';
        this.contextValue = '';
        this.callback = null;
        this.icon = null;
        this.children = [];
        this.color = '';
        this.location = '';
        this.name = '';
        this.eventDescription = null;
        this.initialCollapsibleState = vscode_1.TreeItemCollapsibleState.Collapsed;
        this.interactionType = UIInteractionType.Click;
        this.interactionIcon = '';
        this.hideCTAInTracker = false;
    }
}
exports.KpmItem = KpmItem;
class SessionSummary {
    constructor() {
        this.currentDayMinutes = 0;
        this.averageDailyMinutes = 0;
    }
}
exports.SessionSummary = SessionSummary;
class DiffNumStats {
    constructor() {
        this.file_name = '';
        this.insertions = 0;
        this.deletions = 0;
    }
}
exports.DiffNumStats = DiffNumStats;
// example: {type: "window", name: "close", timestamp: 1234,
// timestamp_local: 1233, description: "OnboardPrompt"}
class CodeTimeEvent {
    constructor() {
        this.type = '';
        this.name = '';
        this.timestamp = 0;
        this.timestamp_local = 0;
        this.description = '';
        this.pluginId = (0, Util_1.getPluginId)();
        this.os = (0, Util_1.getOs)();
        this.version = (0, Util_1.getVersion)();
        this.hostname = ''; // this is gathered using an await
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}
exports.CodeTimeEvent = CodeTimeEvent;
//# sourceMappingURL=models.js.map