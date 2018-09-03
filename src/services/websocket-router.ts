import { WebsocketCallback, WebsocketListener, WebsocketListenerUri, WebsocketPayload } from "./websocket-types";
import { EventEmitter } from "events";
import {Action, Reducer} from "../types";
import {ActionType} from "typesafe-actions";

export class WebSocketRouter {
    private reducer: Reducer;
    private actions: ActionType<any>;

    public register<T>(actions: ActionType<T>, reducer: Reducer) {
        this.actions = actions;
        this.reducer = reducer;
    }

    public dispatch(ws: EventEmitter, payload: string) {
        try {
            const payloadObject = JSON.parse(payload) as Action;
            this.reducer(ws, payloadObject as Action);
        } catch (e) {
            return;
        }
    }
}

export const webSocketRouter = new WebSocketRouter();