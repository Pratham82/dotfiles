'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const package_nls_json_1 = __importDefault(require("../package.nls.json"));
const package_nls_ja_json_1 = __importDefault(require("../package.nls.ja.json"));
const localeTableKey = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale;
const localeTable = Object.assign(package_nls_json_1.default, ({
    ja: package_nls_ja_json_1.default
}[localeTableKey] || {}));
const localeString = (key) => localeTable[key] || key;
var ZoomBar;
(function (ZoomBar) {
    const applicationKey = "zoombar-vscode";
    let previousUiDisplayOrder = "";
    let zoomLabel;
    let zoomOutLabel;
    let zoomInLabel;
    let fontZoomResetLabel;
    const cent = 100.0;
    const systemZoomUnit = 20.0;
    const systemZoomUnitRate = (systemZoomUnit + cent) / cent;
    const zoomLog = Math.log(systemZoomUnitRate);
    const distinctFilter = (value, index, self) => index === self.indexOf(value);
    function getConfiguration(key, section = "zoombar") {
        const rawKey = undefined === key ? undefined : key.split(".").reverse()[0];
        const rawSection = undefined === key || rawKey === key ? section : `${section}.${key.replace(/(.*)\.[^\.]+/, "$1")}`;
        const configuration = vscode.workspace.getConfiguration(rawSection);
        return rawKey ?
            configuration[rawKey] :
            configuration;
    }
    const getZoomLevel = () => getConfiguration("zoomLevel", "window") || 0.0;
    const setZoomLevel = (zoomLevel) => getConfiguration(undefined, "window").update("zoomLevel", zoomLevel, true);
    const getDefaultZoom = () => getConfiguration("defaultZoom");
    const getZoomUnit = () => getConfiguration("zoomUnit");
    const getZoomUnitLevel = () => ZoomBar.percentToLevel(cent + getZoomUnit());
    const getZoomPreset = () => getConfiguration("zoomPreset")
        .filter(distinctFilter)
        .sort((a, b) => b - a);
    const getZoomInLabelText = () => getConfiguration("zoomInLabel");
    const getZoomOutLabelText = () => getConfiguration("zoomOutLabel");
    const getFontZoomResetLabelText = () => getConfiguration("fontZoomResetLabel");
    function createStatusBarItem(properties) {
        const result = vscode.window.createStatusBarItem(properties.alignment);
        if (undefined !== properties.text) {
            result.text = properties.text;
        }
        if (undefined !== properties.command) {
            result.command = properties.command;
        }
        if (undefined !== properties.tooltip) {
            result.tooltip = properties.tooltip;
        }
        return result;
    }
    function initialize(context) {
        context.subscriptions.push(
        //  コマンドの登録
        vscode.commands.registerCommand(`${applicationKey}.selectZoom`, selectZoom), vscode.commands.registerCommand(`${applicationKey}.resetZoom`, ZoomBar.resetZoom), vscode.commands.registerCommand(`${applicationKey}.zoomIn`, ZoomBar.zoomIn), vscode.commands.registerCommand(`${applicationKey}.zoomOut`, ZoomBar.zoomOut), 
        //  ステータスバーアイテムの登録
        zoomLabel = createStatusBarItem({
            alignment: vscode.StatusBarAlignment.Right,
            text: "zoom",
            command: `${applicationKey}.selectZoom`,
            tooltip: localeString("zoombar-vscode.selectZoom.title")
        }), zoomInLabel = createStatusBarItem({
            alignment: vscode.StatusBarAlignment.Right,
            text: getZoomInLabelText(),
            command: `${applicationKey}.zoomIn`,
            tooltip: localeString("zoombar-vscode.zoomIn.title")
        }), zoomOutLabel = createStatusBarItem({
            alignment: vscode.StatusBarAlignment.Right,
            text: getZoomOutLabelText(),
            command: `${applicationKey}.zoomOut`,
            tooltip: localeString("zoombar-vscode.zoomout.title")
        }), fontZoomResetLabel = createStatusBarItem({
            alignment: vscode.StatusBarAlignment.Right,
            text: getFontZoomResetLabelText(),
            command: `editor.action.fontZoomReset`,
            tooltip: localeString("zoombar-vscode.fontZoomReset.title")
        }), 
        //  イベントリスナーの登録
        vscode.workspace.onDidChangeConfiguration(() => updateStatusBar()));
        updateStatusBar();
    }
    ZoomBar.initialize = initialize;
    function selectZoom() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentZoom = ZoomBar.roundZoom(ZoomBar.levelToPercent(getZoomLevel()));
            const select = yield vscode.window.showQuickPick([
                {
                    label: `$(home) ${localeString("zoombar-vscode.selectZoom.resetZoom")} ( ${ZoomBar.percentToDisplayString(getDefaultZoom())} )`,
                    description: "",
                    value: getDefaultZoom().toString(),
                },
                {
                    label: `${getFontZoomResetLabelText()} ${localeString("zoombar-vscode.fontZoomReset.title")}`,
                    description: "",
                    value: "@",
                },
                {
                    label: `$(pencil) ${localeString("zoombar-vscode.selectZoom.inputZoom")}`,
                    description: "",
                    value: "*",
                }
            ]
                .concat(getZoomPreset().map(i => ({
                label: `$(text-size) ${ZoomBar.percentToDisplayString(i)}`,
                description: currentZoom === ZoomBar.roundZoom(i) ? localeString("zoombar-vscode.selectZoom.current") : "",
                value: i.toString()
            }))), {
                placeHolder: localeString("zoombar-vscode.selectZoom.placeHolder"),
            });
            if (select) {
                if ("*" === select.value) {
                    const zoom = yield vscode.window.showInputBox({
                        prompt: localeString("zoombar-vscode.inputZoom.placeHolder"),
                        value: currentZoom.toString(),
                    });
                    if (undefined !== zoom) {
                        yield setZoomLevel(ZoomBar.percentToLevel(parseFloat(zoom)));
                    }
                }
                else if ("@" === select.value) {
                    yield vscode.commands.executeCommand(`editor.action.fontZoomReset`);
                }
                else {
                    yield setZoomLevel(ZoomBar.percentToLevel(parseFloat(select.value)));
                }
            }
        });
    }
    ZoomBar.selectZoom = selectZoom;
    ZoomBar.resetZoom = () => setZoomLevel(ZoomBar.percentToLevel(getDefaultZoom()));
    ZoomBar.zoomOut = () => setZoomLevel(getZoomLevel() - getZoomUnitLevel());
    ZoomBar.zoomIn = () => setZoomLevel(getZoomLevel() + getZoomUnitLevel());
    function updateStatusBar() {
        const uiDisplayOrder = getConfiguration("uiDisplayOrder");
        if (previousUiDisplayOrder !== uiDisplayOrder) {
            zoomLabel.hide();
            zoomInLabel.hide();
            zoomOutLabel.hide();
            fontZoomResetLabel.hide();
            previousUiDisplayOrder = uiDisplayOrder;
        }
        uiDisplayOrder
            .split("")
            .filter(distinctFilter)
            .reverse()
            .forEach(i => {
            switch (i) {
                case "%":
                    zoomLabel.text = ZoomBar.percentToDisplayString(ZoomBar.levelToPercent(getZoomLevel()));
                    zoomLabel.show();
                    break;
                case "+":
                    zoomInLabel.text = getZoomInLabelText();
                    zoomInLabel.show();
                    break;
                case "-":
                    zoomOutLabel.text = getZoomOutLabelText();
                    zoomOutLabel.show();
                    break;
                case "@":
                    fontZoomResetLabel.text = getFontZoomResetLabelText();
                    fontZoomResetLabel.show();
                    break;
            }
        });
    }
    ZoomBar.updateStatusBar = updateStatusBar;
    ZoomBar.levelToPercent = (value) => Math.pow(systemZoomUnitRate, value) * cent;
    ZoomBar.percentToLevel = (value) => Math.log(value / cent) / zoomLog;
    ZoomBar.roundZoom = (value) => Math.round(value * cent) / cent;
    ZoomBar.percentToDisplayString = (value, locales) => `${ZoomBar.roundZoom(value / cent).toLocaleString(locales, { style: "percent" })}`;
})(ZoomBar = exports.ZoomBar || (exports.ZoomBar = {}));
function activate(context) {
    ZoomBar.initialize(context);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map