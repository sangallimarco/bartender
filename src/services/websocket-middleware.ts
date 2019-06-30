import { NextFunction, Response } from 'express';
import { webSocketRouter } from './websocket-router';
import { WebsocketRequest, WebsocketRequestHandler } from './websocket-types';

export const webSocketMiddleware: WebsocketRequestHandler = (
  req: WebsocketRequest,
  res: Response,
  next: NextFunction,
): void => {
  const { ws } = req;
  if (ws) {
    ws.on('message', (payload: string): void => webSocketRouter.dispatch(ws, payload));
  } else {
    next();
  }
};
