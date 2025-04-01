"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandlerFactory = void 0;
const tslib_1 = require("tslib");
const resolve_extends_1 = require("./common/resolve-extends");
const eslint = tslib_1.__importStar(require("eslint"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const vscode = tslib_1.__importStar(require("vscode"));
const debouncer = {};
const extensionCache = {};
const ruleCache = {};
function messageHandlerFactory(currentPanel, fileCache) {
    const fileSaverFactory = (fileName, source) => {
        return () => {
            fileCache[fileName] = source;
            fs.writeFileSync(fileName, source);
        };
    };
    const extensionsGenerator = (fileName, extensions) => {
        extensions.forEach((extensionName) => {
            let config = extensionCache[extensionName];
            if (!config) {
                try {
                    config = resolve_extends_1.resolveExtension(extensionName, fileName);
                    extensionCache[extensionName] = config;
                }
                catch (error) {
                    // TODO: telemetry on error
                    // BUT ... we may just be loading a partially typed name
                    console.log(error.message);
                }
            }
            if (config && Object.keys(config).length)
                currentPanel.webview.postMessage({
                    command: 'extensions',
                    extensions: { [extensionName]: config }
                });
        });
    };
    const rulesGenerator = (fileName, plugins) => {
        plugins.forEach((pluginName) => {
            let rules = ruleCache[pluginName];
            if (!rules) {
                try {
                    const cli = new eslint.CLIEngine({
                        baseConfig: { plugins: [pluginName] },
                        // NOTE: we're going to use the node_modules of the
                        // workspace itself, not of the extension!!
                        cwd: path.dirname(fileName),
                        useEslintrc: false
                    });
                    // NOTE: we already have all the ESLint rules,
                    // which the CLI as coded above always returns
                    rules = {};
                    cli.getRules().forEach((value, key) => {
                        if (key.includes('/'))
                            rules[key] = value;
                    });
                    ruleCache[pluginName] = rules;
                }
                catch (error) {
                    // TODO: telemetry on error
                    // BUT ... we may just be loading a partially typed name
                    console.log(error.message);
                }
            }
            if (rules && Object.keys(rules).length)
                currentPanel.webview.postMessage({
                    command: 'rules',
                    rules: { [pluginName]: rules }
                });
        });
    };
    return (message) => {
        var _a;
        const debounceTimeout = (_a = vscode.workspace
            .getConfiguration('lintel')) === null || _a === void 0 ? void 0 : _a.get('updateDebounceTime', 2500);
        const fileSaver = fileSaverFactory(message.fileName, message.source);
        switch (message.command) {
            case 'bootFail':
                vscode.window.showErrorMessage('Lintel could not start. Please try again.');
                break;
            case 'clipboardCopy':
                vscode.env.clipboard.writeText(message.text);
                break;
            case 'deleteOverride':
                vscode.window
                    .showWarningMessage(message.text, { modal: true }, 'OK')
                    .then((response) => {
                    if (response === 'OK')
                        currentPanel.webview.postMessage({
                            command: 'deleteOverride',
                            override: message.override
                        });
                });
                break;
            case 'editFile':
                vscode.window.showTextDocument(vscode.Uri.file(message.fileName), {
                    viewColumn: vscode.ViewColumn.Beside
                });
                break;
            case 'getExtensions':
                extensionsGenerator(message.fileName, message.extensions);
                break;
            case 'getRules':
                rulesGenerator(message.fileName, message.plugins);
                break;
            case 'openFile':
                vscode.env.openExternal(vscode.Uri.parse(message.url));
                break;
            case 'parseFail':
                vscode.window.showErrorMessage(`Lintel could not parse ${message.fileName}`);
                break;
            case 'saveFile':
                // NOTE: we deliberately isolate the debounce logic right here
                // because for testing we don't want it anywhere in the client app
                clearTimeout(debouncer[message.fileName]);
                if (debounceTimeout)
                    debouncer[message.fileName] = setTimeout(fileSaver, debounceTimeout);
                else
                    fileSaver();
                break;
        }
    };
}
exports.messageHandlerFactory = messageHandlerFactory;
//# sourceMappingURL=message-handler.js.map