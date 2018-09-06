import { WebsocketPayload } from './websocket-types';
import ws from 'ws';

export namespace WebSocketUtils {
    export function buildMessage<T>(action: string, data: T): string {
        const message: WebsocketPayload<T> = {
            action,
            data
        };
        return JSON.stringify(message);
    }

    export function sendMessage<T>(wsInstance: ws, action: string, data: T): void {
        const message = buildMessage<T>(action, data);
        wsInstance.send(message);
    }
}
