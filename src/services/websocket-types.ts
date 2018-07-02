import { EventEmitter } from "events";
import { RequestHandler, NextFunction, Request, Response } from "express";

export interface WebsocketPayload<T> {
    uri: string,
    data: T
}

export type WebsocketCallback = (ws: EventEmitter, uri: string, data: WebsocketPayload<any>) => void;

export interface WebsocketListener {
    uri: string;
    callback: WebsocketCallback
}

export interface WebsocketRequest extends Request {
    ws: EventEmitter;
}

export interface WebsocketRequestHandler extends RequestHandler {
    (req: WebsocketRequest, res: Response, next: NextFunction): any;
}