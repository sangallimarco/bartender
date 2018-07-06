import ReconnectingWebSocket from 'reconnecting-websocket';

type WebSocketData = {};
type WebSocketCallback = (data: WebSocketData) => void;

export interface WebsocketPayload {
    uri: string,
    data: WebSocketData
}

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketRoute {
    uri: string;
    callback: WebSocketCallback;
}

class WebSocketService {
    private routes: WebSocketRoute[];
    private ws: ReconnectingWebSocket;

    constructor(uri?: string) {
        const { location: { port } } = window;
        uri = uri || `ws://localhost:${port}/ws`;

        this.routes = [];
        this.ws = new ReconnectingWebSocket(uri);
        // this.ws.addEventListener('connect', this.onMessage);
        this.ws.addEventListener("message", this.onMessage);
    }

    onMessage = (event: WebSocketEvent) => {
        const { data: payload } = event;
        try {
            const payloadObject: WebsocketPayload = JSON.parse(payload);
            const { uri, data } = payloadObject;
            const route = this.routes.find(x => x.uri === uri);
            if (route) {
                route.callback(data);
            }
        } catch (e) { }
    };

    on(uri: string, callback: WebSocketCallback): void {
        const route: WebSocketRoute = { uri, callback };
        this.routes.push(route);
    }

    // destroy(listener) {
    //     //
    // }

    send(uri: string, data: WebSocketData): void {
        const payload: WebsocketPayload = { uri, data };
        const msg: string = JSON.stringify(payload);
        this.ws.send(msg);
    }
}

export const webSocketService = new WebSocketService();
