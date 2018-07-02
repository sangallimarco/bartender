import { WebsocketPayload } from "./websocket-types";

export function buildMessage(uri: string, data: WebsocketPayload): string {
    return JSON.stringify({
        uri,
        data
    });
}