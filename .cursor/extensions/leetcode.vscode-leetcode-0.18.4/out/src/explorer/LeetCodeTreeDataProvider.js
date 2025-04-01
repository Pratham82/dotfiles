"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
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
exports.leetCodeTreeDataProvider = exports.LeetCodeTreeDataProvider = void 0;
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const leetCodeManager_1 = require("../leetCodeManager");
const shared_1 = require("../shared");
const explorerNodeManager_1 = require("./explorerNodeManager");
const LeetCodeNode_1 = require("./LeetCodeNode");
const globalState_1 = require("../globalState");
class LeetCodeTreeDataProvider {
    constructor() {
        this.onDidChangeTreeDataEvent = new vscode.EventEmitter();
        // tslint:disable-next-line:member-ordering
        this.onDidChangeTreeData = this.onDidChangeTreeDataEvent.event;
    }
    initialize(context) {
        this.context = context;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield explorerNodeManager_1.explorerNodeManager.refreshCache();
            this.onDidChangeTreeDataEvent.fire(null);
        });
    }
    getTreeItem(element) {
        if (element.id === "notSignIn") {
            return {
                label: element.name,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    command: "leetcode.signin",
                    title: "Sign in to LeetCode",
                },
            };
        }
        let contextValue;
        if (element.isProblem) {
            contextValue = element.isFavorite ? "problem-favorite" : "problem";
        }
        else {
            contextValue = element.id.toLowerCase();
        }
        return {
            label: element.isProblem ? `[${element.id}] ${element.name}` + this.parsePremiumUnLockIconPath(element) : element.name,
            tooltip: this.getSubCategoryTooltip(element),
            collapsibleState: element.isProblem ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed,
            iconPath: this.parseIconPathFromProblemState(element),
            command: element.isProblem ? element.previewCommand : undefined,
            resourceUri: element.uri,
            contextValue,
        };
    }
    getChildren(element) {
        if (!leetCodeManager_1.leetCodeManager.getUser()) {
            return [
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: "notSignIn",
                    name: "Sign in to LeetCode",
                }), false),
            ];
        }
        if (!element) {
            // Root view
            return explorerNodeManager_1.explorerNodeManager.getRootNodes();
        }
        else {
            switch (element.id) {
                case shared_1.Category.All:
                    return explorerNodeManager_1.explorerNodeManager.getAllNodes();
                case shared_1.Category.Favorite:
                    return explorerNodeManager_1.explorerNodeManager.getFavoriteNodes();
                case shared_1.Category.Difficulty:
                    return explorerNodeManager_1.explorerNodeManager.getAllDifficultyNodes();
                case shared_1.Category.Tag:
                    return explorerNodeManager_1.explorerNodeManager.getAllTagNodes();
                case shared_1.Category.Company:
                    return explorerNodeManager_1.explorerNodeManager.getAllCompanyNodes();
                default:
                    if (element.isProblem) {
                        return [];
                    }
                    return explorerNodeManager_1.explorerNodeManager.getChildrenNodesById(element.id);
            }
        }
    }
    parseIconPathFromProblemState(element) {
        var _a;
        if (!element.isProblem) {
            return "";
        }
        const { isPremium } = (_a = globalState_1.globalState.getUserStatus()) !== null && _a !== void 0 ? _a : {};
        switch (element.state) {
            case shared_1.ProblemState.AC:
                return this.context.asAbsolutePath(path.join("resources", "check.png"));
            case shared_1.ProblemState.NotAC:
                return this.context.asAbsolutePath(path.join("resources", "x.png"));
            case shared_1.ProblemState.Unknown:
                if (element.locked && !isPremium) {
                    return this.context.asAbsolutePath(path.join("resources", "lock.png"));
                }
                return this.context.asAbsolutePath(path.join("resources", "blank.png"));
            default:
                return "";
        }
    }
    parsePremiumUnLockIconPath(element) {
        var _a;
        const { isPremium } = (_a = globalState_1.globalState.getUserStatus()) !== null && _a !== void 0 ? _a : {};
        if (isPremium && element.locked) {
            return "  🔓";
        }
        return "";
    }
    getSubCategoryTooltip(element) {
        // return '' unless it is a sub-category node
        if (element.isProblem || element.id === "ROOT" || element.id in shared_1.Category) {
            return "";
        }
        const childernNodes = explorerNodeManager_1.explorerNodeManager.getChildrenNodesById(element.id);
        let acceptedNum = 0;
        let failedNum = 0;
        for (const node of childernNodes) {
            switch (node.state) {
                case shared_1.ProblemState.AC:
                    acceptedNum++;
                    break;
                case shared_1.ProblemState.NotAC:
                    failedNum++;
                    break;
                default:
                    break;
            }
        }
        return [`AC: ${acceptedNum}`, `Failed: ${failedNum}`, `Total: ${childernNodes.length}`].join(os.EOL);
    }
}
exports.LeetCodeTreeDataProvider = LeetCodeTreeDataProvider;
exports.leetCodeTreeDataProvider = new LeetCodeTreeDataProvider();
//# sourceMappingURL=LeetCodeTreeDataProvider.js.map