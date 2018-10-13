"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
var Actions;
(function (Actions) {
    Actions["TEST"] = "TEST";
    Actions["CMD_MAKE"] = "CMD_MAKE";
    Actions["MAKE"] = "MAKE";
    Actions["CMD_RECEPIES"] = "CMD_RECEPIES";
    Actions["RECEPIES"] = "RECEPIES";
    Actions["CMD_NEW"] = "CMD_NEW";
    Actions["NEW"] = "NEW";
    Actions["CMD_EDIT"] = "CMD_EDIT";
    Actions["EDIT"] = "EDIT";
    Actions["GET"] = "GET";
    Actions["CMD_FAMILIES"] = "CMD_FAMILIES";
    Actions["FAMILIES"] = "FAMILIES";
    Actions["SET_RECEPY"] = "SET_RECEPY";
    Actions["SET_PART"] = "SET_PART";
    Actions["SET_ATTRIBUTE"] = "SET_ATTRIBUTE";
    Actions["CMD_DELETE"] = "CMD_DELETE";
})(Actions = exports.Actions || (exports.Actions = {}));
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
    [Actions.CMD_RECEPIES]: typesafe_actions_1.createAction(Actions.CMD_RECEPIES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [Actions.RECEPIES]: typesafe_actions_1.createAction(Actions.RECEPIES, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.CMD_MAKE]: typesafe_actions_1.createAction(Actions.CMD_MAKE, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.MAKE]: typesafe_actions_1.createAction(Actions.MAKE, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.CMD_FAMILIES]: typesafe_actions_1.createAction(Actions.CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [Actions.FAMILIES]: typesafe_actions_1.createAction(Actions.FAMILIES, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.CMD_EDIT]: typesafe_actions_1.createAction(Actions.CMD_EDIT, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.EDIT]: typesafe_actions_1.createAction(Actions.EDIT, resolve => {
        return () => resolve({});
    }),
    [Actions.CMD_NEW]: typesafe_actions_1.createAction(Actions.CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [Actions.NEW]: typesafe_actions_1.createAction(Actions.NEW, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.CMD_DELETE]: typesafe_actions_1.createAction(Actions.CMD_DELETE, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SET_RECEPY]: typesafe_actions_1.createAction(Actions.SET_RECEPY, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SET_PART]: typesafe_actions_1.createAction(Actions.SET_PART, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SET_ATTRIBUTE]: typesafe_actions_1.createAction(Actions.SET_ATTRIBUTE, resolve => {
        return (data) => resolve(data);
    }),
};
//# sourceMappingURL=types.js.map