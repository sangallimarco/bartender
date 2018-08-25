import express from "express";
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from "./services/recepy-parser";
import { RECEPIES, EDIT, GET, GET_FAMILIES, MAKE, NEW, ProcessingPayload, RecepiesPayload, MakePayload, RecepyIngredient, RecepyPayload, GetPayload, RecepyFamiliesPayload, RecepyNewPayload } from './shared';

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();

async function initDB() {
    await recepyMaker.initDatabases();

    // recepyMaker.upsertFamily({
    //     id: 'default',
    //     label: 'Default Config',
    //     ingredients: [
    //         RecepyIngredient.APEROL,
    //         RecepyIngredient.TONIC,
    //         RecepyIngredient.GIN,
    //         RecepyIngredient.COKE,
    //         RecepyIngredient.COKE
    //     ]
    // });

    // recepyMaker.upsertRecepy({
    //     id: 'gin',
    //     recepyFamily: 'default',
    //     label: 'Gin',
    //     parts: [1, 1, 1, 1, 1]
    // });
}

// @TODO refactor this, test only
initDB();

// routes
webSocketRouter.on<{}>(RECEPIES, async (wsInstance: ws, uri: string, data: {}) => {
    const recepies = await recepyMaker.getRecepies()
    WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
        recepies
    });
});

webSocketRouter.on<GetPayload>(GET, async (wsInstance: ws, uri: string, data) => {
    const { id } = data;
    const recepy = await recepyMaker.getRecepy(id);
    WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, GET, {
        recepy
    });
});

webSocketRouter.on<{}>(NEW, async (wsInstance: ws, uri: string, data) => {
    const recepy = await recepyMaker.createRecepy();
    WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, NEW, {
        recepy
    });
});

webSocketRouter.on<RecepyPayload>(EDIT, async (wsInstance: ws, uri: string, data) => {
    const { recepy } = data;
    await recepyMaker.upsertRecepy(recepy);
    WebSocketUtils.sendMessage<{}>(wsInstance, EDIT, {
    });
});

webSocketRouter.on<{}>(GET_FAMILIES, async (wsInstance: ws, uri: string, data) => {
    const families = await recepyMaker.getFamilies();
    WebSocketUtils.sendMessage<RecepyFamiliesPayload>(wsInstance, GET_FAMILIES, {
        families
    });
});

// testing post processing
webSocketRouter.on<MakePayload>(MAKE, async (wsInstance: ws, uri: string, data) => {
    const { id } = data;

    await recepyMaker.setRecepy(id);
    WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
        processing: true
    });

    await recepyMaker.setPumps();
    WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
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