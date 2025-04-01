"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWebsocketConnection = exports.disposeWebsocketTimeouts = exports.initializeWebsockets = exports.websocketAlive = void 0;
const Constants_1 = require("./Constants");
const Util_1 = require("./Util");
const flow_score_1 = require("./message_handlers/flow_score");
const integration_connection_1 = require("./message_handlers/integration_connection");
const current_day_stats_update_1 = require("./message_handlers/current_day_stats_update");
const flow_state_1 = require("./message_handlers/flow_state");
const DataController_1 = require("./DataController");
const endOfDay_1 = require("./notifications/endOfDay");
const authenticated_plugin_user_1 = require("./message_handlers/authenticated_plugin_user");
const WebSocket = require('ws');
// The server should send its timeout to allow the client to adjust.
// Default of 30 minutes
const DEFAULT_PING_INTERVAL_MILLIS = Constants_1.ONE_MIN_MILLIS * 30;
let SERVER_PING_INTERVAL_MILLIS = DEFAULT_PING_INTERVAL_MILLIS + Constants_1.ONE_MIN_MILLIS;
let livenessPingTimeout = undefined;
let lastPingResetMillis = 0;
let retryTimeout = undefined;
// Reconnect constants
const INITIAL_RECONNECT_DELAY = 12000;
const MAX_RECONNECT_DELAY = 25000;
const LONG_RECONNECT_DELAY = Constants_1.ONE_MIN_MILLIS * 5;
// Reconnect vars
let useLongReconnectDelay = false;
let currentReconnectDelay = INITIAL_RECONNECT_DELAY;
let ws = undefined;
let alive = false;
function websocketAlive() {
    return alive;
}
exports.websocketAlive = websocketAlive;
function initializeWebsockets() {
    (0, Util_1.logIt)('initializing websocket connection');
    clearWebsocketRetryTimeout();
    if (ws) {
        // 1000 indicates a normal closure, meaning that the purpose for
        // which the connection was established has been fulfilled
        ws.close(1000, 're-initializing websocket');
    }
    const options = {
        headers: {
            Authorization: (0, Util_1.getItem)('jwt'),
            'X-SWDC-Plugin-Id': (0, Util_1.getPluginId)(),
            'X-SWDC-Plugin-Name': (0, Util_1.getPluginName)(),
            'X-SWDC-Plugin-Version': (0, Util_1.getVersion)(),
            'X-SWDC-Plugin-OS': (0, Util_1.getOs)(),
            'X-SWDC-Plugin-TZ': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'X-SWDC-Plugin-Offset': (0, Util_1.getOffsetSeconds)() / 60,
            'X-SWDC-Plugin-UUID': (0, Util_1.getPluginUuid)(),
        },
        perMessageDeflate: false
    };
    const scheme = Constants_1.api_endpoint.includes('https') ? 'wss://' : 'ws://';
    const host = Constants_1.api_endpoint.split('//')[1];
    const websockets_url = `${scheme}${host}/websockets`;
    ws = new WebSocket(websockets_url, options);
    function heartbeat(buf) {
        try {
            // convert the buffer to the json payload containing the server timeout
            const data = JSON.parse(buf.toString());
            if (data?.timeout) {
                // add a 1 minute buffer to the millisconds timeout the server provides
                const interval = data.timeout;
                if (interval > DEFAULT_PING_INTERVAL_MILLIS) {
                    SERVER_PING_INTERVAL_MILLIS = interval + Constants_1.ONE_MIN_MILLIS;
                }
                else {
                    SERVER_PING_INTERVAL_MILLIS = DEFAULT_PING_INTERVAL_MILLIS + Constants_1.ONE_MIN_MILLIS;
                }
            }
        }
        catch (e) {
            // defaults to the DEFAULT_PING_INTERVAL_MILLIS
            SERVER_PING_INTERVAL_MILLIS = DEFAULT_PING_INTERVAL_MILLIS + Constants_1.ONE_MIN_MILLIS;
        }
        // Received a ping from the server. Clear the timeout so
        // our client doesn't terminate the connection
        clearLivenessPingTimeout();
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        livenessPingTimeout = setTimeout(() => {
            if (ws) {
                ws.terminate();
            }
        }, SERVER_PING_INTERVAL_MILLIS);
    }
    ws.on('open', function open() {
        // clear out the retry timeout
        clearWebsocketRetryTimeout();
        // reset long reconnect flag
        useLongReconnectDelay = false;
        // RESET reconnect delay
        currentReconnectDelay = INITIAL_RECONNECT_DELAY;
        alive = true;
        (0, Util_1.logIt)('Websocket connection open');
    });
    ws.on('ping', heartbeat);
    ws.on('message', function incoming(data) {
        handleIncomingMessage(data);
    });
    ws.on('close', function close(code, reason) {
        if (code !== 1000) {
            useLongReconnectDelay = false;
            retryConnection();
        }
    });
    ws.on('unexpected-response', function unexpectedResponse(request, response) {
        (0, Util_1.logIt)(`unexpected websocket response: ${response.statusCode}`);
        if (response.statusCode === 426) {
            (0, Util_1.logIt)('websocket request had invalid headers. Are you behind a proxy?');
        }
        else if (response.statusCode >= 500) {
            useLongReconnectDelay = true;
            retryConnection();
        }
    });
    ws.on('error', function error(e) {
        (0, Util_1.logIt)(`error connecting to websocket: ${e.message}`);
    });
}
exports.initializeWebsockets = initializeWebsockets;
function retryConnection() {
    alive = false;
    if (!retryTimeout) {
        // clear this client side liveness timeout
        clearLivenessPingTimeout();
        let delay = getDelay();
        if (useLongReconnectDelay) {
            // long reconnect (5 minutes)
            delay = LONG_RECONNECT_DELAY;
        }
        else {
            // shorter reconnect: 10 to 50 seconds
            if (currentReconnectDelay < MAX_RECONNECT_DELAY) {
                // multiply until we've reached the max reconnect
                currentReconnectDelay *= 2;
            }
            else {
                currentReconnectDelay = Math.min(currentReconnectDelay, MAX_RECONNECT_DELAY);
            }
        }
        (0, Util_1.logIt)(`retrying websocket connection in ${delay / 1000} second(s)`);
        retryTimeout = setTimeout(() => {
            initializeWebsockets();
        }, delay);
    }
}
function getDelay() {
    let rand = (0, Util_1.getRandomNumberWithinRange)(-5, 5);
    if (currentReconnectDelay < MAX_RECONNECT_DELAY) {
        // if less than the max reconnect delay then increment the delay
        rand = Math.random();
    }
    return currentReconnectDelay + Math.floor(rand * 1000);
}
function disposeWebsocketTimeouts() {
    clearWebsocketRetryTimeout();
    clearLivenessPingTimeout();
}
exports.disposeWebsocketTimeouts = disposeWebsocketTimeouts;
function clearLivenessPingTimeout() {
    if (livenessPingTimeout) {
        clearTimeout(livenessPingTimeout);
        livenessPingTimeout = undefined;
    }
    lastPingResetMillis = new Date().getTime();
}
function checkWebsocketConnection() {
    const nowMillis = new Date().getTime();
    const threshold = SERVER_PING_INTERVAL_MILLIS * 2;
    if (lastPingResetMillis && nowMillis - lastPingResetMillis > threshold) {
        (0, Util_1.logIt)('Resetting websocket connection');
        initializeWebsockets();
    }
}
exports.checkWebsocketConnection = checkWebsocketConnection;
function clearWebsocketRetryTimeout() {
    if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = undefined;
    }
}
// handle incoming websocket messages
const handleIncomingMessage = (data) => {
    try {
        let message = {
            type: 'none'
        };
        try {
            message = JSON.parse(data);
        }
        catch (e) {
            (0, Util_1.logIt)(`Unable to handle incoming message: ${e.message}`);
        }
        switch (message.type) {
            case 'flow_score':
                if ((0, Util_1.isPrimaryWindow)() && !((0, Util_1.editorOpsExtInstalled)())) {
                    try {
                        (0, Util_1.logIt)(`Flow score: ${JSON.stringify(message.body.flowScore)}`);
                    }
                    catch (e) { }
                    (0, flow_score_1.handleFlowScoreMessage)(message);
                }
                break;
            case 'authenticated_plugin_user':
                const user = message.body;
                const currentEmail = (0, Util_1.getItem)('name');
                if (user.email !== currentEmail) {
                    (0, authenticated_plugin_user_1.handleAuthenticatedPluginUser)(user);
                }
                break;
            case 'flow_state':
                try {
                    (0, Util_1.logIt)(`Flow state: ${JSON.stringify(message.body)}`);
                }
                catch (e) { }
                (0, flow_state_1.handleFlowStateMessage)(message.body);
                break;
            case 'user_integration_connection':
                (0, integration_connection_1.handleIntegrationConnectionSocketEvent)(message.body);
                break;
            case 'current_day_stats_update':
                try {
                    (0, Util_1.logIt)(`Current day stats: ${JSON.stringify(message.body.data)}`);
                }
                catch (e) { }
                (0, current_day_stats_update_1.handleCurrentDayStatsUpdate)(message.body);
                break;
            case 'account_deleted':
                (0, DataController_1.userDeletedCompletionHandler)();
                break;
            case 'preferences_update':
                (0, endOfDay_1.setEndOfDayNotification)();
                break;
        }
    }
    catch (e) {
        if (data) {
            let dataStr = '';
            try {
                dataStr = JSON.stringify(data);
            }
            catch (e) {
                dataStr = data.toString();
            }
            (0, Util_1.logIt)(`Unable to handle incoming message: ${dataStr}`);
        }
    }
};
//# sourceMappingURL=websockets.js.map