import {
    webSocketRouter
} from "./websocket-router";

import express, { NextFunction, Response, Request } from "express";

import { EventEmitter } from "events";

interface WsRequest extends Request {
    ws: EventEmitter;
}

export function webSocketMiddleware(req: WsRequest, res: Response, next: NextFunction): void {
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