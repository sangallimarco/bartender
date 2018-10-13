"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketRouter {
    constructor() {
        this.routes = [];
    }
    on(action, callback) {
        const listener = {
            action,
            callback
        };
        this.routes.push(listener);
        return listener;
    }
    setReducer(reducer) {
        this.reducer = reducer;
    }
    setWsServer(rootWs) {
        this.rootWs = rootWs;
    }
    dispatch(wsRef, payload) {
        let payloadObject;
        try {
            payloadObject = JSON.parse(payload);
        }
        catch (e) {
            return;
        }
        const { action, data } = payloadObject;
        // @TODO refactor here
        const actionObj = { type: action, payload: data };
        this.reducer(actionObj, wsRef, this.rootWs);
    }
}
exports.WebSocketRouter = WebSocketRouter;
exports.webSocketRouter = new WebSocketRouter();
//# sourceMappingURL=websocket-router.js.map