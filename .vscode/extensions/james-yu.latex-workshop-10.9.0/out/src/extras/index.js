"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extra = void 0;
const commands = __importStar(require("./activity-bar"));
const checkcites_1 = require("./checkcites");
const cleaner_1 = require("./cleaner");
const counter_1 = require("./counter");
const section_1 = require("./section");
const snippet = __importStar(require("./snippet-view"));
const texdoc_1 = require("./texdoc");
const texroot_1 = require("./texroot");
const liveshare = __importStar(require("./liveshare"));
exports.extra = {
    checkCitations: checkcites_1.checkCitations,
    clean: cleaner_1.clean,
    count: counter_1.count,
    texdoc: texdoc_1.texdoc,
    texroot: texroot_1.texroot,
    section: section_1.section,
    commands,
    snippet,
    liveshare
};
//# sourceMappingURL=index.js.map