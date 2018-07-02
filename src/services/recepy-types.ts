export enum PUMPS {
    A, B, C, D, E
}

export enum INGREDIENTS {
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
    name: string;
    ingredients: INGREDIENTS[]
    recepies: Recepy[]
}


const RECEPIES = [{
    name: 'standard',
    pumps: [
        'coca', 'rum', 'tonic', 'aperol'
    ],
    recepies: [{
        name: 'CubaLibre',
        ingredients: [2, 1, 0, 0]
    }]
}];
