import { ActionType, createAction } from 'typesafe-actions';

export enum Actions {
    SRV_TEST = 'SRV_TEST',
    SRV_CMD_MAKE = 'SRV_CMD_MAKE',
    SRV_PROCESSING = 'SRV_PROCESSING',
    SRV_CMD_RECIPES = 'SRV_CMD_RECIPES',
    SRV_RECIPES = 'SRV_RECIPES',
    SRV_CMD_NEW = 'SRV_CMD_NEW',
    SRV_NEW = 'SRV_NEW',
    SRV_CMD_EDIT = 'SRV_CMD_EDIT',
    SRV_EDIT = 'SRV_EDIT',
    SRV_GET = 'SRV_GET',
    SRV_CMD_FAMILIES = 'SRV_CMD_FAMILIES',
    SRV_FAMILIES = 'SRV_FAMILIES',
    SRV_SET_RECEPY = 'SRV_SET_RECEPY',
    SRV_SET_PART = 'SRV_SET_PART',
    SRV_SET_ATTRIBUTE = 'SRV_SET_ATTRIBUTE',
    SRV_CMD_DELETE = 'SRV_CMD_DELETE',
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
    [Actions.SRV_CMD_RECIPES]: createAction(Actions.SRV_CMD_RECIPES, resolve => {
        return () => {
            return resolve({});
        };
    }),
    [Actions.SRV_RECIPES]: createAction(Actions.SRV_RECIPES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [Actions.SRV_CMD_MAKE]: createAction(Actions.SRV_CMD_MAKE, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),
    [Actions.SRV_PROCESSING]: createAction(Actions.SRV_PROCESSING, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [Actions.SRV_CMD_FAMILIES]: createAction(Actions.SRV_CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [Actions.SRV_FAMILIES]: createAction(Actions.SRV_FAMILIES, resolve => {
        return (data: RecipeFamiliesPayload) => resolve(data);
    }),

    [Actions.SRV_CMD_EDIT]: createAction(Actions.SRV_CMD_EDIT, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),
    [Actions.SRV_EDIT]: createAction(Actions.SRV_EDIT, resolve => {
        return () => resolve({});
    }),

    [Actions.SRV_CMD_NEW]: createAction(Actions.SRV_CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [Actions.SRV_NEW]: createAction(Actions.SRV_NEW, resolve => {
        return (data: RecipePayload) => resolve(data);
    }),

    [Actions.SRV_CMD_DELETE]: createAction(Actions.SRV_CMD_DELETE, resolve => {
        return (data: RecipeNewPayload) => resolve(data);
    }),

    [Actions.SRV_SET_RECEPY]: createAction(Actions.SRV_SET_RECEPY, resolve => {
        return (data: Recipe) => resolve(data);
    }),
    [Actions.SRV_SET_PART]: createAction(Actions.SRV_SET_PART, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
    [Actions.SRV_SET_ATTRIBUTE]: createAction(Actions.SRV_SET_ATTRIBUTE, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;
