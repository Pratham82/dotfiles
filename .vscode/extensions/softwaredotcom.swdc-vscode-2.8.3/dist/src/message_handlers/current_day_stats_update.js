"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCurrentDayStatsUpdate = void 0;
const vscode_1 = require("vscode");
const SummaryManager_1 = require("../managers/SummaryManager");
// { user_id: row["USER_ID"], data: SessionSummary, action: "update" }
async function handleCurrentDayStatsUpdate(currentDayStatsInfo) {
    if (currentDayStatsInfo.data) {
        // update the session summary data
        SummaryManager_1.SummaryManager.getInstance().updateCurrentDayStats(currentDayStatsInfo.data);
        vscode_1.commands.executeCommand('codetime.updateViewMetrics');
    }
}
exports.handleCurrentDayStatsUpdate = handleCurrentDayStatsUpdate;
//# sourceMappingURL=current_day_stats_update.js.map