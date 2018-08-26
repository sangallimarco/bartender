import { WebsocketCallback, WebsocketListener, WebsocketListenerUri, WebsocketPayload } from "./websocket-types";
import { EventEmitter } from "events";

export class WebSocketRouter {
    private routes: any;

    constructor() {
        this.routes = [];
    }

    public on<T>(action: string, callback: WebsocketCallback<T>) {
        const listener: WebsocketListener<T> = {
            action,
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
            action,
            data
        } = payloadObject;
        const route = this.routes.find((x: WebsocketListenerUri) => x.action === action);
        if (route) {
            route.callback(ws, action, data);
        }
    }
}

export const webSocketRouter = new WebSocketRouter();