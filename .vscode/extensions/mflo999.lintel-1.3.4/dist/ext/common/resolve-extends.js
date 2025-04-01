"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExtension = exports.requireExtension = exports.normalizeExtensionName = void 0;
const tslib_1 = require("tslib");
const meld_configurations_1 = require("./meld-configurations");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const moduleLoader = require('module');
const parser = require('js-yaml');
function normalizeExtensionName(extensionName) {
    if (extensionName.startsWith('/') ||
        extensionName.startsWith('.') ||
        extensionName.startsWith('eslint:'))
        return { moduleName: extensionName };
    else if (extensionName.startsWith('plugin:')) {
        const parts = extensionName.substring(7).split('/');
        let moduleName;
        if (parts[0].startsWith('@')) {
            moduleName = `${parts[0]}/eslint-plugin`;
            if (parts.length > 2)
                moduleName += `-${parts.slice(1, parts.length - 1).join('-')}`;
        }
        else
            moduleName = `eslint-plugin-${parts[0]}`;
        const configName = parts[parts.length - 1];
        return { configName, moduleName };
    }
    else {
        let moduleName;
        if (extensionName.startsWith('@')) {
            if (!extensionName.includes('/eslint-config'))
                moduleName = `${extensionName}/eslint-config`;
            else
                moduleName = extensionName;
        }
        else if (!extensionName.startsWith('eslint-config-'))
            moduleName = `eslint-config-${extensionName}`;
        else
            moduleName = extensionName;
        return { moduleName };
    }
}
exports.normalizeExtensionName = normalizeExtensionName;
function requireExtension(extensionName, modulePath) {
    let extension;
    // TODO: eslint:all gives:
    // Uncaught TypeError: Cannot read property 'deprecated' of undefined
    // if (extensionName === 'eslint:all')
    //   extension = require('eslint/conf/eslint-all');
    if (extensionName === 'eslint:recommended')
        extension = require('eslint/conf/eslint-recommended');
    else if (extensionName.startsWith('/'))
        extension = requireExtensionFromFile(extensionName);
    else if (extensionName.startsWith('.'))
        extension = requireExtensionFromFile(path.join(path.dirname(modulePath), extensionName));
    else {
        const { configName, moduleName } = normalizeExtensionName(extensionName);
        modulePath = moduleLoader.createRequire(modulePath).resolve(moduleName);
        // NOTE: only plugins have a config name
        extension = configName
            ? require(modulePath).configs[configName]
            : require(modulePath);
    }
    return { extension, modulePath };
}
exports.requireExtension = requireExtension;
function requireExtensionFromFile(filePath) {
    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml'))
        return parser.load(fs.readFileSync(filePath), { encoding: 'utf8' });
    else
        return require(filePath);
}
function resolveExtension(extensionName, modulePath) {
    const outer = requireExtension(extensionName, modulePath);
    const resolver = ({ extension, modulePath }) => {
        if (extension === null || extension === void 0 ? void 0 : extension.extends) {
            if (!Array.isArray(extension.extends))
                extension.extends = [extension.extends];
            extension.extends.forEach((extensionName) => {
                var _a;
                const inner = requireExtension(extensionName, modulePath);
                if ((_a = inner.extension) === null || _a === void 0 ? void 0 : _a.extends)
                    resolver(inner);
                meld_configurations_1.meldConfigurations(outer.extension, inner.extension);
            });
        }
    };
    resolver(outer);
    delete outer.extension.extends;
    return outer.extension;
}
exports.resolveExtension = resolveExtension;
//# sourceMappingURL=resolve-extends.js.map