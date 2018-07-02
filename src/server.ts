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
import { RecepyService } from "./services/recepy-parser";

const {
    app
} = expressWs(express());

const expressW = expressWs(express())

const recepyMaker = new RecepyService();

const PORT = 8080;
const ROOT_PATH = __dirname;

// routes
webSocketRouter.on('/make', (ws: EventEmitter, uri: string, data: WebsocketPayload<string>) => {
    console.log('make cocktail', ws, uri);
    const recepyName: string = data.data;
    recepyMaker.setRecepy(recepyName);
});

// testing post processing
webSocketRouter.on('/test', (ws: EventEmitter, uri: string, data: WebsocketPayload<string>) => {
    console.log('test', ws, uri);
});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(ROOT_PATH, 'client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

console.log(`Open browser page: http://localhost:${PORT}/app`);
app.listen(PORT);