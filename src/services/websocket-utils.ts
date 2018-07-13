import { WebsocketPayload } from "./websocket-types";
import ws from 'ws';

export namespace WebSocketUtils {
    export function buildMessage<T>(uri: string, data: T): string {
        const message: WebsocketPayload<T> = {
            uri,
            data
        }
        return JSON.stringify(message);
    }

    export function sendMessage<T>(wsInstance: ws, uri: string, data: T): void {
        const message = buildMessage<T>(uri, data);
        wsInstance.send(message);
    }
}