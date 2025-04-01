"use strict";
/** Meld 'extends' into a base according to ESLint rules */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConfiguration = exports.meldConfigurationsRules = exports.meldConfigurationsPlugins = exports.meldConfigurationsOverrides = exports.meldConfigurations = void 0;
const tslib_1 = require("tslib");
const rfdc_1 = tslib_1.__importDefault(require("rfdc"));
const deepCopy = rfdc_1.default();
function meldConfigurations(config, ext) {
    const extension = deepCopy(ext);
    Object.keys(extension)
        .filter((key) => key !== 'extends')
        // NOTE: we don't try to meld 'files' as these are the keys to overrides
        .filter((key) => key !== 'files')
        .forEach((key) => {
        var _a;
        if (key === 'overrides')
            meldConfigurationsOverrides(config, extension);
        else if (key === 'plugins')
            meldConfigurationsPlugins(config, extension);
        else if (key === 'rules')
            meldConfigurationsRules(config, extension);
        else if (Array.isArray(extension[key]))
            config[key] = Array.from(new Set([...((_a = config[key]) !== null && _a !== void 0 ? _a : []), ...extension[key]]));
        else if (typeof extension[key] === 'object')
            config[key] = Object.assign(config[key] || {}, extension[key]);
        else if (extension[key] != null)
            config[key] = extension[key];
    });
    return config;
}
exports.meldConfigurations = meldConfigurations;
// NOTE: works for overrides.files, but not generally
function arraysEqual(p, q) {
    return p.slice(0).sort().toString() === q.slice(0).sort().toString();
}
// TODO: what about overrides of overrides ???
function meldConfigurationsOverrides(config, extension) {
    if (!config['overrides'])
        config['overrides'] = [...extension.overrides];
    else {
        extension.overrides.forEach((extOverride) => {
            const cfgOverride = config.overrides.find((override) => arraysEqual(override.files, extOverride.files));
            if (cfgOverride)
                meldConfigurations(cfgOverride, extOverride);
            else
                config.overrides.push(deepCopy(extOverride));
        });
    }
}
exports.meldConfigurationsOverrides = meldConfigurationsOverrides;
// NOTE: plugins need to be deduplicated
function meldConfigurationsPlugins(config, extension) {
    var _a;
    config['plugins'] = Array.from(new Set([...((_a = config.plugins) !== null && _a !== void 0 ? _a : []), ...extension.plugins]));
}
exports.meldConfigurationsPlugins = meldConfigurationsPlugins;
// NOTE: rules can override only the level, leaving other settings intact
// @see https://eslint.org/docs/user-guide/configuring
function meldConfigurationsRules(config, extension) {
    var _a;
    (_a = config['rules']) !== null && _a !== void 0 ? _a : (config['rules'] = {});
    Object.entries(extension.rules)
        .map(([ruleName, rule]) => [ruleName, Array.isArray(rule) ? rule : [rule]])
        .forEach(([ruleName, extRule]) => {
        // normalize rules into arrays
        if (!Array.isArray(extRule))
            extRule = [extRule];
        if (!config.rules[ruleName] || extRule.length > 1)
            config.rules[ruleName] = extRule;
        else {
            let cfgRule = config.rules[ruleName];
            if (!Array.isArray(cfgRule))
                cfgRule = [cfgRule];
            config.rules[ruleName] = [extRule[0], ...cfgRule.slice(1)];
        }
    });
}
exports.meldConfigurationsRules = meldConfigurationsRules;
function normalizeConfiguration(config) {
    var _a;
    // very convenient to ensure that rules exist in std format
    config.rules = Object.entries((_a = config.rules) !== null && _a !== void 0 ? _a : {}).reduce((acc, [ruleName, rule]) => {
        let normalized = rule;
        if (typeof rule === 'string' || Number.isInteger(rule))
            normalized = [rule];
        if (Number.isInteger(normalized[0]))
            normalized[0] = ['off', 'warn', 'error'][normalized[0]];
        acc[ruleName] = normalized;
        return acc;
    }, {});
    // also very convenient to normalize array properties
    if (typeof config.extends === 'string')
        config.extends = [config.extends];
    if (typeof config.ignorePatterns === 'string')
        config.ignorePatterns = [config.ignorePatterns];
    if (typeof config.plugins === 'string')
        config.plugins = [config.plugins];
    // also very convenient to normalize global values
    if (config.globals) {
        config.globals = Object.keys(config.globals).reduce((acc, key) => {
            if (config.globals[key] === true || config.globals[key] === 'writeable')
                acc[key] = 'writable';
            else if (config.globals[key] === false ||
                config.globals[key] === 'readable')
                acc[key] = 'readonly';
            else
                acc[key] = config.globals[key];
            return acc;
        }, {});
    }
    // now recursively normalize overrides
    if (config.overrides)
        config.overrides = config.overrides.map((override) => normalizeConfiguration(override));
    return config;
}
exports.normalizeConfiguration = normalizeConfiguration;
//# sourceMappingURL=meld-configurations.js.map