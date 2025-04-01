"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LcAxios = void 0;
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const globalState_1 = require("../globalState");
const uiUtils_1 = require("./uiUtils");
const referer = "vscode-lc-extension";
function LcAxios(path, settings) {
    const cookie = globalState_1.globalState.getCookie();
    if (!cookie) {
        uiUtils_1.promptForOpenOutputChannel(`Failed to obtain the cookie. Please log in again.`, uiUtils_1.DialogType.error);
        return Promise.reject("Failed to obtain the cookie.");
    }
    return axios_1.default(path, Object.assign({ headers: Object.assign({ referer, "content-type": "application/json", cookie }, (settings && settings.headers)), xsrfCookieName: "csrftoken", xsrfHeaderName: "X-CSRFToken" }, (settings && lodash_1.omit(settings, "headers"))));
}
exports.LcAxios = LcAxios;
//# sourceMappingURL=httpUtils.js.map