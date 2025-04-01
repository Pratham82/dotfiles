"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseFromEvent = exports.AuthProvider = exports.getAuthInstance = exports.AUTH_TYPE = void 0;
const vscode_1 = require("vscode");
const uuid_1 = require("uuid");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
exports.AUTH_TYPE = 'codetime_auth';
const AUTH_NAME = 'Software.com';
const SESSIONS_KEY = `${exports.AUTH_TYPE}.sessions`;
let instance;
function getAuthInstance() {
    if (!instance) {
        (0, Util_1.logIt)('AuthenticationProvider not initialized');
    }
    return instance;
}
exports.getAuthInstance = getAuthInstance;
class UriEventHandler extends vscode_1.EventEmitter {
    handleUri(uri) {
        this.fire(uri);
    }
}
class AuthProvider {
    constructor(context) {
        this.context = context;
        this._sessionChangeEmitter = new vscode_1.EventEmitter();
        this._pendingStates = [];
        this._codeExchangePromises = new Map();
        this._uriHandler = new UriEventHandler();
        /**
         * Handle the redirect to VS Code (after sign in from Auth0)
         * @param scopes
         * @returns
         */
        this.handleUri = (scopes) => async (uri, resolve, reject) => {
            const query = new URLSearchParams(uri.query);
            const access_token = query.get('access_token');
            const state = query.get('state');
            if (!access_token) {
                reject(new Error('Authentication token not found'));
                return;
            }
            if (!state) {
                reject(new Error('Authentication state not found'));
                return;
            }
            // Check if it is a valid auth request started by the extension
            if (!this._pendingStates.some(n => n === state)) {
                reject(new Error('Authentication state not found'));
                return;
            }
            resolve(access_token);
        };
        this._disposable = vscode_1.Disposable.from(vscode_1.authentication.registerAuthenticationProvider(exports.AUTH_TYPE, AUTH_NAME, this, { supportsMultipleAccounts: false }), vscode_1.window.registerUriHandler(this._uriHandler));
        instance = this;
    }
    get onDidChangeSessions() {
        return this._sessionChangeEmitter.event;
    }
    get redirectUri() {
        const publisher = this.context.extension.packageJSON.publisher;
        const name = this.context.extension.packageJSON.name;
        return `${vscode_1.env.uriScheme}://${publisher}.${name}`;
    }
    /**
     * Get the existing sessions
     * @param scopes
     * @returns
     */
    async getSessions(scopes) {
        const allSessions = await this.context.secrets.get(SESSIONS_KEY);
        if (allSessions) {
            return JSON.parse(allSessions);
        }
        return [];
    }
    async updateSession(jwtToken, user = null) {
        let session = {
            id: (0, uuid_1.v4)(),
            accessToken: jwtToken,
            account: {
                label: '',
                id: ''
            },
            scopes: []
        };
        try {
            const sessionUpdate = !!user;
            if (!user) {
                user = await (0, DataController_1.getUser)(jwtToken);
                await (0, DataController_1.authenticationCompleteHandler)(user, jwtToken);
            }
            session = {
                id: (0, uuid_1.v4)(),
                accessToken: jwtToken,
                account: {
                    label: user.email,
                    id: user.id
                },
                scopes: []
            };
            await this.context.secrets.store(SESSIONS_KEY, JSON.stringify([session]));
            if (sessionUpdate) {
                this._sessionChangeEmitter.fire({ added: [], removed: [], changed: [session] });
            }
            else {
                this._sessionChangeEmitter.fire({ added: [session], removed: [], changed: [] });
            }
        }
        catch (e) {
            if (e.message) {
                (0, Util_1.logIt)(`Error creating session: ${e?.message}`);
            }
        }
        return session;
    }
    /**
     * Create a new auth session
     * @param scopes
     * @returns
     */
    async createSession(scopes) {
        const jwtToken = await this.login(scopes);
        if (!jwtToken) {
            throw new Error(`Software.com login failure`);
        }
        return this.updateSession(jwtToken);
    }
    /**
     * Remove an existing session
     * @param sessionId
     */
    async removeSession(sessionId) {
        const allSessions = await this.context.secrets.get(SESSIONS_KEY);
        if (allSessions) {
            let sessions = JSON.parse(allSessions);
            const sessionIdx = sessions.findIndex(s => s.id === sessionId);
            const session = sessions[sessionIdx];
            sessions.splice(sessionIdx, 1);
            await this.context.secrets.store(SESSIONS_KEY, JSON.stringify(sessions));
            if (session) {
                this._sessionChangeEmitter.fire({ added: [], removed: [session], changed: [] });
            }
        }
    }
    /**
     * Dispose the registered services
     */
    async dispose() {
        this._disposable.dispose();
    }
    /**
     * Auth Log
     */
    async login(scopes = []) {
        return await vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "Signing in to Software.com...",
            cancellable: true
        }, async (_, token) => {
            (0, Util_1.setItem)('logging_in', true);
            const stateId = (0, uuid_1.v4)();
            this._pendingStates.push(stateId);
            const scopeString = scopes.join(' ');
            let params = (0, Util_1.getAuthQueryObject)();
            params.append('response_type', 'token');
            params.append('redirect_uri', this.redirectUri);
            params.append('state', stateId);
            params.append('prompt', 'login');
            const uri = vscode_1.Uri.parse(`${Constants_1.app_url}/plugin/authorize?${params.toString()}`);
            await vscode_1.env.openExternal(uri);
            let codeExchangePromise = this._codeExchangePromises.get(scopeString);
            if (!codeExchangePromise) {
                codeExchangePromise = promiseFromEvent(this._uriHandler.event, this.handleUri(scopes));
                this._codeExchangePromises.set(scopeString, codeExchangePromise);
            }
            try {
                return await Promise.race([
                    codeExchangePromise.promise,
                    // 2 minute timeout
                    new Promise((_, reject) => setTimeout(() => reject('Cancelled'), 120000)),
                    // websocket login check
                    new Promise((_, reject) => {
                        const interval = setInterval(async () => {
                            if ((0, Util_1.getBooleanItem)('logging_in') === false) {
                                clearInterval(interval);
                                reject('Cancelled');
                            }
                        }, 1500);
                    }),
                    // cancel button
                    promiseFromEvent(token.onCancellationRequested, (_, __, reject) => { reject('Login Cancelled'); }).promise
                ]);
            }
            finally {
                this._pendingStates = this._pendingStates.filter(n => n !== stateId);
                codeExchangePromise?.cancel.fire();
                this._codeExchangePromises.delete(scopeString);
                // reset logging_in flag
                (0, Util_1.setItem)('logging_in', false);
            }
        });
    }
}
exports.AuthProvider = AuthProvider;
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
//# sourceMappingURL=AuthProvider.js.map