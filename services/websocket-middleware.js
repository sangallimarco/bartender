const webSocketRouter = require("./websocket-router");

function webSocketMiddleware(req, res, next) {
    const {
        ws
    } = req;
    if (ws) {
        ws.on("message", payload => {
            webSocketRouter.dispatch(ws, payload);
            //   next();
        });
    } else {
        next();
    }
}

module.exports = webSocketMiddleware;