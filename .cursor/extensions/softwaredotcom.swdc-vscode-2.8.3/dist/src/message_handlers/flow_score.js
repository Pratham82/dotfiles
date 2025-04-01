"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFlowScoreMessage = void 0;
const DataController_1 = require("../DataController");
const FlowManager_1 = require("../managers/FlowManager");
const Util_1 = require("../Util");
async function handleFlowScoreMessage(message) {
    try {
        if ((0, DataController_1.isRegistered)()) {
            (0, FlowManager_1.enableFlow)({ automated: true });
        }
    }
    catch (e) {
        (0, Util_1.logIt)("Error handling flow score message: " + e.message);
    }
}
exports.handleFlowScoreMessage = handleFlowScoreMessage;
//# sourceMappingURL=flow_score.js.map