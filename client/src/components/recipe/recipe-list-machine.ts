import { assign, send, log } from 'xstate-ext/lib/actions';
import { MachineConfig, EventObject } from 'xstate-ext';
import { StateMachineAction } from 'react-xstate-hoc';
import { Recipe, RecipeFamily, Actions } from 'src/types';
import { webSocketService } from 'src/core/websocket';

export interface RecipeListContext {
    family: string;
    families: RecipeFamily[];
    recipes: Recipe[];
    message: string;
    admin: boolean;
    recipeId: string;
}

export enum RecipeListMachineState {
    LIST = 'LIST',
    PROCESSING = 'PROCESSING',
    EDIT = 'EDIT',
    CONFIRMATION = 'CONFIRMATION'
}

export enum RecipeListMachineAction {
    FETCH_RECIPES = 'FETCH_RECIPES',
    // RECIPES = 'RECIPES',
    FETCH_FAMILIES = 'FETCH_FAMILIES',
    // FAMILIES = 'FAMILIES',
    MAKE = 'MAKE',
    // PROCESSING = 'PROCESSING',
    DONE = 'DONE',
    CANCEL = 'CANCEL',
    CREATE = 'CREATE',
    SET_RECIPE = 'SET_RECIPE',
    NULL = 'NULL',
    SET_ADMIN = 'SET_ADMIN'
}

export interface RecipeListMachineStateSchema {
    states: {
        [RecipeListMachineState.LIST]: {};
        [RecipeListMachineState.PROCESSING]: {};
        [RecipeListMachineState.CONFIRMATION]: {};
    }
}

export type RecipeListMachineEvent =
    | { type: RecipeListMachineAction.FETCH_RECIPES }
    | { type: Actions.SRV_RECIPES, recipes: Recipe[] }
    | { type: RecipeListMachineAction.FETCH_FAMILIES }
    | { type: Actions.SRV_FAMILIES, families: RecipeFamily[] }
    | { type: RecipeListMachineAction.SET_RECIPE, recipe: Recipe }
    | { type: RecipeListMachineAction.MAKE }
    | { type: Actions.SRV_PROCESSING, processing: boolean, total: number }
    | { type: RecipeListMachineAction.DONE }
    | { type: RecipeListMachineAction.NULL }
    | { type: RecipeListMachineAction.SET_ADMIN }
    | { type: RecipeListMachineAction.CREATE }
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
                [RecipeListMachineAction.FETCH_RECIPES]: {
                    actions: [
                        log(() => 'CMD_RECIPES'),
                        () => {
                            webSocketService.send(Actions.SRV_CMD_RECIPES, {});
                        },
                    ]
                },
                [RecipeListMachineAction.FETCH_FAMILIES]: {
                    actions: [
                        log(() => 'CMD_FAMILIES'),
                        () => {
                            webSocketService.send(Actions.SRV_CMD_FAMILIES, {});
                        },
                    ]
                },
                [Actions.SRV_RECIPES]: {
                    actions: assign((cxt, event) => {
                        const { recipes } = event;
                        return {
                            recipes
                        }
                    })
                },
                [Actions.SRV_FAMILIES]: {
                    actions: assign((cxt, event) => {
                        const { families } = event;
                        return {
                            families
                        }
                    })
                },
                [RecipeListMachineAction.CREATE]: {
                    actions: () => {
                        webSocketService.send(Actions.SRV_CMD_NEW, {});
                    }
                },
                [RecipeListMachineAction.SET_ADMIN]: {
                    actions: assign((ctx) => {
                        return { admin: !ctx.admin };
                    })
                },
                [RecipeListMachineAction.SET_RECIPE]: {
                    target: RecipeListMachineState.CONFIRMATION,
                    actions: assign((ctx, event) => {
                        const { recipe } = event;
                        const { label, id: recipeId } = recipe;
                        const message = `Confirm ${label}?`;

                        return {
                            recipeId,
                            message
                        }
                    })
                },
            }
        },
        [RecipeListMachineState.CONFIRMATION]: {
            on: {
                [RecipeListMachineAction.MAKE]: {
                    target: RecipeListMachineState.PROCESSING,
                    actions: (ctx) => {
                        const recipe = ctx.recipes.find(r => r.id === ctx.recipeId);
                        if (recipe) {
                            webSocketService.send(Actions.SRV_CMD_MAKE, { recipe });
                        }
                    }
                },
                [RecipeListMachineAction.CANCEL]: {
                    target: RecipeListMachineState.LIST
                }
            }
        },
        [RecipeListMachineState.PROCESSING]: {
            on: {
                [Actions.SRV_PROCESSING]: {
                    actions: send((ctx, event) => {
                        const { processing } = event as EventObject;
                        if (!processing) {
                            return { type: RecipeListMachineAction.DONE };
                        }
                        return { type: RecipeListMachineAction.NULL };
                    })
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
    recipeId: ''
};