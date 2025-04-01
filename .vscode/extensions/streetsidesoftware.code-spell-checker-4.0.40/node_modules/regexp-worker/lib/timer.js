"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureExecution = measureExecution;
exports.elapsedTimeMsFrom = elapsedTimeMsFrom;
exports.hrTimeToMs = hrTimeToMs;
exports.measurePromise = measurePromise;
function measureExecution(fn) {
    const start = process.hrtime();
    const r = fn();
    const elapsedTimeMs = hrTimeToMs(process.hrtime(start));
    return {
        elapsedTimeMs,
        r,
    };
}
function elapsedTimeMsFrom(relativeTo) {
    return hrTimeToMs(process.hrtime(relativeTo));
}
function hrTimeToMs(hrTime) {
    return hrTime[0] * 1.0e3 + hrTime[1] * 1.0e-6;
}
async function measurePromise(fn) {
    const start = process.hrtime();
    const r = await fn();
    const elapsedTimeMs = hrTimeToMs(process.hrtime(start));
    return {
        elapsedTimeMs,
        r,
    };
}
//# sourceMappingURL=timer.js.map