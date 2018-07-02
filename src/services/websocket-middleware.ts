import {
    webSocketRouter
} from "./websocket-router";

import { EventEmitter } from "events";

interface WsRequest extends Express.Response {
    ws: EventEmitter;
}

export function webSocketMiddleware(req: WsRequest, res: Express.Response, next: any) {
    const {
        ws
    } = req;
    if (ws) {
        ws.on("message", (payload: string) => {
            webSocketRouter.dispatch(ws, payload);
            //   next();
        });
    } else {
        next();
    }
}