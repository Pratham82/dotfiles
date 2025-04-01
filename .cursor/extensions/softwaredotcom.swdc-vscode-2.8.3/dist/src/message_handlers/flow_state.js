"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFlowStateMessage = void 0;
const FlowManager_1 = require("../managers/FlowManager");
async function handleFlowStateMessage(body) {
    // body contains {enable_flow: true | false}
    const { enable_flow } = body;
    // exit flow mode if we get "enable_flow = false"
    if (!enable_flow) {
        // disable it
        (0, FlowManager_1.pauseFlowInitiate)();
    }
}
exports.handleFlowStateMessage = handleFlowStateMessage;
//# sourceMappingURL=flow_state.js.map