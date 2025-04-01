"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseFromEvent = void 0;
const vscode_1 = require("vscode");
const passthrough = (value, resolve) => resolve(value);
/**
 * Return a promise that resolves with the next emitted event, or with some future
 * event as decided by an adapter.
 *
 * If specified, the adapter is a function that will be called with
 * `(event, resolve, reject)`. It will be called once per event until it resolves or
 * rejects.
 *
 * The default adapter is the passthrough function `(value, resolve) => resolve(value)`.
 *
 * @param event the event
 * @param adapter controls resolution of the returned promise
 * @returns a promise that resolves or rejects as specified by the adapter
 */
function promiseFromEvent(event, adapter = passthrough) {
    let subscription;
    let cancel = new vscode_1.EventEmitter();
    return {
        promise: new Promise((resolve, reject) => {
            cancel.event(_ => reject('Cancelled'));
            subscription = event((value) => {
                try {
                    Promise.resolve(adapter(value, resolve, reject))
                        .catch(reject);
                }
                catch (error) {
                    reject(error);
                }
            });
        }).then((result) => {
            subscription.dispose();
            return result;
        }, error => {
            subscription.dispose();
            throw error;
        }),
        cancel
    };
}
exports.promiseFromEvent = promiseFromEvent;
//# sourceMappingURL=util.js.map