export const TEST = 'TEST';
export const MAKE = 'MAKE';
export const RECEPIES = 'RECEPIES';
export const NEW = 'NEW';
export const EDIT = 'EDIT';
export const GET = 'GET';
export const GET_FAMILIES = 'GET_FAMILIES';

export const ACTIONS: string[] = [TEST, MAKE, RECEPIES, NEW, EDIT, GET, GET_FAMILIES];

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
    recepies: RecepyOption[];
}

export interface MakePayload {
    id: string;
}

export interface GetPayload {
    id: string;
}

export interface RecepyOption {
    id: string;
    label: string;
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