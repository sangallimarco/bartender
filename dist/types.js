"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
var Actions;
(function (Actions) {
    Actions["SRV_TEST"] = "SRV_TEST";
    Actions["SRV_CMD_MAKE"] = "SRV_CMD_MAKE";
    Actions["SRV_PROCESSING"] = "SRV_PROCESSING";
    Actions["SRV_CMD_RECIPES"] = "SRV_CMD_RECIPES";
    Actions["SRV_RECIPES"] = "SRV_RECIPES";
    Actions["SRV_CMD_NEW"] = "SRV_CMD_NEW";
    Actions["SRV_NEW"] = "SRV_NEW";
    Actions["SRV_CMD_EDIT"] = "SRV_CMD_EDIT";
    Actions["SRV_EDIT"] = "SRV_EDIT";
    Actions["SRV_GET"] = "SRV_GET";
    Actions["SRV_CMD_FAMILIES"] = "SRV_CMD_FAMILIES";
    Actions["SRV_FAMILIES"] = "SRV_FAMILIES";
    Actions["SRV_SET_RECEPY"] = "SRV_SET_RECEPY";
    Actions["SRV_SET_PART"] = "SRV_SET_PART";
    Actions["SRV_SET_ATTRIBUTE"] = "SRV_SET_ATTRIBUTE";
    Actions["SRV_CMD_DELETE"] = "SRV_CMD_DELETE";
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
    [Actions.SRV_CMD_RECIPES]: typesafe_actions_1.createAction(Actions.SRV_CMD_RECIPES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [Actions.SRV_RECIPES]: typesafe_actions_1.createAction(Actions.SRV_RECIPES, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_CMD_MAKE]: typesafe_actions_1.createAction(Actions.SRV_CMD_MAKE, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_PROCESSING]: typesafe_actions_1.createAction(Actions.SRV_PROCESSING, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_CMD_FAMILIES]: typesafe_actions_1.createAction(Actions.SRV_CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [Actions.SRV_FAMILIES]: typesafe_actions_1.createAction(Actions.SRV_FAMILIES, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_CMD_EDIT]: typesafe_actions_1.createAction(Actions.SRV_CMD_EDIT, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_EDIT]: typesafe_actions_1.createAction(Actions.SRV_EDIT, resolve => {
        return () => resolve({});
    }),
    [Actions.SRV_CMD_NEW]: typesafe_actions_1.createAction(Actions.SRV_CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [Actions.SRV_NEW]: typesafe_actions_1.createAction(Actions.SRV_NEW, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_CMD_DELETE]: typesafe_actions_1.createAction(Actions.SRV_CMD_DELETE, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_SET_RECEPY]: typesafe_actions_1.createAction(Actions.SRV_SET_RECEPY, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_SET_PART]: typesafe_actions_1.createAction(Actions.SRV_SET_PART, resolve => {
        return (data) => resolve(data);
    }),
    [Actions.SRV_SET_ATTRIBUTE]: typesafe_actions_1.createAction(Actions.SRV_SET_ATTRIBUTE, resolve => {
        return (data) => resolve(data);
    }),
};
//# sourceMappingURL=types.js.map