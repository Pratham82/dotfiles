"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
class Cache {
    constructor(loader) {
        this.loader = loader;
        this.cache = {};
        this.get = (key) => this.getCore(key, JSON.stringify(key));
        this.getCore = (key, keyJson) => undefined === this.cache[keyJson] ?
            (this.cache[keyJson] = this.loader(key)) :
            this.cache[keyJson];
        this.getCache = (key) => this.cache[JSON.stringify(key)];
        this.clear = () => this.cache = {};
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map