"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_router_1 = require("./websocket-router");
exports.webSocketMiddleware = (req, res, next) => {
    const { ws } = req;
    if (ws) {
        ws.on('message', (payload) => {
            websocket_router_1.webSocketRouter.dispatch(ws, payload);
        });
    }
    else {
        next();
    }
};
//# sourceMappingURL=websocket-middleware.js.map