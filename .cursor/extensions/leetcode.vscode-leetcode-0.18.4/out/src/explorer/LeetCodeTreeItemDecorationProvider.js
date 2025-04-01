"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeTreeItemDecorationProvider = exports.LeetCodeTreeItemDecorationProvider = void 0;
const url_1 = require("url");
const vscode_1 = require("vscode");
class LeetCodeTreeItemDecorationProvider {
    constructor() {
        this.DIFFICULTY_BADGE_LABEL = {
            easy: "E",
            medium: "M",
            hard: "H",
        };
        this.ITEM_COLOR = {
            easy: new vscode_1.ThemeColor("charts.green"),
            medium: new vscode_1.ThemeColor("charts.yellow"),
            hard: new vscode_1.ThemeColor("charts.red"),
        };
    }
    provideFileDecoration(uri) {
        if (!this.isDifficultyBadgeEnabled()) {
            return;
        }
        if (uri.scheme !== "leetcode" && uri.authority !== "problems") {
            return;
        }
        const params = new url_1.URLSearchParams(uri.query);
        const difficulty = params.get("difficulty").toLowerCase();
        return {
            badge: this.DIFFICULTY_BADGE_LABEL[difficulty],
            color: this.ITEM_COLOR[difficulty],
        };
    }
    isDifficultyBadgeEnabled() {
        const configuration = vscode_1.workspace.getConfiguration();
        return configuration.get("leetcode.colorizeProblems", false);
    }
}
exports.LeetCodeTreeItemDecorationProvider = LeetCodeTreeItemDecorationProvider;
exports.leetCodeTreeItemDecorationProvider = new LeetCodeTreeItemDecorationProvider();
//# sourceMappingURL=LeetCodeTreeItemDecorationProvider.js.map