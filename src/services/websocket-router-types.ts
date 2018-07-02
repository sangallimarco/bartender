import { EventEmitter } from "events";

export interface WsPayload {
    uri: string,
    data: {}
}

export type WsCallback = (ws: EventEmitter, uri: string, data: WsPayload) => void;

export interface WsListener {
    uri: string;
    callback: WsCallback
}