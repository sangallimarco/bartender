import { EventEmitter } from "events";
import { RequestHandler, NextFunction, Request, Response } from "express";
import ws from 'ws';

export interface WebsocketPayload<T> {
    uri: string,
    data: T
}

export type WebsocketCallback<T> = (ws: EventEmitter, uri: string, data: T) => void;

export interface WebsocketListenerUri {
    uri: string;
}

export interface WebsocketListener<T> extends WebsocketListenerUri {
    callback: WebsocketCallback<T>
}

export interface WebsocketRequest extends Request {
    ws: ws;
}

export interface WebsocketRequestHandler extends RequestHandler {
    (req: WebsocketRequest, res: Response, next: NextFunction): any;
}