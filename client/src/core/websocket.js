"use strict";
exports.__esModule = true;
var reconnecting_websocket_1 = require("reconnecting-websocket");
var uuid_1 = require("uuid");
var WebSocketService = /** @class */ (function () {
    function WebSocketService(action) {
        var _this = this;
        this.messages = [];
        this.ready = false;
        this.onMessage = function (event) {
            var payload = event.data;
            try {
                var payloadObject = JSON.parse(payload);
                var action_1 = payloadObject.action, data = payloadObject.data;
                var route = _this.routes.find(function (x) { return x.action === action_1; });
                if (route) {
                    route.callback(data);
                }
            }
            catch (e) {
                return e;
            }
        };
        var host = window.location.host;
        action = action || "ws://" + host + "/ws";
        this.routes = [];
        this.ws = new reconnecting_websocket_1["default"](action);
        this.ws.addEventListener('open', function () {
            _this.ready = true;
        });
        this.ws.addEventListener('close', function () {
            _this.ready = false;
        });
        this.ws.addEventListener("message", this.onMessage);
        setInterval(function () {
            _this.processQueue();
        }, 10);
    }
    WebSocketService.prototype.on = function (action, callback) {
        var _this = this;
        var uuid = uuid_1.v4();
        var route = { uuid: uuid, action: action, callback: callback };
        this.routes.push(route);
        return function () {
            _this.detachListener(uuid);
        };
    };
    WebSocketService.prototype.send = function (action, data) {
        var payload = { action: action, data: data };
        var msg = JSON.stringify(payload);
        this.messages.push(msg);
    };
    // to be refactored
    WebSocketService.prototype.bindActions = function (actions, store) {
        var _this = this;
        Object.keys(actions).forEach(function (action) {
            var selectedAction = actions[action];
            // const type = getType(selectedAction);
            _this.on(action, function (data) {
                store.dispatch(selectedAction(data));
            });
        });
    };
    WebSocketService.prototype.processQueue = function () {
        if (this.messages.length > 0 && this.ready) {
            var item = this.messages.shift();
            if (item) {
                this.ws.send(item);
            }
        }
    };
    WebSocketService.prototype.detachListener = function (uuid) {
        this.routes = this.routes.filter(function (route) { return route.uuid !== uuid; });
    };
    return WebSocketService;
}());
exports.webSocketService = new WebSocketService();
