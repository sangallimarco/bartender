import { ActionType, createAction } from 'typesafe-actions';

export enum Actions {
    TEST = 'TEST',
    CMD_MAKE = 'CMD_MAKE',
    MAKE = 'MAKE',
    CMD_RECEPIES = 'CMD_RECEPIES',
    recipes = 'recipes',
    CMD_NEW = 'CMD_NEW',
    NEW = 'NEW',
    CMD_EDIT = 'CMD_EDIT',
    EDIT = 'EDIT',
    GET = 'GET',
    CMD_FAMILIES = 'CMD_FAMILIES',
    FAMILIES = 'FAMILIES',
    SET_RECEPY = 'SET_RECEPY',
    SET_PART = 'SET_PART',
    SET_ATTRIBUTE = 'SET_ATTRIBUTE',
    CMD_DELETE = 'CMD_DELETE',
}

export interface ProcessingPayload {
    processing: boolean;
    total: number;
}

export interface RecipePayload {
    recipe: Recipe;
}

export interface RecipeNewPayload {
    id: string;
}

export interface RecipeFamiliesPayload {
    families: RecipeFamily[];
}

export interface RecepiesPayload {
    recipes: Recipe[];
}

export interface MakePayload {
    id: string;
}

export interface GetPayload {
    id: string;
}

export interface AttributePayload {
    id: string;
    value: string;
}

export interface Recipe {
    id: string;
    recipeFamily: string;
    label: string;
    parts: number[];
    description: string;
}

export interface RecipeFamily {
    id: string;
    label: string;
    ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
    label: string;
    color: string;
}

export const PumpPin = [
    7,
    11,
    12,
    13,
    // 15
];

// export enum Pump {
//     A = PumpPin[0], // GPIO-4
//     B = PumpPin[1], // GPIO-17
//     C = PumpPin[2], // GPIO-18
//     D = PumpPin[3], // GPIO-27
//     // E = PumpPin[4] // GPIO-22
// }

// @TODO refactor this

export const RootActions = {
    [Actions.CMD_RECEPIES]: createAction(Actions.CMD_RECEPIES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [Actions.recipes]: createAction(Actions.recipes, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [Actions.CMD_MAKE]: createAction(Actions.CMD_MAKE, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),
    [Actions.MAKE]: createAction(Actions.MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [Actions.CMD_FAMILIES]: createAction(Actions.CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [Actions.FAMILIES]: createAction(Actions.FAMILIES, resolve => {
        return (data: RecipeFamiliesPayload) => resolve(data);
    }),

    [Actions.CMD_EDIT]: createAction(Actions.CMD_EDIT, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),
    [Actions.EDIT]: createAction(Actions.EDIT, resolve => {
        return () => resolve({});
    }),

    [Actions.CMD_NEW]: createAction(Actions.CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [Actions.NEW]: createAction(Actions.NEW, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),

    [Actions.CMD_DELETE]: createAction(Actions.CMD_DELETE, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),

    [Actions.SET_RECEPY]: createAction(Actions.SET_RECEPY, resolve => {
        return (data: Recipe) => resolve(data);
    }),
    [Actions.SET_PART]: createAction(Actions.SET_PART, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
    [Actions.SET_ATTRIBUTE]: createAction(Actions.SET_ATTRIBUTE, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;
