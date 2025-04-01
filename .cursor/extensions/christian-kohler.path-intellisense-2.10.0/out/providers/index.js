"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const default_provider_1 = require("./default.provider");
const javascript_provider_1 = require("./javascript/javascript.provider");
const nixos_provider_1 = require("./nixos/nixos.provider");
exports.providers = [
    javascript_provider_1.JavaScriptProvider,
    nixos_provider_1.NixProvider,
    default_provider_1.DefaultProvider,
];
//# sourceMappingURL=index.js.map