"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const axios_1 = require("axios");
const plugin_1 = require("../commands/plugin");
const shared_1 = require("../shared");
const leetCodeManager_1 = require("../leetCodeManager");
const getTimeZone = () => {
    const endPoint = plugin_1.getLeetCodeEndpoint();
    if (endPoint === shared_1.Endpoint.LeetCodeCN) {
        return "Asia/Shanghai";
    }
    else {
        return "UTC";
    }
};
const testReportUrl = "https://analysis.lingkou.xyz/i/event";
const prodReportUrl = "https://analysis.leetcode.cn/i/event";
function getReportUrl() {
    if (process.env.NODE_ENV === "production") {
        return prodReportUrl;
    }
    else {
        return testReportUrl;
    }
}
const _charStr = "abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=";
function RandomIndex(min, max, i) {
    let index = Math.floor(Math.random() * (max - min + 1) + min);
    const numStart = _charStr.length - 10;
    if (i === 0 && index >= numStart) {
        index = RandomIndex(min, max, i);
    }
    return index;
}
function getRandomString(len) {
    const min = 0;
    const max = _charStr.length - 1;
    let _str = "";
    len = len || 15;
    for (let i = 0, index; i < len; i++) {
        index = RandomIndex(min, max, i);
        _str += _charStr[index];
    }
    return _str;
}
function getAllowReportDataConfig() {
    const leetCodeConfig = vscode.workspace.getConfiguration("leetcode");
    const allowReportData = !!leetCodeConfig.get("allowReportData");
    return allowReportData;
}
class TrackData {
    constructor() {
        this.reportCache = [];
        this.isSubmit = false;
        this.reportUrl = getReportUrl();
        this.report = (reportItems) => {
            if (!getAllowReportDataConfig())
                return;
            this.sendTimer && clearTimeout(this.sendTimer);
            if (!Array.isArray(reportItems)) {
                reportItems = [reportItems];
            }
            const randomId = getRandomString(60);
            reportItems.forEach((item) => {
                var _a, _b;
                this.reportCache.push(Object.assign(Object.assign({}, item), { referer: "vscode", target: (_a = leetCodeManager_1.leetCodeManager.getUser()) !== null && _a !== void 0 ? _a : "", anonymous_id: (_b = item.anonymous_id) !== null && _b !== void 0 ? _b : randomId }));
            });
            this.sendTimer = setTimeout(this.submitReport, 800);
        };
        this.submitReport = () => __awaiter(this, void 0, void 0, function* () {
            if (!getAllowReportDataConfig())
                return;
            const dataList = JSON.stringify(this.reportCache);
            if (!this.reportCache.length || this.isSubmit) {
                return;
            }
            this.reportCache = [];
            try {
                this.isSubmit = true;
                axios_1.default.defaults.withCredentials = true;
                yield axios_1.default.post(this.reportUrl, `dataList=${encodeURIComponent(dataList)}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "x-timezone": getTimeZone(),
                    },
                });
            }
            catch (e) {
                this.reportCache = this.reportCache.concat(JSON.parse(dataList));
            }
            finally {
                this.isSubmit = false;
            }
        });
    }
}
exports.default = new TrackData();
//# sourceMappingURL=trackingUtils.js.map