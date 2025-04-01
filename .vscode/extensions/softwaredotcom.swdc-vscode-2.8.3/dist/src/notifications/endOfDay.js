"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showEndOfDayNotification = exports.setEndOfDayNotification = void 0;
const vscode_1 = require("vscode");
const WebViewManager_1 = require("../managers/WebViewManager");
const ConfigManager_1 = require("../managers/ConfigManager");
const TrackerManager_1 = require("../managers/TrackerManager");
const date_fns_1 = require("date-fns");
const KpmItems_1 = require("../events/KpmItems");
const DataController_1 = require("../DataController");
const MIN_IN_MILLIS = 60 * 1000;
const HOUR_IN_MILLIS = 60 * 60 * 1000;
const DEFAULT_WORK_HOURS = {
    mon: { ranges: [{ start: "09:00", end: "17:00" }], active: true },
    tue: { ranges: [{ start: "09:00", end: "17:00" }], active: true },
    wed: { ranges: [{ start: "09:00", end: "17:00" }], active: true },
    thu: { ranges: [{ start: "09:00", end: "17:00" }], active: true },
    fri: { ranges: [{ start: "09:00", end: "17:00" }], active: true },
    sat: { ranges: [{ start: "09:00", end: "17:00" }], active: false },
    sun: { ranges: [{ start: "09:00", end: "17:00" }], active: false }
};
let timer = undefined;
const setEndOfDayNotification = async () => {
    // clear any existing timer
    if (timer) {
        clearTimeout(timer);
    }
    const cachedUser = await (0, DataController_1.getCachedUser)();
    if (!cachedUser) {
        return;
    }
    const workHours = cachedUser?.profile?.work_hours ? JSON.parse(cachedUser.profile.work_hours) : DEFAULT_WORK_HOURS;
    // If the end of day notification setting is turned on (if undefined or null, will default to true)
    if (cachedUser?.preferences_parsed?.notifications?.endOfDayNotification) {
        const d = new Date();
        const day = (0, date_fns_1.format)(d, 'EEE').toLowerCase();
        let msUntilEndOfTheDay = 0;
        // [[118800,147600],[205200,234000],[291600,320400],[378000,406800],[464400,493200]]
        // default of 5pm if the response or work_hours format doesn't have the {dow:...}
        if (day !== 'sun' && day !== 'sat') {
            msUntilEndOfTheDay = getMillisUntilEndOfTheDay(d, HOUR_IN_MILLIS * 17);
        }
        // get the day of the week that matches today
        const work_hours_today = workHours[day] || undefined;
        if (work_hours_today?.active) {
            // it's active, get the largest end range
            const endTimes = work_hours_today.ranges.map((n) => {
                // convert end to total seconds in a day
                return getEndTimeSeconds(n.end);
            });
            // sort milliseconds in descending order
            endTimes.sort(function (a, b) {
                return b - a;
            });
            msUntilEndOfTheDay = getMillisUntilEndOfTheDay(d, endTimes[0]);
        }
        if (msUntilEndOfTheDay > 0) {
            // set the timer to fire in "n" milliseconds
            timer = setTimeout(exports.showEndOfDayNotification, msUntilEndOfTheDay);
        }
    }
};
exports.setEndOfDayNotification = setEndOfDayNotification;
const showEndOfDayNotification = async () => {
    const tracker = TrackerManager_1.TrackerManager.getInstance();
    if (!(0, DataController_1.isRegistered)()) {
        const selection = await vscode_1.window.showInformationMessage("It's the end of the day. Sign up to see your stats.", ...['Sign up']);
        if (selection === 'Sign up') {
            vscode_1.commands.executeCommand('codetime.registerAccount');
        }
    }
    else {
        const selection = await vscode_1.window.showInformationMessage("It's the end of your work day! Would you like to see your code time stats for today?", ...['Settings', 'Show me the data']);
        if (selection === 'Show me the data') {
            tracker.trackUIInteraction((0, KpmItems_1.showMeTheDataKpmItem)());
            (0, WebViewManager_1.showDashboard)();
        }
        else if (selection === 'Settings') {
            tracker.trackUIInteraction((0, KpmItems_1.configureSettingsKpmItem)());
            (0, ConfigManager_1.configureSettings)();
        }
    }
};
exports.showEndOfDayNotification = showEndOfDayNotification;
function getEndTimeSeconds(end) {
    const hourMin = end.split(':');
    return parseInt(hourMin[0], 10) * HOUR_IN_MILLIS + parseInt(hourMin[1], 10) * MIN_IN_MILLIS;
}
function getMillisUntilEndOfTheDay(date, endMillis) {
    var startD = (0, date_fns_1.startOfDay)(date);
    var millisDiff = (0, date_fns_1.differenceInMilliseconds)(date, startD);
    return endMillis - millisDiff;
}
//# sourceMappingURL=endOfDay.js.map