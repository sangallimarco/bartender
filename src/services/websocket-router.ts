import { WebsocketCallback, WebsocketListener, WebsocketListenerUri, WebsocketPayload } from "./websocket-types";
import { EventEmitter } from "events";

export class WebSocketRouter {
    private routes: any;

    constructor() {
        this.routes = [];
    }

    public on<T>(uri: string, callback: WebsocketCallback<T>) {
        const listener: WebsocketListener<T> = {
            uri,
            callback
        };
        this.routes.push(listener);
        return listener;
    }

    public dispatch(ws: EventEmitter, payload: string) {
        let payloadObject: WebsocketPayload<any>;
        try {
            payloadObject = JSON.parse(payload);
        } catch (e) {
            return;
        }
        const {
            uri,
            data
        } = payloadObject;
        const route = this.routes.find((x: WebsocketListenerUri) => x.uri === uri);
        if (route) {
            route.callback(ws, uri, data);
        }
    }
}

export const webSocketRouter = new WebSocketRouter();