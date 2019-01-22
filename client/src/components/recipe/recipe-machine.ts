import { assign } from 'xstate-ext/lib/actions';
import { MachineConfig } from 'xstate-ext';
import { StateMachineAction } from 'react-xstate-hoc';
import { Recipe } from 'src/types';

export type RecipeContext = Recipe;

export enum RecipeMachineState {
    EDIT = 'EDIT',
    INIT = 'INIT'
}

export enum RecipeMachineAction {
    SET_ATTRIBUTE = 'SET_ATTRIBUTE',
    SET_LABEL = 'SET_LABEL',
    SET_FAMILY = 'SET_FAMILY',
    SET_DESCRIPTION = 'SET_DESCRIPTION',
    CMD_DELETE = 'CMD_DELETE',
    CMD_EDIT = 'CMD_EDIT',
    SET_PART = 'SET_PART',
    SAVE = 'SAVE',
    SUBMIT = 'SUBMIT',
    CANCEL = 'CANCEL',
    HYDRATE = 'HYDRATE'
}

export interface RecipeMachineStateSchema {
    states: {
        [RecipeMachineState.INIT]: {};
        [RecipeMachineState.EDIT]: {};
    }
}

export type RecipeMachineEvent =
    | { type: RecipeMachineAction.HYDRATE, recipe: Recipe }
    | { type: RecipeMachineAction.SET_LABEL, label: string }
    | { type: RecipeMachineAction.SET_DESCRIPTION, description: string }
    | { type: RecipeMachineAction.SET_FAMILY, recipeFamily: string }
    | { type: RecipeMachineAction.CMD_DELETE, id: string }
    | { type: RecipeMachineAction.CMD_EDIT, recipe: Recipe }
    | { type: RecipeMachineAction.SET_PART, id: string, value: string }
    | { type: RecipeMachineAction.SAVE }
    | { type: RecipeMachineAction.CANCEL };

export type RecipeMachineEventType = StateMachineAction<RecipeContext>;

export enum RecipeMachineService {
    FETCH_DATA = 'FETCH_DATA'
}

export const RecipeStateMachine: MachineConfig<RecipeContext, RecipeMachineStateSchema, RecipeMachineEvent> = {
    id: 'test',
    initial: RecipeMachineState.INIT,
    states: {
        [RecipeMachineState.INIT]: {
            on: {
                [RecipeMachineAction.HYDRATE]: {
                    target: RecipeMachineState.EDIT,
                    actions: assign((ctx, event) => {
                        const { recipe } = event;
                        return { ...recipe };
                    })
                }
            }
        },
        [RecipeMachineState.EDIT]: {
            on: {
                [RecipeMachineAction.SET_LABEL]: {
                    actions: assign((ctx, event) => {
                        const { label } = event;
                        return {
                            label
                        };
                    }),

                },
                [RecipeMachineAction.SET_DESCRIPTION]: {
                    actions: assign((ctx, event) => {
                        const { description } = event;
                        return {
                            description
                        };
                    })
                },
                [RecipeMachineAction.SET_FAMILY]: {
                    actions: assign((ctx, event) => {
                        const { recipeFamily } = event;
                        return {
                            recipeFamily
                        };
                    })
                },
                [RecipeMachineAction.SET_PART]: {
                    actions: assign((ctx, event) => {
                        const { id, value } = event;
                        const parts = [...ctx.parts];
                        parts[id as string] = value;

                        return {
                            parts
                        };
                    })
                },
                [RecipeMachineAction.SAVE]: {
                    actions: RecipeMachineAction.SUBMIT
                }
            }
        }
    }
};

export const RecipeInitialContext: RecipeContext = {
    id: '',
    label: '',
    parts: [],
    description: '',
    recipeFamily: ''
};