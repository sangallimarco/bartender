import { WsPayload } from "./websocket-router-types";

export function buildMessage(uri: string, data: WsPayload) {
    return JSON.stringify({
        uri,
        data
    });
}