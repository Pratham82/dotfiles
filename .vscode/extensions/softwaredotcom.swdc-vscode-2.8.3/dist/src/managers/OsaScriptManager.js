"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDock = exports.toggleDockPosition = exports.toggleDarkMode = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const cp = require("child_process");
async function toggleDarkMode() {
    (0, Util_1.setItem)("checked_sys_events", true);
    const darkModeCmd = `osascript -e \'
        tell application "System Events"
          tell appearance preferences
            set dark mode to not dark mode
          end tell
        end tell \'`;
    await cp.exec(darkModeCmd);
    vscode_1.commands.executeCommand("codetime.refreshCodeTimeView");
}
exports.toggleDarkMode = toggleDarkMode;
// change the position of the dock depending on user input
async function toggleDockPosition() {
    (0, Util_1.setItem)("checked_sys_events", true);
    let newPosition = await vscode_1.window.showInputBox({ placeHolder: "left, right, or bottom?" });
    function setPosition(position) {
        return `osascript -e \'
      tell application "System Events"
        tell dock preferences
          set properties to {screen edge:${position}}
        end tell
      end tell \'`;
    }
    if (newPosition) {
        cp.exec(setPosition(newPosition));
    }
}
exports.toggleDockPosition = toggleDockPosition;
// hide and unhide the dock
async function toggleDock() {
    (0, Util_1.setItem)("checked_sys_events", true);
    let toggleDockCmd = `osascript -e \'
    tell application "System Events"
      tell dock preferences
        set x to autohide
        if x is false then
          set properties to {autohide:true}
        else
          set properties to {autohide:false}
        end if
      end tell
    end tell \'`;
    cp.exec(toggleDockCmd);
}
exports.toggleDock = toggleDock;
async function execPromise(command, opts = {}) {
    return new Promise((resolve, reject) => {
        cp.exec(command, opts, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
//# sourceMappingURL=OsaScriptManager.js.map