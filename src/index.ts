import express from 'express';
import path from 'path';
import expressWs from 'express-ws';
import ws, { Server } from 'ws';
import { webSocketRouter, webSocketMiddleware, WebSocketUtils } from './services';
import { RecipeService } from './services/recipe-parser';
import { RootAction, RootActions, ServerActions } from './types';
import { getType } from 'typesafe-actions';

const expressWsInstance = expressWs(express());
const { app } = expressWsInstance;
const PORT = 8888;
const recipeMaker = new RecipeService();
recipeMaker.initDatabases();

// REDUCER
const MainDispatcher = async (data: RootAction, wsInstance: ws, rootWs: Server) => {
    switch (data.type) {
        case getType(RootActions.CMD_RECIPES):
            const recipes = await recipeMaker.getRecepies();
            WebSocketUtils.sendMessage(wsInstance, ServerActions.RECIPES, {
                recipes
            });
            break;
        case getType(RootActions.CMD_EDIT): {
            const { recipe } = data.payload;
            await recipeMaker.upsertRecipe(recipe);
            const editRecepies = await recipeMaker.getRecepies();
            WebSocketUtils.broadcastMessage(rootWs, ServerActions.RECIPES, {
                recipes: editRecepies
            });
            break;
        }
        case getType(RootActions.CMD_NEW): {
            const recipe = await recipeMaker.createRecipe();
            WebSocketUtils.sendMessage(wsInstance, ServerActions.NEW, {
                recipe
            });
            break;
        }
        case getType(RootActions.CMD_DELETE): {
            const { id } = data.payload;
            await recipeMaker.delRecipe(id);
            const recipes = await recipeMaker.getRecepies();
            WebSocketUtils.broadcastMessage(rootWs, ServerActions.RECIPES, {
                recipes
            });
            break;
        }
        case getType(RootActions.CMD_FAMILIES): {
            const families = await recipeMaker.getFamilies();
            WebSocketUtils.sendMessage(wsInstance, ServerActions.FAMILIES, {
                families
            });
            break;
        }
        case getType(RootActions.CMD_MAKE): {
            const { recipe } = data.payload;
            const totalTime = recipeMaker.getTotalTime(recipe);
            WebSocketUtils.broadcastMessage(rootWs, ServerActions.PROCESSING, {
                processing: true,
                totalTime
            });

            await recipeMaker.setPumps(recipe);
            WebSocketUtils.broadcastMessage(rootWs, ServerActions.PROCESSING, {
                processing: false,
                totalTime: 0
            });
            break;
        }
    }
};
webSocketRouter.setWsServer(expressWsInstance.getWss());
webSocketRouter.setReducer(MainDispatcher);

// ROUTES
app.use('/ws', webSocketMiddleware);
// app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log('  Press CTRL-C to stop\n');
});
