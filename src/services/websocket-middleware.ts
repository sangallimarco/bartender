import {
    webSocketRouter,
} from './websocket-router';
import { NextFunction, Response, RequestHandler } from 'express';
import { WebsocketRequest, WebsocketRequestHandler } from './websocket-types';
import { EventEmitter } from 'events';

export const webSocketMiddleware: WebsocketRequestHandler = (
    req: WebsocketRequest,
    res: Response,
    next: NextFunction
) => {
    const {
        ws
    } = req;
    if (ws) {
        ws.on('message', (payload: string) => {
            webSocketRouter.dispatch(ws, payload);
        });
    } else {
        next();
    }
};
