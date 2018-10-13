"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketUtils;
(function (WebSocketUtils) {
    function buildMessage(action, data) {
        const message = {
            action,
            data
        };
        return JSON.stringify(message);
    }
    WebSocketUtils.buildMessage = buildMessage;
    function sendMessage(wsInstance, action, data) {
        const message = buildMessage(action, data);
        wsInstance.send(message);
    }
    WebSocketUtils.sendMessage = sendMessage;
    function broadcastMessage(rootInstance, action, data) {
        const message = buildMessage(action, data);
        rootInstance.clients.forEach((wsInstance) => {
            wsInstance.send(message);
        });
    }
    WebSocketUtils.broadcastMessage = broadcastMessage;
})(WebSocketUtils = exports.WebSocketUtils || (exports.WebSocketUtils = {}));
//# sourceMappingURL=websocket-utils.js.map