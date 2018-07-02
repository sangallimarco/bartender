import {
    webSocketRouter
} from "./websocket-router";
import { NextFunction, Response, RequestHandler, Request } from "express";
import { WebsocketRequest, WebsocketRequestHandler } from "./websocket-types";
import { EventEmitter } from "events";


export interface ExtendedRequestHandler extends RequestHandler {
    ws: EventEmitter;
}

export const webSocketMiddleware: WebsocketRequestHandler = (req: WebsocketRequest, res: Response, next: NextFunction) => {
    const {
        ws
    } = req;
    if (ws) {
        ws.on("message", (payload: string) => {
            webSocketRouter.dispatch(ws, payload);
        });
    } else {
        next();
    }
}