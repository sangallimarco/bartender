"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_ws_1 = __importDefault(require("express-ws"));
const services_1 = require("./services");
const recipe_parser_1 = require("./services/recipe-parser");
const types_1 = require("./types");
const typesafe_actions_1 = require("typesafe-actions");
const expressWsInstance = express_ws_1.default(express_1.default());
const { app } = expressWsInstance;
const PORT = 8888;
const recipeMaker = new recipe_parser_1.RecipeService();
recipeMaker.initDatabases();
// REDUCER
const MainDispatcher = (data, wsInstance, rootWs) => __awaiter(this, void 0, void 0, function* () {
    switch (data.type) {
        case typesafe_actions_1.getType(types_1.RootActions.CMD_RECEPIES):
            const recipes = yield recipeMaker.getRecepies();
            services_1.WebSocketUtils.sendMessage(wsInstance, types_1.Actions.recipes, {
                recipes
            });
            break;
        case typesafe_actions_1.getType(types_1.RootActions.CMD_EDIT): {
            const { recipe } = data.payload;
            yield recipeMaker.upsertRecipe(recipe);
            const editRecepies = yield recipeMaker.getRecepies();
            services_1.WebSocketUtils.broadcastMessage(rootWs, types_1.Actions.recipes, {
                recipes: editRecepies
            });
            break;
        }
        case typesafe_actions_1.getType(types_1.RootActions.CMD_NEW): {
            const recipe = yield recipeMaker.createRecipe();
            services_1.WebSocketUtils.sendMessage(wsInstance, types_1.Actions.NEW, {
                recipe
            });
            break;
        }
        case typesafe_actions_1.getType(types_1.RootActions.CMD_DELETE): {
            const { recipe } = data.payload;
            yield recipeMaker.delRecipe(recipe);
            const recipes = yield recipeMaker.getRecepies();
            services_1.WebSocketUtils.broadcastMessage(rootWs, types_1.Actions.recipes, {
                recipes
            });
            break;
        }
        case typesafe_actions_1.getType(types_1.RootActions.CMD_FAMILIES): {
            const families = yield recipeMaker.getFamilies();
            services_1.WebSocketUtils.sendMessage(wsInstance, types_1.Actions.FAMILIES, {
                families
            });
            break;
        }
        case typesafe_actions_1.getType(types_1.RootActions.CMD_MAKE): {
            const { recipe } = data.payload;
            const totalTime = recipeMaker.getTotalTime(recipe);
            services_1.WebSocketUtils.broadcastMessage(rootWs, types_1.Actions.MAKE, {
                processing: true,
                totalTime
            });
            yield recipeMaker.setPumps(recipe);
            services_1.WebSocketUtils.broadcastMessage(rootWs, types_1.Actions.MAKE, {
                processing: false,
                totalTime: 0
            });
            break;
        }
    }
});
services_1.webSocketRouter.setWsServer(expressWsInstance.getWss());
services_1.webSocketRouter.setReducer(MainDispatcher);
// ROUTES
app.use('/ws', services_1.webSocketMiddleware);
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../assets')));
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../client/build')));
app.listen(PORT, () => {
    console.log(`Open browser page: http://localhost:${PORT}/app`);
    console.log('  Press CTRL-C to stop\n');
});
//# sourceMappingURL=index.js.map