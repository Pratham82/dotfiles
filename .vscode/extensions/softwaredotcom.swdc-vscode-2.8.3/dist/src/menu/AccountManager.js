"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnonymousUser = exports.authLogin = void 0;
const Util_1 = require("../Util");
const HttpClient_1 = require("../http/HttpClient");
const vscode_1 = require("vscode");
const AuthProvider_1 = require("../auth/AuthProvider");
let creatingAnonUser = false;
async function authLogin() {
    const session = await vscode_1.authentication.getSession(AuthProvider_1.AUTH_TYPE, [], { createIfNone: true });
    if (session) {
        const latestUpdate = (0, Util_1.getItem)('updatedAt');
        if (!latestUpdate || new Date().getTime() - latestUpdate > (1000 * 3)) {
            await (0, AuthProvider_1.getAuthInstance)().removeSession(session.account.id);
            await vscode_1.authentication.getSession(AuthProvider_1.AUTH_TYPE, [], { createIfNone: true });
        }
    }
}
exports.authLogin = authLogin;
/**
 * create an anonymous user based on github email or mac addr
 */
async function createAnonymousUser() {
    if (creatingAnonUser) {
        return;
    }
    const jwt = (0, Util_1.getItem)('jwt');
    // check one more time before creating the anon user
    if (!jwt) {
        creatingAnonUser = true;
        // this should not be undefined if its an account reset
        let plugin_uuid = (0, Util_1.getPluginUuid)();
        let auth_callback_state = (0, Util_1.getAuthCallbackState)();
        const username = (0, Util_1.getOsUsername)();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const hostname = (0, Util_1.getHostname)();
        const resp = await (0, HttpClient_1.appPost)('/api/v1/anonymous_user', {
            timezone,
            username,
            plugin_uuid,
            hostname,
            auth_callback_state,
        });
        if ((0, HttpClient_1.isResponseOk)(resp) && resp.data) {
            (0, Util_1.setItem)('jwt', resp.data.plugin_jwt);
            if (!resp.data.registered) {
                (0, Util_1.setItem)('name', null);
            }
            (0, Util_1.setAuthCallbackState)('');
        }
    }
    creatingAnonUser = false;
}
exports.createAnonymousUser = createAnonymousUser;
//# sourceMappingURL=AccountManager.js.map