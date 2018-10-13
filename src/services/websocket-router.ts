import { WebsocketCallback, WebsocketListener, WebsocketListenerUri, WebsocketPayload } from './websocket-types';
import ws, { Server } from 'ws';

type StringType = string;
interface PayloadAction<T extends StringType, P> {
    type: T;
    payload: P;
}
type ReducerCallback = (action: PayloadAction<string, any>, wsInstance: ws, rootWs: Server) => void;

export class WebSocketRouter {
    private routes: any;
    private reducer: ReducerCallback;
    private rootWs: Server;

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

    public setReducer(reducer: ReducerCallback) {
        this.reducer = reducer;
    }

    public setWsServer(rootWs: Server) {
        this.rootWs = rootWs;
    }

    public dispatch(wsRef: ws, payload: string) {
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

        // @TODO refactor here
        const actionObj: PayloadAction<string, any> = { type: action, payload: data };
        this.reducer(actionObj, wsRef, this.rootWs);
    }
}

export const webSocketRouter = new WebSocketRouter();
