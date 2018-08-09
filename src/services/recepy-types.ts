import { Pump } from "./pump-types";

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
    recepyFamily: string;
    label: string;
    parts: RecepyPumpConfig[]
}

export interface RecepyFamily {
    id: string;
    label: string;
    ingredients: RecepyIngredient[]
}
