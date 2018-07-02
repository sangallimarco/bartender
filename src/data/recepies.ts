import {
    RecepyFamily, Ingredients, RecepyFamilyName
} from '../services/recepy-types';

export const RECEPIES: RecepyFamily[] = [{
    name: RecepyFamilyName.DEFAULT,
    ingredients: [
        Ingredients.RUM, Ingredients.COKE, Ingredients.APEROL, Ingredients.TONIC
    ],
    recepies: [{
        name: 'CubaLibre',
        quantities: [2, 1, 0, 0]
    }]
}];
