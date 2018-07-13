import express from "express";
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { WebsocketPayload } from "./services/websocket-types";
import { RecepyService } from "./services/recepy-parser";
import { RoutePath } from './shared';

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();

// routes
webSocketRouter.on(RoutePath.RECEPIES, (ws: ws, uri: string, data: WebsocketPayload<string>) => {
    const recepies = recepyMaker.getRecepies();
    const message = WebSocketUtils.buildMessage(RoutePath.RECEPIES, {
        recepies
    });
    ws.send(message);
});

// testing post processing
webSocketRouter.on(RoutePath.MAKE, (ws: ws, uri: string, data: WebsocketPayload<string>) => {
    recepyMaker.setRecepy('gintonic');

    const message = WebSocketUtils.buildMessage(RoutePath.MAKE, {
        processing: true
    });
    ws.send(message);

    recepyMaker.setPumps().then(() => {
        1
        const message = WebSocketUtils.buildMessage(RoutePath.MAKE, {
            processing: false
        });
        ws.send(message);
    });

});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log("  Press CTRL-C to stop\n");
});