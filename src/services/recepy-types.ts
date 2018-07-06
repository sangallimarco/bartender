import { Pump } from "./pump-types";

export enum RecepyFamilyName {
    DEFAULT = 'DEFAULT',
    COCKTAIL = 'COCKTAIL'
}

export enum RecepyIngredient {
    COKE = 'COKE',
    RUM = 'RUM',
    TONIC = 'TONIC',
    APEROL = 'APEROL'
}

export interface RecepyPumpConfig {
    pump: Pump;
    quantity: number;
}

export interface Recepy {
    name: string;
    parts: RecepyPumpConfig[]
}

export interface RecepyFamily {
    name: RecepyFamilyName;
    ingredients: RecepyIngredient[]
    recepies: Recepy[]
}
