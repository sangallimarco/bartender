import { EventEmitter } from 'events';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import ws from 'ws';

export interface WebsocketPayload<T> {
    action: string;
    data: T;
}

export type WebsocketCallback<T> = (ws: EventEmitter, action: string, data: T) => void;

export interface WebsocketListenerUri {
    action: string;
}

export interface WebsocketListener<T> extends WebsocketListenerUri {
    callback: WebsocketCallback<T>;
}

export interface WebsocketRequest extends Request {
    ws: ws;
}

export interface WebsocketRequestHandler extends RequestHandler {
    (req: WebsocketRequest, res: Response, next: NextFunction): any;
}
