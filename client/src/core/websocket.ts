import ReconnectingWebSocket from 'reconnecting-websocket';
import { v4 } from 'uuid';
import { Store } from 'redux';
// import { getType } from 'typesafe-actions';

type WebSocketCallback<T> = (data: T) => void;

export interface WebsocketPayload<T> {
    action: string;
    data: T;
}

export type WebSocketListener = () => void;

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketRoute {
    uuid: string;
    action: string;
    callback: WebSocketCallback<any>;
}

class WebSocketService {
    private routes: WebSocketRoute[];
    private ws: ReconnectingWebSocket;
    private messages: string[] = [];
    private ready: boolean = false;

    constructor(action?: string) {
        const { location: { host } } = window;
        action = action || `ws://${host}/ws`;

        this.routes = [];
        this.ws = new ReconnectingWebSocket(action);
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

    public on<T>(action: string, callback: WebSocketCallback<T>): WebSocketListener {
        const uuid = v4();
        const route: WebSocketRoute = { uuid, action, callback };
        this.routes.push(route);

        return () => {
            this.detachListener(uuid);
        }
    }

    public send<T>(action: string, data: T): void {
        const payload: WebsocketPayload<T> = { action, data };
        const msg: string = JSON.stringify(payload);
        this.messages.push(msg);
    }

    // to be refactored
    public bindActions<T>(actions: T, store: Store) {
        Object.keys(actions).forEach((action: string) => {
            const selectedAction = actions[action];
            // const type = getType(selectedAction);
            this.on<any>(action, (data: any) => {
                store.dispatch(selectedAction(data));
            });
        });
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
            const { action, data } = payloadObject;
            const route = this.routes.find(x => x.action === action);
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
