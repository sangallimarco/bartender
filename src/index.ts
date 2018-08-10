import express from "express";
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from "./services/recepy-parser";
import { RoutePath, ProcessingPayload, RecepiesPayload, MakePayload, RecepyOption, RecepyIngredient, RecepyPayload, GetPayload } from './shared';

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();

async function initDB() {
    await recepyMaker.initDatabases();

    // recepyMaker.getRecepies()
    //     .then((recepies: RecepyOption[]) => {
    //         console.log(recepies);
    //     });

    recepyMaker.upsertFamily({
        id: 'default',
        label: 'Default Config',
        ingredients: [RecepyIngredient.APEROL, RecepyIngredient.TONIC, RecepyIngredient.GIN, RecepyIngredient.COKE]
    });

    recepyMaker.upsertRecepy({
        id: 'gin',
        recepyFamily: 'default',
        label: 'Gin',
        parts: [
            {
                pump: 0,
                quantity: 1
            },
            {
                pump: 1,
                quantity: 0
            }, {
                pump: 3,
                quantity: 0
            }
        ]
    });
}

// @TODO refactor this, test only
initDB();

// routes
webSocketRouter.on<{}>(RoutePath.RECEPIES, async (wsInstance: ws, uri: string, data: {}) => {
    const recepies = await recepyMaker.getRecepies()
    WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RoutePath.RECEPIES, {
        recepies
    });
});

webSocketRouter.on<GetPayload>(RoutePath.GET, async (wsInstance: ws, uri: string, data) => {
    const { id } = data;
    const recepy = await recepyMaker.getRecepy(id);
    WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, RoutePath.GET, {
        recepy
    });
});

// testing post processing
webSocketRouter.on<MakePayload>(RoutePath.MAKE, async (wsInstance: ws, uri: string, data) => {
    const { id } = data;

    await recepyMaker.setRecepy(id);
    WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, RoutePath.MAKE, {
        processing: true
    });

    await recepyMaker.setPumps();
    WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, RoutePath.MAKE, {
        processing: false
    });
});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log("  Press CTRL-C to stop\n");
});