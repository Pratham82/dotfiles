"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthenticatedPluginUser = void 0;
const DataController_1 = require("../DataController");
async function handleAuthenticatedPluginUser(user) {
    (0, DataController_1.authenticationCompleteHandler)(user);
}
exports.handleAuthenticatedPluginUser = handleAuthenticatedPluginUser;
//# sourceMappingURL=authenticated_plugin_user.js.map