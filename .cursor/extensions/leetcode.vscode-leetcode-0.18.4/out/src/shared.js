"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = exports.urlsCn = exports.urls = exports.PREMIUM_URL_GLOBAL = exports.PREMIUM_URL_CN = exports.SortingStrategy = exports.leetcodeHasInited = exports.DescriptionConfiguration = exports.supportedPlugins = exports.Category = exports.defaultProblem = exports.Endpoint = exports.ProblemState = exports.langExt = exports.languages = exports.loginArgsMapping = exports.UserStatus = void 0;
const vscode = require("vscode");
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["SignedIn"] = 1] = "SignedIn";
    UserStatus[UserStatus["SignedOut"] = 2] = "SignedOut";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
exports.loginArgsMapping = new Map([
    ["LeetCode", "-l"],
    ["Cookie", "-c"],
    ["GitHub", "-g"],
    ["LinkedIn", "-i"],
]);
exports.languages = [
    "bash",
    "c",
    "cpp",
    "csharp",
    "golang",
    "java",
    "javascript",
    "kotlin",
    "mysql",
    "php",
    "python",
    "python3",
    "ruby",
    "rust",
    "scala",
    "swift",
    "typescript",
];
exports.langExt = new Map([
    ["bash", "sh"],
    ["c", "c"],
    ["cpp", "cpp"],
    ["csharp", "cs"],
    ["golang", "go"],
    ["java", "java"],
    ["javascript", "js"],
    ["kotlin", "kt"],
    ["mysql", "sql"],
    ["php", "php"],
    ["python", "py"],
    ["python3", "py"],
    ["ruby", "rb"],
    ["rust", "rs"],
    ["scala", "scala"],
    ["swift", "swift"],
    ["typescript", "ts"],
]);
var ProblemState;
(function (ProblemState) {
    ProblemState[ProblemState["AC"] = 1] = "AC";
    ProblemState[ProblemState["NotAC"] = 2] = "NotAC";
    ProblemState[ProblemState["Unknown"] = 3] = "Unknown";
    ProblemState[ProblemState["Locked"] = 4] = "Locked";
})(ProblemState = exports.ProblemState || (exports.ProblemState = {}));
var Endpoint;
(function (Endpoint) {
    Endpoint["LeetCode"] = "leetcode";
    Endpoint["LeetCodeCN"] = "leetcode-cn";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
exports.defaultProblem = {
    isFavorite: false,
    locked: false,
    state: ProblemState.Unknown,
    id: "",
    name: "",
    difficulty: "",
    passRate: "",
    companies: [],
    tags: [],
};
var Category;
(function (Category) {
    Category["All"] = "All";
    Category["Difficulty"] = "Difficulty";
    Category["Tag"] = "Tag";
    Category["Company"] = "Company";
    Category["Favorite"] = "Favorite";
})(Category = exports.Category || (exports.Category = {}));
exports.supportedPlugins = ["company", "solution.discuss", "leetcode.cn"];
var DescriptionConfiguration;
(function (DescriptionConfiguration) {
    DescriptionConfiguration["InWebView"] = "In Webview";
    DescriptionConfiguration["InFileComment"] = "In File Comment";
    DescriptionConfiguration["Both"] = "Both";
    DescriptionConfiguration["None"] = "None";
})(DescriptionConfiguration = exports.DescriptionConfiguration || (exports.DescriptionConfiguration = {}));
exports.leetcodeHasInited = "leetcode.hasInited";
var SortingStrategy;
(function (SortingStrategy) {
    SortingStrategy["None"] = "None";
    SortingStrategy["AcceptanceRateAsc"] = "Acceptance Rate (Ascending)";
    SortingStrategy["AcceptanceRateDesc"] = "Acceptance Rate (Descending)";
    SortingStrategy["FrequencyAsc"] = "Frequency (Ascending)";
    SortingStrategy["FrequencyDesc"] = "Frequency (Descending)";
})(SortingStrategy = exports.SortingStrategy || (exports.SortingStrategy = {}));
exports.PREMIUM_URL_CN = "https://leetcode.cn/premium-payment/?source=vscode";
exports.PREMIUM_URL_GLOBAL = "https://leetcode.com/subscribe/?ref=lp_pl&source=vscode";
const protocol = vscode.env.appName.includes('Insiders') ? "vscode-insiders" : "vscode";
exports.urls = {
    // base urls
    base: "https://leetcode.com",
    graphql: "https://leetcode.com/graphql",
    userGraphql: "https://leetcode.com/graphql",
    login: "https://leetcode.com/accounts/login/",
    authLoginUrl: `https://leetcode.com/authorize-login/${protocol}/?path=leetcode.vscode-leetcode`,
};
exports.urlsCn = {
    // base urls
    base: "https://leetcode.cn",
    graphql: "https://leetcode.cn/graphql",
    userGraphql: "https://leetcode.cn/graphql/",
    login: "https://leetcode.cn/accounts/login/",
    authLoginUrl: `https://leetcode.cn/authorize-login/${protocol}/?path=leetcode.vscode-leetcode`,
};
const getUrl = (key) => {
    const leetCodeConfig = vscode.workspace.getConfiguration("leetcode");
    const point = leetCodeConfig.get("endpoint", Endpoint.LeetCode);
    switch (point) {
        case Endpoint.LeetCodeCN:
            return exports.urlsCn[key];
        case Endpoint.LeetCode:
        default:
            return exports.urls[key];
    }
};
exports.getUrl = getUrl;
//# sourceMappingURL=shared.js.map