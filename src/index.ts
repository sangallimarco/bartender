import express from "express";
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from "./services/recepy-parser";
import { CMD_RECEPIES, RECEPIES, CMD_EDIT, GET, CMD_FAMILIES, FAMILIES, CMD_MAKE, MAKE, CMD_NEW, NEW, ProcessingPayload, RecepiesPayload, MakePayload, RecepyPayload, GetPayload, RecepyFamiliesPayload, SET_RECEPY, CMD_DELETE, Reducer } from './types';
import { RootActions, RootAction } from './actions';
import { getType } from 'typesafe-actions';

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();

export const reducer: Reducer = async (
    wsInstance: ws,
    action: RootAction
) => {
    switch (action.type) {
        case getType(RootActions.CMD_RECEPIES):
            const recepies = await recepyMaker.getRecepies()
            WebSocketUtils.sendMessage(wsInstance, RECEPIES, {
                recepies
            });
            return;

        // case getType(RootActions.RECEPIES):
        //     const { recepies } = action.payload;
        //     return;

    }
};

async function initDB() {
    await recepyMaker.initDatabases();
}

// @TODO refactor this, test only
initDB();

type R<A> = ReturnType<A>;

const a: R<RootActions.RECEPIES> = {}

webSocketRouter.register(RootActions, reducer);

//
// // routes
// webSocketRouter.on(CMD_RECEPIES,
//     async (wsInstance: ws, data: {}) => {
//         const recepies = await recepyMaker.getRecepies()
//         WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//             recepies
//         });
//     });
//
// webSocketRouter.on(GET,
//     async (wsInstance: ws, data: GetPayload) => {
//         const { id } = data;
//         const recepy = await recepyMaker.getRecepy(id);
//         WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, SET_RECEPY, {
//             recepy
//         });
//     });
//
// webSocketRouter.on(CMD_NEW,
//     async (wsInstance: ws, data: {}) => {
//         const recepy = await recepyMaker.createRecepy();
//         WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, NEW, {
//             recepy
//         });
//     });
//
// webSocketRouter.on(CMD_EDIT,
//     async (wsInstance: ws, data: RecepyPayload) => {
//         const { recepy } = data;
//         await recepyMaker.upsertRecepy(recepy);
//         const recepies = await recepyMaker.getRecepies()
//         WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//             recepies
//         });
//     });
//
// webSocketRouter.on(CMD_DELETE,
//     async (wsInstance: ws, data: RecepyPayload) => {
//         const { recepy } = data;
//         await recepyMaker.delRecepy(recepy);
//         const recepies = await recepyMaker.getRecepies()
//         WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//             recepies
//         });
//     });
//
// webSocketRouter.on(CMD_FAMILIES,
//     async (wsInstance: ws, data: {}) => {
//         const families = await recepyMaker.getFamilies();
//         WebSocketUtils.sendMessage<RecepyFamiliesPayload>(wsInstance, FAMILIES, {
//             families
//         });
//     });
//
// // testing post processing
// webSocketRouter.on(CMD_MAKE,
//     async (wsInstance: ws, data: MakePayload) => {
//         const { id } = data;
//
//         await recepyMaker.setRecepy(id);
//         WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
//             processing: true
//         });
//
//         await recepyMaker.setPumps();
//         WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
//             processing: false
//         });
//     });

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log("  Press CTRL-C to stop\n");
});