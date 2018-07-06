import {
    RecepyFamily, RecepyIngredient, RecepyFamilyId
} from '../services/recepy-types';
import { Pump } from '../services/pump-types';

export const RECEPIES: RecepyFamily[] = [{
    id: RecepyFamilyId.DEFAULT,
    label: 'Default',
    ingredients: [
        RecepyIngredient.RUM, RecepyIngredient.COKE, RecepyIngredient.GIN, RecepyIngredient.TONIC
    ],
    recepies: [{
        id: 'cubalibre',
        label: 'Cuba Libre',
        parts: [
            {
                pump: Pump.A,
                quantity: 2
            },
            {
                pump: Pump.B,
                quantity: 1
            }
        ]
    },
    {
        id: 'gintonic',
        label: 'Gin Tonic',
        parts: [
            {
                pump: Pump.C,
                quantity: 1
            },
            {
                pump: Pump.D,
                quantity: 3
            }
        ]
    }]
}];
