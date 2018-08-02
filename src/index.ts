import express from "express";
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from "./services/recepy-parser";
import { RoutePath, ProcessingPayload, RecepiesPayload, MakePayload, RecepyOption } from './shared';
import { RecepyIngredient } from "./services/recepy-types";

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();

// routes
webSocketRouter.on<{}>(RoutePath.RECEPIES, (wsInstance: ws, uri: string, data: {}) => {
    recepyMaker.getRecepies()
        .then((recepies: RecepyOption[]) => {
            WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RoutePath.RECEPIES, {
                recepies
            });
        });

});

// testing post processing
webSocketRouter.on<MakePayload>(RoutePath.MAKE, (wsInstance: ws, uri: string, data: MakePayload) => {
    const { id } = data;
    recepyMaker.setRecepy(id);

    WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, RoutePath.MAKE, {
        processing: true
    });

    recepyMaker.setPumps().then(() => {
        WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, RoutePath.MAKE, {
            processing: false
        });
    });
});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

recepyMaker.upsertRecepy({
    _id: 'aperol',
    recepyFamily: 'default',
    label: 'Aperol',
    parts: [
        {
            pump: 0,
            quantity: 1
        },
        {
            pump: 1,
            quantity: 2
        }, {
            pump: 3,
            quantity: 1
        }
    ]
});

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log("  Press CTRL-C to stop\n");
});