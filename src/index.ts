import express from 'express';
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from './services/recepy-parser';
import { RootAction, RootActions } from './types';
import { getType } from 'typesafe-actions';
import { EventEmitter } from 'events';

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

const MainReducer = async (data: RootAction, wsInstance: ws) => {
    switch (data.type) {
        case getType(RootActions.CMD_RECEPIES):
            const recepies = await recepyMaker.getRecepies();
            // WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
            //     recepies
            // });
            break;
        case getType(RootActions.CMD_EDIT): {
            const { recepy } = data.payload;
            await recepyMaker.upsertRecepy(recepy);
            const recepies = await recepyMaker.getRecepies();
            // WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
            //     recepies
            // });
        }
    }
}

webSocketRouter.setReducer(MainReducer);

// routes
// webSocketRouter.on<{}>(CMD_RECEPIES, async (wsInstance: ws, uri: string, data: {}) => {
//     const recepies = await recepyMaker.getRecepies();
//     WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//         recepies
//     });
// });

// webSocketRouter.on<GetPayload>(GET, async (wsInstance: ws, uri: string, data) => {
//     const { id } = data;
//     const recepy = await recepyMaker.getRecepy(id);
//     WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, SET_RECEPY, {
//         recepy
//     });
// });

// webSocketRouter.on<{}>(CMD_NEW, async (wsInstance: ws, uri: string, data) => {
//     const recepy = await recepyMaker.createRecepy();
//     WebSocketUtils.sendMessage<RecepyPayload>(wsInstance, NEW, {
//         recepy
//     });
// });

// webSocketRouter.on<RecepyPayload>(CMD_EDIT, async (wsInstance: ws, uri: string, data) => {
//     const { recepy } = data;
//     await recepyMaker.upsertRecepy(recepy);
//     const recepies = await recepyMaker.getRecepies();
//     WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//         recepies
//     });
// });

// webSocketRouter.on<RecepyPayload>(CMD_DELETE, async (wsInstance: ws, uri: string, data) => {
//     const { recepy } = data;
//     await recepyMaker.delRecepy(recepy);
//     const recepies = await recepyMaker.getRecepies();
//     WebSocketUtils.sendMessage<RecepiesPayload>(wsInstance, RECEPIES, {
//         recepies
//     });
// });

// webSocketRouter.on<{}>(CMD_FAMILIES, async (wsInstance: ws, uri: string, data) => {
//     const families = await recepyMaker.getFamilies();
//     WebSocketUtils.sendMessage<RecepyFamiliesPayload>(wsInstance, FAMILIES, {
//         families
//     });
// });

// // testing post processing
// webSocketRouter.on<MakePayload>(CMD_MAKE, async (wsInstance: ws, uri: string, data) => {
//     const { id } = data;

//     await recepyMaker.setRecepy(id);
//     WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
//         processing: true
//     });

//     await recepyMaker.setPumps();
//     WebSocketUtils.sendMessage<ProcessingPayload>(wsInstance, MAKE, {
//         processing: false
//     });
// });

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log('  Press CTRL-C to stop\n');
});
