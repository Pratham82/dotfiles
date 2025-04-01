"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardInit = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const AccountManager_1 = require("../menu/AccountManager");
let retry_counter = 0;
async function onboardInit(ctx, callback) {
    if ((0, Util_1.getItem)('jwt')) {
        // we have the jwt, call the callback that anon was not created
        return callback(ctx, false /*anonCreated*/);
    }
    if (vscode_1.window.state.focused) {
        // perform primary window related work
        primaryWindowOnboarding(ctx, callback);
    }
    else {
        // call the secondary onboarding logic
        secondaryWindowOnboarding(ctx, callback);
    }
}
exports.onboardInit = onboardInit;
async function primaryWindowOnboarding(ctx, callback) {
    await (0, AccountManager_1.createAnonymousUser)();
    callback(ctx, true /*anonCreated*/);
}
/**
 * This is called if there's no JWT. If it reaches a
 * 6th call it will create an anon user.
 * @param ctx
 * @param callback
 */
async function secondaryWindowOnboarding(ctx, callback) {
    if ((0, Util_1.getItem)("jwt")) {
        return;
    }
    if (retry_counter < 5) {
        retry_counter++;
        // call activate again in about 15 seconds
        setTimeout(() => {
            onboardInit(ctx, callback);
        }, 1000 * 15);
        return;
    }
    // tried enough times, create an anon user
    await (0, AccountManager_1.createAnonymousUser)();
    // call the callback
    return callback(ctx, true /*anonCreated*/);
}
//# sourceMappingURL=OnboardManager.js.map