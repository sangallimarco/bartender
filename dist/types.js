"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
var ServerActions;
(function (ServerActions) {
    ServerActions["TEST"] = "TEST";
    ServerActions["CMD_MAKE"] = "CMD_MAKE";
    ServerActions["PROCESSING"] = "PROCESSING";
    ServerActions["CMD_RECIPES"] = "CMD_RECIPES";
    ServerActions["RECIPES"] = "RECIPES";
    ServerActions["CMD_NEW"] = "CMD_NEW";
    ServerActions["NEW"] = "NEW";
    ServerActions["CMD_EDIT"] = "CMD_EDIT";
    ServerActions["EDIT"] = "EDIT";
    ServerActions["GET"] = "GET";
    ServerActions["CMD_FAMILIES"] = "CMD_FAMILIES";
    ServerActions["FAMILIES"] = "FAMILIES";
    ServerActions["SET_RECEPY"] = "SET_RECEPY";
    ServerActions["SET_PART"] = "SET_PART";
    ServerActions["SET_ATTRIBUTE"] = "SET_ATTRIBUTE";
    ServerActions["CMD_DELETE"] = "CMD_DELETE";
})(ServerActions = exports.ServerActions || (exports.ServerActions = {}));
exports.PumpPin = [
    7,
    11,
    12,
    13,
];
// export enum Pump {
//     A = PumpPin[0], // GPIO-4
//     B = PumpPin[1], // GPIO-17
//     C = PumpPin[2], // GPIO-18
//     D = PumpPin[3], // GPIO-27
//     // E = PumpPin[4] // GPIO-22
// }
// @TODO refactor this
exports.RootActions = {
    [ServerActions.CMD_RECIPES]: typesafe_actions_1.createAction(ServerActions.CMD_RECIPES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [ServerActions.RECIPES]: typesafe_actions_1.createAction(ServerActions.RECIPES, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.CMD_MAKE]: typesafe_actions_1.createAction(ServerActions.CMD_MAKE, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.PROCESSING]: typesafe_actions_1.createAction(ServerActions.PROCESSING, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.CMD_FAMILIES]: typesafe_actions_1.createAction(ServerActions.CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [ServerActions.FAMILIES]: typesafe_actions_1.createAction(ServerActions.FAMILIES, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.CMD_EDIT]: typesafe_actions_1.createAction(ServerActions.CMD_EDIT, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.EDIT]: typesafe_actions_1.createAction(ServerActions.EDIT, resolve => {
        return () => resolve({});
    }),
    [ServerActions.CMD_NEW]: typesafe_actions_1.createAction(ServerActions.CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [ServerActions.NEW]: typesafe_actions_1.createAction(ServerActions.NEW, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.CMD_DELETE]: typesafe_actions_1.createAction(ServerActions.CMD_DELETE, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.SET_RECEPY]: typesafe_actions_1.createAction(ServerActions.SET_RECEPY, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.SET_PART]: typesafe_actions_1.createAction(ServerActions.SET_PART, resolve => {
        return (data) => resolve(data);
    }),
    [ServerActions.SET_ATTRIBUTE]: typesafe_actions_1.createAction(ServerActions.SET_ATTRIBUTE, resolve => {
        return (data) => resolve(data);
    }),
};
//# sourceMappingURL=types.js.map