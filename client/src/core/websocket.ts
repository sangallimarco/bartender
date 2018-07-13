import ReconnectingWebSocket from 'reconnecting-websocket';
import { v4 } from 'uuid';

type WebSocketCallback<T> = (data: T) => void;

export interface WebsocketPayload<T> {
    uri: string;
    data: T;
}

export type WebSocketListener = () => void;

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketRoute {
    uuid: string;
    uri: string;
    callback: WebSocketCallback<any>;
}

class WebSocketService {
    private routes: WebSocketRoute[];
    private ws: ReconnectingWebSocket;
    private messages: string[] = [];
    private ready: boolean = false;

    constructor(uri?: string) {
        const { location: { host } } = window;
        uri = uri || `ws://${host}/ws`;

        this.routes = [];
        this.ws = new ReconnectingWebSocket(uri);
        this.ws.addEventListener('open', () => {
            this.ready = true;
        });
        this.ws.addEventListener('close', () => {
            this.ready = false;
        }
        );
        this.ws.addEventListener("message", this.onMessage);

        setInterval(() => {
            this.processQueue();
        }, 10);
    }

    public on<T>(uri: string, callback: WebSocketCallback<T>): WebSocketListener {
        const uuid = v4();
        const route: WebSocketRoute = { uuid, uri, callback };
        this.routes.push(route);

        return () => {
            this.detachListener(uuid);
        }
    }

    public send<T>(uri: string, data: T): void {
        const payload: WebsocketPayload<T> = { uri, data };
        const msg: string = JSON.stringify(payload);
        this.messages.push(msg);
    }

    private processQueue() {
        if (this.messages.length > 0 && this.ready) {
            const item = this.messages.shift();
            if (item) {
                this.ws.send(item);
            }
        }
    }

    private onMessage = (event: WebSocketEvent) => {
        const { data: payload } = event;
        try {
            const payloadObject = JSON.parse(payload);
            const { uri, data } = payloadObject;
            const route = this.routes.find(x => x.uri === uri);
            if (route) {
                route.callback(data);
            }
        } catch (e) {
            return e;
        }
    };

    private detachListener(uuid: string) {
        this.routes = this.routes.filter((route: WebSocketRoute) => route.uuid !== uuid);
    }
}

export const webSocketService = new WebSocketService();
