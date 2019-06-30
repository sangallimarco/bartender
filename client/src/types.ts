import { ActionType, createAction } from 'typesafe-actions';

export enum ServerActions {
  TEST = 'TEST',
  CMD_MAKE = 'CMD_MAKE',
  PROCESSING = 'PROCESSING',
  CMD_RECIPES = 'CMD_RECIPES',
  RECIPES = 'RECIPES',
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
  CMD_DELETE = 'CMD_DELETE'
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
  [ServerActions.CMD_RECIPES]: createAction(ServerActions.CMD_RECIPES, resolve => () => resolve({})),
  [ServerActions.RECIPES]: createAction(ServerActions.RECIPES, resolve => (data: RecepiesPayload) => resolve(data)),

  [ServerActions.CMD_MAKE]: createAction(ServerActions.CMD_MAKE, resolve => (data: RecipePayload) => resolve(data)),
  [ServerActions.PROCESSING]: createAction(ServerActions.PROCESSING, resolve => (data: ProcessingPayload) => resolve(data)),

  [ServerActions.CMD_FAMILIES]: createAction(ServerActions.CMD_FAMILIES, resolve => () => resolve({})),
  [ServerActions.FAMILIES]: createAction(ServerActions.FAMILIES, resolve => (data: RecipeFamiliesPayload) => resolve(data)),

  [ServerActions.CMD_EDIT]: createAction(ServerActions.CMD_EDIT, resolve => (data: RecipePayload) => resolve(data)),
  [ServerActions.EDIT]: createAction(ServerActions.EDIT, resolve => () => resolve({})),

  [ServerActions.CMD_NEW]: createAction(ServerActions.CMD_NEW, resolve => () => resolve({})),
  [ServerActions.NEW]: createAction(ServerActions.NEW, resolve => (data: RecipePayload) => resolve(data)),

  [ServerActions.CMD_DELETE]: createAction(ServerActions.CMD_DELETE, resolve => (data: RecipeNewPayload) => resolve(data)),

  [ServerActions.SET_RECEPY]: createAction(ServerActions.SET_RECEPY, resolve => (data: Recipe) => resolve(data)),
  [ServerActions.SET_PART]: createAction(ServerActions.SET_PART, resolve => (data: AttributePayload) => resolve(data)),
  [ServerActions.SET_ATTRIBUTE]: createAction(ServerActions.SET_ATTRIBUTE, resolve => (data: AttributePayload) => resolve(data)),
};

export type RootAction = ActionType<typeof RootActions>;
