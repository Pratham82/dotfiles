"use strict";
// Copyright (c) leo.zhao. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalState = void 0;
const CookieKey = "leetcode-cookie";
const UserStatusKey = "leetcode-user-status";
class GlobalState {
    initialize(context) {
        this.context = context;
        this._state = this.context.globalState;
    }
    setCookie(cookie) {
        this._cookie = cookie;
        return this._state.update(CookieKey, this._cookie);
    }
    getCookie() {
        var _a;
        return (_a = this._cookie) !== null && _a !== void 0 ? _a : this._state.get(CookieKey);
    }
    setUserStatus(userStatus) {
        this._userStatus = userStatus;
        return this._state.update(UserStatusKey, this._userStatus);
    }
    getUserStatus() {
        var _a;
        return (_a = this._userStatus) !== null && _a !== void 0 ? _a : this._state.get(UserStatusKey);
    }
    removeCookie() {
        this._state.update(CookieKey, undefined);
    }
    removeAll() {
        this._state.update(CookieKey, undefined);
        this._state.update(UserStatusKey, undefined);
    }
}
exports.globalState = new GlobalState();
//# sourceMappingURL=globalState.js.map