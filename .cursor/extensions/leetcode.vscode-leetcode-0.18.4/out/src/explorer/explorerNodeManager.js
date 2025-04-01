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
exports.explorerNodeManager = void 0;
const _ = require("lodash");
const list = require("../commands/list");
const plugin_1 = require("../commands/plugin");
const shared_1 = require("../shared");
const settingUtils_1 = require("../utils/settingUtils");
const LeetCodeNode_1 = require("./LeetCodeNode");
class ExplorerNodeManager {
    constructor() {
        this.explorerNodeMap = new Map();
        this.companySet = new Set();
        this.tagSet = new Set();
    }
    refreshCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispose();
            const shouldHideSolved = settingUtils_1.shouldHideSolvedProblem();
            for (const problem of yield list.listProblems()) {
                if (shouldHideSolved && problem.state === shared_1.ProblemState.AC) {
                    continue;
                }
                this.explorerNodeMap.set(problem.id, new LeetCodeNode_1.LeetCodeNode(problem));
                for (const company of problem.companies) {
                    this.companySet.add(company);
                }
                for (const tag of problem.tags) {
                    this.tagSet.add(tag);
                }
            }
        });
    }
    getRootNodes() {
        return [
            new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: shared_1.Category.All,
                name: shared_1.Category.All,
            }), false),
            new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: shared_1.Category.Difficulty,
                name: shared_1.Category.Difficulty,
            }), false),
            new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: shared_1.Category.Tag,
                name: shared_1.Category.Tag,
            }), false),
            new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: shared_1.Category.Company,
                name: shared_1.Category.Company,
            }), false),
            new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: shared_1.Category.Favorite,
                name: shared_1.Category.Favorite,
            }), false),
        ];
    }
    getAllNodes() {
        return this.applySortingStrategy(Array.from(this.explorerNodeMap.values()));
    }
    getAllDifficultyNodes() {
        const res = [];
        res.push(new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
            id: `${shared_1.Category.Difficulty}.Easy`,
            name: "Easy",
        }), false), new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
            id: `${shared_1.Category.Difficulty}.Medium`,
            name: "Medium",
        }), false), new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
            id: `${shared_1.Category.Difficulty}.Hard`,
            name: "Hard",
        }), false));
        this.sortSubCategoryNodes(res, shared_1.Category.Difficulty);
        return res;
    }
    getAllCompanyNodes() {
        const res = [];
        for (const company of this.companySet.values()) {
            res.push(new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: `${shared_1.Category.Company}.${company}`,
                name: _.startCase(company),
            }), false));
        }
        this.sortSubCategoryNodes(res, shared_1.Category.Company);
        return res;
    }
    getAllTagNodes() {
        const res = [];
        for (const tag of this.tagSet.values()) {
            res.push(new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: `${shared_1.Category.Tag}.${tag}`,
                name: _.startCase(tag),
            }), false));
        }
        this.sortSubCategoryNodes(res, shared_1.Category.Tag);
        return res;
    }
    getNodeById(id) {
        return this.explorerNodeMap.get(id);
    }
    getFavoriteNodes() {
        const res = [];
        for (const node of this.explorerNodeMap.values()) {
            if (node.isFavorite) {
                res.push(node);
            }
        }
        return this.applySortingStrategy(res);
    }
    getChildrenNodesById(id) {
        // The sub-category node's id is named as {Category.SubName}
        const metaInfo = id.split(".");
        const res = [];
        for (const node of this.explorerNodeMap.values()) {
            switch (metaInfo[0]) {
                case shared_1.Category.Company:
                    if (node.companies.indexOf(metaInfo[1]) >= 0) {
                        res.push(node);
                    }
                    break;
                case shared_1.Category.Difficulty:
                    if (node.difficulty === metaInfo[1]) {
                        res.push(node);
                    }
                    break;
                case shared_1.Category.Tag:
                    if (node.tags.indexOf(metaInfo[1]) >= 0) {
                        res.push(node);
                    }
                    break;
                default:
                    break;
            }
        }
        return this.applySortingStrategy(res);
    }
    dispose() {
        this.explorerNodeMap.clear();
        this.companySet.clear();
        this.tagSet.clear();
    }
    sortSubCategoryNodes(subCategoryNodes, category) {
        switch (category) {
            case shared_1.Category.Difficulty:
                subCategoryNodes.sort((a, b) => {
                    function getValue(input) {
                        switch (input.name.toLowerCase()) {
                            case "easy":
                                return 1;
                            case "medium":
                                return 2;
                            case "hard":
                                return 3;
                            default:
                                return Number.MAX_SAFE_INTEGER;
                        }
                    }
                    return getValue(a) - getValue(b);
                });
                break;
            case shared_1.Category.Tag:
            case shared_1.Category.Company:
                subCategoryNodes.sort((a, b) => {
                    if (a.name === "Unknown") {
                        return 1;
                    }
                    else if (b.name === "Unknown") {
                        return -1;
                    }
                    else {
                        return Number(a.name > b.name) - Number(a.name < b.name);
                    }
                });
                break;
            default:
                break;
        }
    }
    applySortingStrategy(nodes) {
        const strategy = plugin_1.getSortingStrategy();
        switch (strategy) {
            case shared_1.SortingStrategy.AcceptanceRateAsc: return nodes.sort((x, y) => Number(x.acceptanceRate) - Number(y.acceptanceRate));
            case shared_1.SortingStrategy.AcceptanceRateDesc: return nodes.sort((x, y) => Number(y.acceptanceRate) - Number(x.acceptanceRate));
            default: return nodes;
        }
    }
}
exports.explorerNodeManager = new ExplorerNodeManager();
//# sourceMappingURL=explorerNodeManager.js.map