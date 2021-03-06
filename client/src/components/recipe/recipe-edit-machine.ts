import { assign } from 'xstate-ext/lib/actions';
import { MachineConfig } from 'xstate-ext';
import { StateMachineAction } from 'react-xstate-hoc';
import { Recipe, ServerActions, PumpPin } from '../..//types';
import { v4 } from 'uuid';

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
    DELETE = 'DELETE',
    CMD_EDIT = 'CMD_EDIT',
    SET_PART = 'SET_PART',
    SAVE = 'SAVE',
    SUBMIT = 'SUBMIT',
    CANCEL = 'CANCEL',
    HYDRATE = 'HYDRATE',
    CREATE = 'CREATE'
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
    | { type: RecipeMachineAction.DELETE }
    | { type: RecipeMachineAction.CMD_EDIT, recipe: Recipe }
    | { type: RecipeMachineAction.SET_PART, id: string, value: string }
    | { type: RecipeMachineAction.SAVE }
    | { type: RecipeMachineAction.CREATE }
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
                },
                [RecipeMachineAction.CREATE]: {
                    target: RecipeMachineState.EDIT,
                    actions: assign(() => {
                        return { id: v4() };
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
                        parts[id as string] = parseInt(value, 10);

                        return {
                            parts
                        };
                    })
                },
                [RecipeMachineAction.SAVE]: {
                    actions: ServerActions.CMD_EDIT
                },
                [RecipeMachineAction.DELETE]: {
                    actions: ServerActions.CMD_DELETE
                }
            }
        }
    }
};

// parts from pump array
const defaultParts = PumpPin.map(() => 1);

export const RecipeInitialContext: RecipeContext = {
    id: '',
    label: '',
    parts: [...defaultParts],
    description: '',
    recipeFamily: 'default'
};