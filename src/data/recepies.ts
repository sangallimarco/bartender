import {
    RecepyFamily, INGREDIENTS
} from '../services/recepy-types';

export const RECEPIES: RecepyFamily[] = [{
    name: 'standard',
    ingredients: [
        INGREDIENTS.RUM, INGREDIENTS.COKE, INGREDIENTS.APEROL, INGREDIENTS.TONIC
    ],
    recepies: [{
        name: 'CubaLibre',
        quantities: [2, 1, 0, 0]
    }]
}];
