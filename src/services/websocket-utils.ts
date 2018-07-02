import { WebsocketPayload } from "./websocket-types";

export namespace WebSocketUtils {
    export function buildMessage<T>(uri: string, data: T): string {
        const message: WebsocketPayload<T> = {
            uri,
            data
        }
        return JSON.stringify(message);
    }
}