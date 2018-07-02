import { WebsocketCallback, WebsocketListener } from "./websocket-types";
import { EventEmitter } from "events";

export class WebSocketRouter {
    private routes: any;

    constructor() {
        this.routes = [];
    }

    on(uri: string, callback: WebsocketCallback) {
        const listener: WebsocketListener = {
            uri,
            callback
        };
        this.routes.push(listener);
        return listener;
    }

    dispatch(ws: EventEmitter, payload: string) {
        try {
            const payloadObject = JSON.parse(payload);
            const {
                uri,
                data
            } = payloadObject;
            const route = this.routes.find((x: WebsocketListener) => x.uri === uri);
            if (route) {
                route.callback(ws, uri, data);
            }
        } catch (e) { }
    }
}

export const webSocketRouter = new WebSocketRouter();