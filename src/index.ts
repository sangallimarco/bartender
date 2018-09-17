import express from 'express';
import path from 'path';
import expressWs from 'express-ws';
import ws from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecepyService } from './services/recepy-parser';
import { RootAction, RootActions, RECEPIES, NEW, FAMILIES, MAKE } from './types';
import { getType } from 'typesafe-actions';

const { app } = expressWs(express());
const PORT = 8888;
const ROOT_PATH = __dirname;
const recepyMaker = new RecepyService();
recepyMaker.initDatabases();

// REDUCER
const MainReducer = async (data: RootAction, wsInstance: ws) => {
    switch (data.type) {
        case getType(RootActions.CMD_RECEPIES):
            const recepies = await recepyMaker.getRecepies();
            WebSocketUtils.sendMessage(wsInstance, RECEPIES, {
                recepies
            });
            break;
        case getType(RootActions.CMD_EDIT): {
            const { recepy } = data.payload;
            await recepyMaker.upsertRecepy(recepy);
            const recepies = await recepyMaker.getRecepies();
            WebSocketUtils.sendMessage(wsInstance, RECEPIES, {
                recepies
            });
            break;
        }
        case getType(RootActions.CMD_NEW): {
            const recepy = await recepyMaker.createRecepy();
            WebSocketUtils.sendMessage(wsInstance, NEW, {
                recepy
            });
            break;
        }
        case getType(RootActions.CMD_DELETE): {
            const { recepy } = data.payload;
            await recepyMaker.delRecepy(recepy);
            const recepies = await recepyMaker.getRecepies();
            WebSocketUtils.sendMessage(wsInstance, RECEPIES, {
                recepies
            });
            break;
        }
        case getType(RootActions.CMD_FAMILIES): {
            const families = await recepyMaker.getFamilies();
            WebSocketUtils.sendMessage(wsInstance, FAMILIES, {
                families
            });
            break;
        }
        case getType(RootActions.CMD_MAKE): {
            const { id } = data.payload;
            await recepyMaker.setRecepy(id);
            WebSocketUtils.sendMessage(wsInstance, MAKE, {
                processing: true
            });

            await recepyMaker.setPumps();
            WebSocketUtils.sendMessage(wsInstance, MAKE, {
                processing: false
            });
            break;
        }
    }
};
webSocketRouter.setReducer(MainReducer);

// ROUTES
app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(__dirname, '../client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log('  Press CTRL-C to stop\n');
});
