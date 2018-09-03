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

// from redux -------------------
export interface Action<T = any, P = any> {
    type: T;
    payload: P;
}
export type Reducer<S = any, A extends Action = AnyAction> = (wsInstance: S | undefined, action: A) => S;
export interface AnyAction extends Action {
    [extraProps: string]: any;
}
// from redux -------------------

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
    parts: number[]
}

export interface RecepyFamily {
    id: string;
    label: string;
    ingredients: RecepyIngredient[]
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