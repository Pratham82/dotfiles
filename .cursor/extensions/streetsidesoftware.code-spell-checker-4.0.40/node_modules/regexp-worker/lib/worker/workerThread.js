"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
exports.createWorker = createWorker;
const worker_threads_1 = require("worker_threads");
const WorkerMessageHandler_1 = require("./WorkerMessageHandler");
const toOutDir_1 = require("../util/toOutDir");
var worker_threads_2 = require("worker_threads");
Object.defineProperty(exports, "Worker", { enumerable: true, get: function () { return worker_threads_2.Worker; } });
let defaultFilename = __filename;
// If this isn't the .js file, then we need to point to the .js file.
// This can happen when running jest with ts-loader.
if (!defaultFilename.match(/\.js$/)) {
    defaultFilename = (0, toOutDir_1.toOutDir)(__filename).replace(/ts$/, 'js');
}
function createWorker(filename = defaultFilename) {
    return new worker_threads_1.Worker(filename);
}
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    const handler = (0, WorkerMessageHandler_1.createHandler)(worker_threads_1.parentPort);
    worker_threads_1.parentPort.once('close', handler.dispose);
}
//# sourceMappingURL=workerThread.js.map