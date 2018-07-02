import {
    RecepyFamily, Ingredients
} from '../services/recepy-types';

export const RECEPIES: RecepyFamily[] = [{
    name: 'standard',
    ingredients: [
        Ingredients.RUM, Ingredients.COKE, Ingredients.APEROL, Ingredients.TONIC
    ],
    recepies: [{
        name: 'CubaLibre',
        quantities: [2, 1, 0, 0]
    }]
}];
