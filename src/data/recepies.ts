import {
    RecepyFamily, RecepyIngredient, RecepyFamilyName
} from '../services/recepy-types';
import { Pump } from '../services/pump-types';

export const RECEPIES: RecepyFamily[] = [{
    name: RecepyFamilyName.DEFAULT,
    ingredients: [
        RecepyIngredient.RUM, RecepyIngredient.COKE, RecepyIngredient.APEROL, RecepyIngredient.TONIC
    ],
    recepies: [{
        name: 'CubaLibre',
        pumps: [
            {
                pump: Pump.A,
                parts: 2
            },
            {
                pump: Pump.B,
                parts: 1
            }
        ]
    }]
}];
