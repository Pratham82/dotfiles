"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEventEmitter = void 0;
const EventEmitter = require('events');
exports.userEventEmitter = new EventEmitter();
const endOfDay_1 = require("../notifications/endOfDay");
exports.userEventEmitter.on('user_object_updated', () => {
    (0, endOfDay_1.setEndOfDayNotification)();
});
//# sourceMappingURL=userEventEmitter.js.map