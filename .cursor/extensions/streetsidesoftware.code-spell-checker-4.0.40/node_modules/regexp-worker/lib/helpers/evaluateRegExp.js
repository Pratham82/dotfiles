"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execRegExp = execRegExp;
exports.execRegExpMatrix = execRegExpMatrix;
exports.execRegExpArray = execRegExpArray;
exports.execRegExpOnTextArray = execRegExpOnTextArray;
exports.toRegExp = toRegExp;
exports.isRegExp = isRegExp;
exports.matchRegExp = matchRegExp;
exports.matchRegExpArray = matchRegExpArray;
exports.flatRangesToRanges = flatRangesToRanges;
const timer_1 = require("../timer");
function execRegExp(regExp, text) {
    const { elapsedTimeMs, r: matches } = (0, timer_1.measureExecution)(() => _execRegExp(regExp, text));
    return { elapsedTimeMs, matches };
}
function execRegExpMatrix(regExpArray, textArray) {
    const { elapsedTimeMs, r: matrix } = (0, timer_1.measureExecution)(() => {
        return regExpArray.map((r) => execRegExpOnTextArray(r, textArray));
    });
    return {
        elapsedTimeMs,
        matrix,
    };
}
function execRegExpArray(regExpArray, text) {
    const { elapsedTimeMs, r: results } = (0, timer_1.measureExecution)(() => {
        return regExpArray.map((r) => execRegExp(r, text));
    });
    return {
        elapsedTimeMs,
        results,
    };
}
function execRegExpOnTextArray(regExp, texts) {
    const { elapsedTimeMs, r: results } = (0, timer_1.measureExecution)(() => {
        return texts.map((t) => execRegExp(regExp, t));
    });
    return {
        regExp,
        elapsedTimeMs,
        results,
    };
}
function toRegExp(r, defaultFlags) {
    if (isRegExp(r))
        return r;
    const match = r.match(/^\/(.*)\/([gimsuy]*)$/);
    if (match) {
        return new RegExp(match[1], match[2] || defaultFlags);
    }
    return new RegExp(r, defaultFlags);
}
function isRegExp(r) {
    return r instanceof RegExp;
}
function _execRegExp(regExp, text) {
    const re = new RegExp(regExp);
    const results = [];
    let lastPos = -1;
    let match;
    let retry = true;
    while ((match = re.exec(text))) {
        if (match.index === lastPos) {
            if (!re.global && retry) {
                break;
            }
            re.lastIndex = re.lastIndex + 1;
            retry = false;
            continue;
        }
        retry = true;
        lastPos = match.index;
        results.push(match);
    }
    return results;
}
function mapExecRegExpResultToMatchRegExpResult(r) {
    const ranges = new Uint32Array(r.matches.length * 2);
    let i = 0;
    for (const m of r.matches) {
        ranges[i++] = m.index;
        ranges[i++] = m.index + m[0].length;
    }
    return {
        elapsedTimeMs: r.elapsedTimeMs,
        ranges,
    };
}
function matchRegExp(text, regExp) {
    return mapExecRegExpResultToMatchRegExpResult(execRegExp(regExp, text));
}
function matchRegExpArray(text, regExp) {
    const { elapsedTimeMs, r: results } = (0, timer_1.measureExecution)(() => {
        return regExp.map((r) => matchRegExp(text, r));
    });
    return {
        elapsedTimeMs,
        results,
    };
}
function* flatRangesToRanges(flatRanges) {
    for (let i = 0; i < flatRanges.length - 1; i += 2) {
        yield [flatRanges[i], flatRanges[i + 1]];
    }
}
//# sourceMappingURL=evaluateRegExp.js.map