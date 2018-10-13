import { ActionType, createAction } from 'typesafe-actions';

export enum Actions {
    TEST = 'TEST',
    CMD_MAKE = 'CMD_MAKE',
    MAKE = 'MAKE',
    CMD_RECEPIES = 'CMD_RECEPIES',
    RECEPIES = 'RECEPIES',
    CMD_NEW = 'CMD_NEW',
    NEW = 'NEW',
    CMD_EDIT = 'CMD_EDIT',
    EDIT = 'EDIT',
    GET = 'GET',
    CMD_FAMILIES = 'CMD_FAMILIES',
    FAMILIES = 'FAMILIES',
    SET_RECEPY = 'SET_RECEPY',
    SET_PART = 'SET_PART',
    SET_ATTRIBUTE = 'SET_ATTRIBUTE',
    CMD_DELETE = 'CMD_DELETE',
}

export interface ProcessingPayload {
    processing: boolean;
}

export interface RecepyPayload {
    recepy: Recepy;
}

export interface RecepyNewPayload {
    id: string;
}

export interface RecepyFamiliesPayload {
    families: RecepyFamily[];
}

export interface RecepiesPayload {
    recepies: Recepy[];
}

export interface MakePayload {
    id: string;
}

export interface GetPayload {
    id: string;
}

export interface AttributePayload {
    id: string;
    value: string;
}

export interface Recepy {
    id: string;
    recepyFamily: string;
    label: string;
    parts: number[];
    description: string;
}

export interface RecepyFamily {
    id: string;
    label: string;
    ingredients: RecepyIngredient[];
}

export interface RecepyIngredient {
    label: string;
    color: string;
}

export const PumpPin = [
    7,
    11,
    12,
    13,
    // 15
];

// export enum Pump {
//     A = PumpPin[0], // GPIO-4
//     B = PumpPin[1], // GPIO-17
//     C = PumpPin[2], // GPIO-18
//     D = PumpPin[3], // GPIO-27
//     // E = PumpPin[4] // GPIO-22
// }

// @TODO refactor this

export const RootActions = {
    [Actions.CMD_RECEPIES]: createAction(Actions.CMD_RECEPIES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [Actions.RECEPIES]: createAction(Actions.RECEPIES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [Actions.CMD_MAKE]: createAction(Actions.CMD_MAKE, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),
    [Actions.MAKE]: createAction(Actions.MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [Actions.CMD_FAMILIES]: createAction(Actions.CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [Actions.FAMILIES]: createAction(Actions.FAMILIES, resolve => {
        return (data: RecepyFamiliesPayload) => resolve(data);
    }),

    [Actions.CMD_EDIT]: createAction(Actions.CMD_EDIT, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),
    [Actions.EDIT]: createAction(Actions.EDIT, resolve => {
        return () => resolve({});
    }),

    [Actions.CMD_NEW]: createAction(Actions.CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [Actions.NEW]: createAction(Actions.NEW, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [Actions.CMD_DELETE]: createAction(Actions.CMD_DELETE, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [Actions.SET_RECEPY]: createAction(Actions.SET_RECEPY, resolve => {
        return (data: Recepy) => resolve(data);
    }),
    [Actions.SET_PART]: createAction(Actions.SET_PART, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
    [Actions.SET_ATTRIBUTE]: createAction(Actions.SET_ATTRIBUTE, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;
