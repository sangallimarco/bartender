import { WebsocketCallback, WebsocketListener, WebsocketListenerUri, WebsocketPayload } from './websocket-types';
// import { EventEmitter } from 'events';
// import { ActionType, createAction, getType } from 'typesafe-actions';
import ws from 'ws';

type StringType = string;
type PayloadAction<T extends StringType, P> = {
    type: T;
    payload: P;
};
type ReducerCallback = (action: PayloadAction<string, any>, wsInstance: ws) => void;

export class WebSocketRouter {
    private routes: any;
    private reducer: ReducerCallback;

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

    public dispatch(ws: ws, payload: string) {
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
        this.reducer(actionObj, ws);
    }
}

export const webSocketRouter = new WebSocketRouter();
