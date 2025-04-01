"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = exports.Events = void 0;
const events_1 = require("events");
const lw_1 = require("../lw");
const logger = lw_1.lw.log('Event');
var Events;
(function (Events) {
    Events["BuildDone"] = "BUILD_DONE";
    Events["AutoBuildInitiated"] = "AUTO_BUILD_INITIATED";
    Events["RootFileChanged"] = "ROOT_FILE_CHANGED";
    Events["RootFileSearched"] = "ROOT_FILE_SEARCHED";
    Events["FileParsed"] = "FILE_PARSED";
    Events["ViewerPageLoaded"] = "VIEWER_PAGE_LOADED";
    Events["ViewerStatusChanged"] = "VIEWER_STATUS_CHANGED";
    Events["FileWatched"] = "FILE_WATCHED";
    Events["FileChanged"] = "FILE_CHANGED";
    Events["FileRemoved"] = "FILE_REMOVED";
    Events["DocumentChanged"] = "DOCUMENT_CHANGED";
    Events["StructureUpdated"] = "STRUCTURE_UPDATED";
    Events["AutoCleaned"] = "AUTO_CLEANED";
})(Events || (exports.Events = Events = {}));
exports.event = {
    ...Events,
    on,
    fire,
    dispose
};
const eventEmitter = new events_1.EventEmitter();
function dispose() {
    eventEmitter.removeAllListeners();
}
function fire(eventName, arg) {
    if (![Events.DocumentChanged, Events.ViewerStatusChanged].includes(eventName)) {
        logger.log(eventName + (arg ? `: ${JSON.stringify(arg)}` : ''));
    }
    eventEmitter.emit(eventName, arg);
}
function on(eventName, cb) {
    eventEmitter.on(eventName, cb);
    const disposable = {
        dispose: () => { eventEmitter.removeListener(eventName, cb); }
    };
    return disposable;
}
//# sourceMappingURL=event.js.map