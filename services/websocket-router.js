class WebSocketRouter {
    constructor() {
        this.routes = [];
    }

    on(uri, callback) {
        const listener = {
            uri,
            callback
        };
        this.routes.push(listener);
        return listener;
    }

    dispatch(ws, payload) {
        try {
            const payloadObject = JSON.parse(payload);
            const {
                uri,
                data
            } = payloadObject;
            const route = this.routes.find(x => x.uri === uri);
            if (route) {
                route.callback(ws, uri, data);
            }
        } catch (e) {}
    }
}

module.exports = new WebSocketRouter();