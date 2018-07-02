export enum Pumps {
    A, B, C, D, E
}

export enum RecepyFamilyName {
    DEFAULT = 'DEFAULT',
    COCKTAIL = 'COCKTAIL'
}

export enum Ingredients {
    COKE = 'COKE',
    RUM = 'RUM',
    TONIC = 'TONIC',
    APEROL = 'APEROL'
}

export interface Recepy {
    name: string;
    quantities: number[]
}

export interface RecepyFamily {
    name: RecepyFamilyName;
    ingredients: Ingredients[]
    recepies: Recepy[]
}
