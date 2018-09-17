import { ActionType, createAction } from 'typesafe-actions';

export const TEST = 'TEST';
export const CMD_MAKE = 'CMD_MAKE';
export const MAKE = 'MAKE';
export const CMD_RECEPIES = 'CMD_RECEPIES';
export const RECEPIES = 'RECEPIES';
export const CMD_NEW = 'CMD_NEW';
export const NEW = 'NEW';
export const CMD_EDIT = 'CMD_EDIT';
export const EDIT = 'EDIT';
export const GET = 'GET';
export const CMD_FAMILIES = 'CMD_FAMILIES';
export const FAMILIES = 'FAMILIES';
export const SET_RECEPY = 'SET_RECEPY';
export const SET_PART = 'SET_PART';
export const SET_ATTRIBUTE = 'SET_ATTRIBUTE';
export const CMD_DELETE = 'CMD_DELETE';

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
}

export interface RecepyFamily {
    id: string;
    label: string;
    ingredients: RecepyIngredient[];
}

export enum RecepyIngredient {
    COKE = 'COKE',
    RUM = 'RUM',
    TONIC = 'TONIC',
    APEROL = 'APEROL',
    GIN = 'GIN'
}

export const PumpPin = [
    7, 11, 12, 13, 15
];

export enum Pump {
    A = PumpPin[0], // GPIO-4
    B = PumpPin[1], // GPIO-17
    C = PumpPin[2], // GPIO-18
    D = PumpPin[3], // GPIO-27
    E = PumpPin[4] // GPIO-22
}

// @TODO refactor this

export const RootActions = {
    [CMD_RECEPIES]: createAction(CMD_RECEPIES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [RECEPIES]: createAction(RECEPIES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [CMD_MAKE]: createAction(CMD_MAKE, resolve => {
        return (data: MakePayload) => resolve(data);
    }),
    [MAKE]: createAction(MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [CMD_FAMILIES]: createAction(CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [FAMILIES]: createAction(FAMILIES, resolve => {
        return (data: RecepyFamiliesPayload) => resolve(data);
    }),

    [CMD_EDIT]: createAction(CMD_EDIT, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),
    [EDIT]: createAction(EDIT, resolve => {
        return () => resolve({});
    }),

    [CMD_NEW]: createAction(CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [NEW]: createAction(NEW, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [CMD_DELETE]: createAction(CMD_DELETE, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [SET_RECEPY]: createAction(SET_RECEPY, resolve => {
        return (data: Recepy) => resolve(data);
    }),
    [SET_PART]: createAction(SET_PART, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
    [SET_ATTRIBUTE]: createAction(SET_ATTRIBUTE, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;
