import { Pump } from "./pump-types";

export enum RecepyFamilyId {
    DEFAULT = 'DEFAULT',
    INTERNATIONAL = 'INTERNATIONAL'
}

export enum RecepyIngredient {
    COKE = 'COKE',
    RUM = 'RUM',
    TONIC = 'TONIC',
    APEROL = 'APEROL',
    GIN = 'GIN'
}

export interface RecepyPumpConfig {
    pump: Pump;
    quantity: number;
}

export interface Recepy {
    id: string;
    label: string;
    parts: RecepyPumpConfig[]
}

export interface RecepyFamily {
    id: RecepyFamilyId;
    label: string;
    ingredients: RecepyIngredient[]
    recepies: Recepy[]
}

export interface RecepyOption {
    id: string;
    label: string;
}
