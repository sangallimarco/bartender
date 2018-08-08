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

//
recepyMaker.initDatabases().then(() => {
    recepyMaker.getRecepies()
        .then((recepies: RecepyOption[]) => {
            console.log(recepies);
        });

    // recepyMaker.upsertFamily({
    //     _id: 'default',
    //     label: 'default',
    //     ingredients: [RecepyIngredient.APEROL, RecepyIngredient.TONIC, RecepyIngredient.GIN, RecepyIngredient.COKE]
    // });

    // recepyMaker.upsertRecepy({
    //     _id: 'gin',
    //     recepyFamily: 'default',
    //     label: 'Gin',
    //     parts: [
    //         {
    //             pump: 0,
    //             quantity: 1
    //         },
    //         {
    //             pump: 1,
    //             quantity: 0
    //         }, {
    //             pump: 3,
    //             quantity: 0
    //         }
    //     ]
    // });
});

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

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log("  Press CTRL-C to stop\n");
});