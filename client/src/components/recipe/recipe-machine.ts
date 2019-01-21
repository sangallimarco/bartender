import { assign } from 'xstate-ext/lib/actions';
import { MachineConfig } from 'xstate-ext';
import { StateMachineAction } from 'react-xstate-hoc';
import { Recipe, RecipeFamily } from 'src/types';

export interface RecipeContext {
    id: string;
    recipe: Recipe;
    families: RecipeFamily[];
}

export enum RecipeMachineState {
    EDIT = 'EDIT'
}

export enum RecipeMachineAction {
    SET_ATTRIBUTE = 'SET_ATTRIBUTE',
    CMD_DELETE = 'CMD_DELETE',
    CMD_EDIT = 'CMD_EDIT',
    SET_PART = 'SET_PART',
    EXIT = 'EXIT'
}

export interface RecipeMachineStateSchema {
    states: {
        [RecipeMachineState.EDIT]: {};
    }
}

export type RecipeMachineEvent =
    | { type: RecipeMachineAction.SET_ATTRIBUTE, id: string, value: string }
    | { type: RecipeMachineAction.CMD_DELETE, id: string }
    | { type: RecipeMachineAction.CMD_EDIT, recipe: Recipe }
    | { type: RecipeMachineAction.SET_PART, id: string, value: string }
    | { type: RecipeMachineAction.EXIT };

export type RecipeMachineEventType = StateMachineAction<RecipeContext>;

export enum RecipeMachineService {
    FETCH_DATA = 'FETCH_DATA'
}

export const RecipeStateMachine: MachineConfig<RecipeContext, RecipeMachineStateSchema, RecipeMachineEvent> = {
    id: 'test',
    initial: RecipeMachineState.EDIT,
    states: {
        [RecipeMachineState.EDIT]: {
            on: {
                [RecipeMachineAction.SET_ATTRIBUTE]: {
                    actions: assign((ctx, event) => {
                        const { id, value } = event;
                        const key = id as any; // FIXME
                        const recipe = { ...ctx.recipe, [key]: value } as Recipe;
                        return {
                            recipe
                        };
                    })
                }
            }
        }
    }
};

export const RecipeInitialContext: RecipeContext = {
    id: '',
    recipe: {
        id: '',
        recipeFamily: '',
        label: '',
        parts: [],
        description: ''
    },
    families: []
};