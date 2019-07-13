import ws, { Server } from 'ws';
import { WebsocketCallback, WebsocketListener, WebsocketPayload } from './websocket-types';

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

    public on<T>(action: string, callback: WebsocketCallback<T>): WebsocketListener<T> {
      const listener: WebsocketListener<T> = {
        action,
        callback,
      };
      this.routes.push(listener);
      return listener;
    }

    public setReducer(reducer: ReducerCallback): void {
      this.reducer = reducer;
    }

    public setWsServer(rootWs: Server): void {
      this.rootWs = rootWs;
    }

    // FIXME: Remove any here
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public dispatch(wsRef: ws, payload: string): void {
      try {
        const payloadObject: WebsocketPayload<any> = JSON.parse(payload);
        const { action, data } = payloadObject;

        // @TODO refactor here
        const actionObj: PayloadAction<string, any> = { type: action, payload: data };
        this.reducer(actionObj, wsRef, this.rootWs);
      } catch (e) {
        console.error('Error during dispatching:', e);
      }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const webSocketRouter = new WebSocketRouter();
