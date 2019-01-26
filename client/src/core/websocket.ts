import { v4 } from 'uuid';
import { EventObject } from 'xstate-ext';

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
    private ws: WebSocket;
    private messages: string[] = [];
    private ready: boolean = false;
    private interval: NodeJS.Timer;
    private retryInterval: NodeJS.Timer;
    private uri: string;

    constructor(uri?: string) {
        const { location: { host } } = window;
        uri = uri || `ws://${host}/ws`;
        this.routes = [];
        this.uri = uri;

        this.connect();
    }

    public connect() {
        if (this.ws) {
            clearInterval(this.interval);
            this.ws.removeEventListener('open', this.setReady);
            this.ws.removeEventListener('close', this.setClosed);
            this.ws.removeEventListener('message', this.onMessage);
        }
        this.ws = new WebSocket(this.uri);
        this.ws.addEventListener('open', this.setReady);
        this.ws.addEventListener('close', this.setClosed);
        this.ws.addEventListener('message', this.onMessage);

        this.interval = setInterval(() => {
            this.processQueue();
        }, 10);
    }

    public setReady = () => {
        this.ready = true;
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
        }
    }

    public setClosed = () => {
        this.ready = true;
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
        }
        this.retryInterval = setInterval(() => this.connect(), 1000);
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
    public bindDispatcher<T, MachineEvents extends EventObject>(actions: T, dispatch: (action: MachineEvents) => void) {
        Object.keys(actions).forEach((action: string) => {
            const selectedAction = actions[action];
            // const type = getType(selectedAction);
            this.on<any>(action, (data: any) => {
                dispatch({ type: selectedAction, ...data });
            });
        });
    }

    public unbindAll() { // TODO implement this for each bindDispatcher
        this.routes = [];
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
