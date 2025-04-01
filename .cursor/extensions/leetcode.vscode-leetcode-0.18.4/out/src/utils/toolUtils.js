"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = exports.sleep = void 0;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function parseQuery(query) {
    const queryObject = {};
    if (!query) {
        return queryObject;
    }
    const keyValuePairs = query.split("&");
    keyValuePairs.forEach((pair) => {
        const firstEqualsIndex = pair.indexOf("=");
        if (firstEqualsIndex !== -1) {
            const key = pair.substring(0, firstEqualsIndex);
            const value = pair.substring(firstEqualsIndex + 1);
            queryObject[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        else {
            // If no equals sign is found, treat the whole string as key with empty value
            queryObject[decodeURIComponent(pair)] = "";
        }
    });
    return queryObject;
}
exports.parseQuery = parseQuery;
//# sourceMappingURL=toolUtils.js.map