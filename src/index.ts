import express from 'express';
import path from 'path';
import expressWs from 'express-ws';
import ws, { Server } from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from './services/recepy-parser';
import { RootAction, RootActions, Actions } from './types';
import { getType } from 'typesafe-actions';

const expressWsInstance = expressWs(express());
const { app } = expressWsInstance;
const PORT = 8888;
const recepyMaker = new RecepyService();
recepyMaker.initDatabases();

// REDUCER
const MainDispatcher = async (data: RootAction, wsInstance: ws, rootWs: Server) => {
    switch (data.type) {
        case getType(RootActions.CMD_RECEPIES):
            const recepies = await recepyMaker.getRecepies();
            WebSocketUtils.sendMessage(wsInstance, Actions.RECEPIES, {
                recepies
            });
            break;
        case getType(RootActions.CMD_EDIT): {
            const { recepy } = data.payload;
            await recepyMaker.upsertRecepy(recepy);
            const editRecepies = await recepyMaker.getRecepies();
            WebSocketUtils.broadcastMessage(rootWs, Actions.RECEPIES, {
                recepies: editRecepies
            });
            break;
        }
        case getType(RootActions.CMD_NEW): {
            const recepy = await recepyMaker.createRecepy();
            WebSocketUtils.sendMessage(wsInstance, Actions.NEW, {
                recepy
            });
            break;
        }
        case getType(RootActions.CMD_DELETE): {
            const { recepy } = data.payload;
            await recepyMaker.delRecepy(recepy);
            const recepies = await recepyMaker.getRecepies();
            WebSocketUtils.broadcastMessage(rootWs, Actions.RECEPIES, {
                recepies
            });
            break;
        }
        case getType(RootActions.CMD_FAMILIES): {
            const families = await recepyMaker.getFamilies();
            WebSocketUtils.sendMessage(wsInstance, Actions.FAMILIES, {
                families
            });
            break;
        }
        case getType(RootActions.CMD_MAKE): {
            const { recepy } = data.payload;
            WebSocketUtils.broadcastMessage(rootWs, Actions.MAKE, {
                processing: true
            });

            await recepyMaker.setPumps(recepy);
            WebSocketUtils.broadcastMessage(rootWs, Actions.MAKE, {
                processing: false
            });
            break;
        }
    }
};
webSocketRouter.setWsServer(expressWsInstance.getWss());
webSocketRouter.setReducer(MainDispatcher);

// ROUTES
app.use('/ws', webSocketMiddleware);
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/', express.static(path.join(__dirname, '../client/build')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log('  Press CTRL-C to stop\n');
});
