import ws, { Server } from 'ws';
import { WebsocketPayload } from './websocket-types';

function buildMessage<T>(action: string, data: T): string {
  const message: WebsocketPayload<T> = { action, data };
  return JSON.stringify(message);
}

function sendMessage<T>(wsInstance: ws, action: string, data: T): void {
  const message = buildMessage<T>(action, data);
  wsInstance.send(message);
}

function broadcastMessage<T>(rootInstance: Server, action: string, data: T): void {
  const message = buildMessage<T>(action, data);
  rootInstance.clients.forEach((wsInstance: ws): void => wsInstance.send(message));
}

export const WebSocketUtils = {
  broadcastMessage,
  sendMessage,
  buildMessage,
};
