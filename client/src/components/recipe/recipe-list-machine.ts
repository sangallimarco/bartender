import { assign, raise, log } from 'xstate-ext/lib/actions';
import { MachineConfig, EventObject } from 'xstate-ext';
import { StateMachineAction } from 'react-xstate-hoc';
import { Recipe, RecipeFamily } from 'src/types';
import { webSocketService } from 'src/core/websocket';

export interface RecipeListContext {
    family: string;
    families: RecipeFamily[];
    recipes: Recipe[];
    message: string;
    admin: boolean;
    recipe: Recipe;
}

export enum RecipeListMachineState {
    LIST = 'LIST',
    PROCESSING = 'PROCESSING',
    EDIT = 'EDIT',
    CONFIRMATION = 'CONFIRMATION'
}

export enum RecipeListMachineAction {
    CMD_RECIPES = 'CMD_RECIPES',
    RECIPES = 'RECIPES',
    CMD_FAMILIES = 'CMD_FAMILIES',
    FAMILIES = 'FAMILIES',
    CMD_MAKE = 'CMD_MAKE',
    MAKE = 'MAKE',
    DONE = 'DONE',
    CANCEL = 'CANCEL',
    CMD_NEW = 'CMD_NEW',
    SET_RECIPE = 'SET_RECIPE'
}

export interface RecipeListMachineStateSchema {
    states: {
        [RecipeListMachineState.LIST]: {};
        [RecipeListMachineState.PROCESSING]: {};
        [RecipeListMachineState.CONFIRMATION]: {};
    }
}

export type RecipeListMachineEvent =
    | { type: RecipeListMachineAction.CMD_RECIPES }
    | { type: RecipeListMachineAction.RECIPES, recipes: Recipe[] }
    | { type: RecipeListMachineAction.CMD_FAMILIES }
    | { type: RecipeListMachineAction.FAMILIES, families: RecipeFamily[] }
    | { type: RecipeListMachineAction.SET_RECIPE, recipe: Recipe }
    | { type: RecipeListMachineAction.CMD_MAKE }
    | { type: RecipeListMachineAction.MAKE, processing: boolean, total: number }
    | { type: RecipeListMachineAction.DONE }
    | { type: RecipeListMachineAction.CMD_NEW }
    | { type: RecipeListMachineAction.CANCEL };

export type RecipeListMachineEventType = StateMachineAction<RecipeListContext>;

export enum RecipeMachineService {
    FETCH_DATA = 'FETCH_DATA'
}

export const RecipeListStateMachine: MachineConfig<RecipeListContext, RecipeListMachineStateSchema, RecipeListMachineEvent> = {
    id: 'test',
    initial: RecipeListMachineState.LIST,
    states: {
        [RecipeListMachineState.LIST]: {
            on: {
                [RecipeListMachineAction.CMD_RECIPES]: {
                    actions: [
                        log(() => 'CMD_RECIPES'),
                        () => {
                            webSocketService.send(RecipeListMachineAction.CMD_RECIPES, {});
                        },
                    ]
                },
                [RecipeListMachineAction.CMD_FAMILIES]: {
                    actions: [
                        log(() => 'CMD_FAMILIES'),
                        () => {
                            webSocketService.send(RecipeListMachineAction.CMD_FAMILIES, {});
                        },
                    ]
                },
                [RecipeListMachineAction.RECIPES]: {
                    actions: assign((cxt, event) => {
                        const { recipes } = event;
                        return {
                            recipes
                        }
                    })
                },
                [RecipeListMachineAction.FAMILIES]: {
                    actions: assign((cxt, event) => {
                        const { families } = event;
                        return {
                            families
                        }
                    })
                },
                [RecipeListMachineAction.CMD_NEW]: {
                    actions: (ctx, event) => {
                        webSocketService.send(RecipeListMachineAction.CMD_NEW, {});
                    }
                },
                [RecipeListMachineAction.SET_RECIPE]: {
                    target: RecipeListMachineState.CONFIRMATION,
                    actions: assign((ctx, event) => {
                        const { recipe } = event;
                        const { label } = recipe;
                        const message = `Confirm ${label}?`;

                        return {
                            recipe,
                            message
                        }
                    })
                },
            }
        },
        [RecipeListMachineState.CONFIRMATION]: {
            on: {
                [RecipeListMachineAction.CMD_MAKE]: {
                    target: RecipeListMachineState.PROCESSING,
                    actions: (ctx, event) => {
                        const { recipe } = ctx;
                        webSocketService.send(RecipeListMachineAction.CMD_MAKE, recipe);
                    }
                },
                [RecipeListMachineAction.CANCEL]: {
                    target: RecipeListMachineState.LIST
                }
            }
        },
        [RecipeListMachineState.PROCESSING]: {
            on: {
                [RecipeListMachineAction.MAKE]: {
                    actions: (ctx, event) => {
                        const { processing } = event as EventObject;
                        if (!processing) {
                            raise(RecipeListMachineAction.DONE);
                        }
                    }
                },
                [RecipeListMachineAction.DONE]: {
                    target: RecipeListMachineState.LIST
                }
            }
        }
    }
};

export const RecipeListInitialContext: RecipeListContext = {
    family: '',
    families: [],
    recipes: [],
    message: '',
    admin: false,
    recipe: {
        id: '',
        recipeFamily: '',
        label: '',
        parts: [],
        description: ''
    },
};