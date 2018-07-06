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

export interface RecepyIngredientPump {
    pump: Pump;
    parts: number;
}

export interface Recepy {
    name: string;
    pumps: RecepyIngredientPump[]
}

export interface RecepyFamily {
    name: RecepyFamilyName;
    ingredients: RecepyIngredient[]
    recepies: Recepy[]
}
