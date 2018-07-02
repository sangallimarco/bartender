import express from "express";
import expressWs from 'express-ws';
import path from "path";
// import os from 'os';

import {
    webSocketRouter,
    webSocketMiddleware
} from './services';
import { EventEmitter } from "events";
import { WebsocketPayload } from "./services/websocket-types";

const {
    app
} = expressWs(express());

const expressW = expressWs(express())

const PORT = 8080;
const ROOT_PATH = __dirname;

// routes
webSocketRouter.on('/make', (ws: EventEmitter, uri: string, data: WebsocketPayload) => {
    console.log('make cocktail', ws, uri);
});

// testing post processing
webSocketRouter.on('/test', (ws: EventEmitter, uri: string, data: WebsocketPayload) => {
    console.log('test', ws, uri);
});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(ROOT_PATH, 'client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

console.log(`Open browser page: http://localhost:${PORT}/app`);
app.listen(PORT);