import { Reducer } from 'redux';
import { Recipe, RecipeFamily, Actions } from '../types';
import { RootAction, RootActions } from '../types';
import { webSocketService } from '../core/websocket';
import { getType } from 'typesafe-actions';

export interface RootReducerState {
    family: string;
    families: RecipeFamily[];
    processing: boolean;
    recipe: Recipe | null;
    recipes: Recipe[];
}

const initialState: RootReducerState = {
    family: 'default',
    families: [],
    processing: false,
    recipe: null,
    recipes: []
};

export const reducer: Reducer<RootReducerState> = (
    state = initialState,
    action: RootAction
): RootReducerState => {
    switch (action.type) {
        case getType(RootActions.CMD_RECEPIES):
            webSocketService.send(Actions.CMD_RECEPIES, {});
            return state;
        case getType(RootActions.recipes):
            const { recipes } = action.payload;
            return { ...state, recipes };

        case getType(RootActions.CMD_FAMILIES):
            webSocketService.send(Actions.CMD_FAMILIES, {});
            return state;
        case getType(RootActions.FAMILIES):
            const { families } = action.payload;
            return { ...state, families };

        case getType(RootActions.CMD_MAKE):
            if (action.payload.recipe !== null) {
                webSocketService.send(Actions.CMD_MAKE, action.payload);
            }
            return state;
        case getType(RootActions.MAKE):
            const { processing } = action.payload;
            return { ...state, processing };

        case getType(RootActions.CMD_EDIT):
            webSocketService.send(Actions.CMD_EDIT, action.payload);
            return state;

        case getType(RootActions.CMD_NEW):
            webSocketService.send(Actions.CMD_NEW, {});
            return state;
        case getType(RootActions.NEW):
            const { recipe: newRecipe } = action.payload;
            return { ...state, recipe: newRecipe };

        case getType(RootActions.CMD_DELETE):
            const { recipe: deleteRecipe } = state;
            webSocketService.send(Actions.CMD_DELETE, { recipe: deleteRecipe });
            return { ...state, recipe: null };

        case getType(RootActions.SET_RECEPY):
            return { ...state, recipe: action.payload };

        case getType(RootActions.SET_PART):
            const { id, value } = action.payload;
            if (state.recipe) {
                const indx = +id;
                const quantity = +value;
                const { parts } = state.recipe;
                parts.splice(indx, 1, quantity);
                return { ...state, recipe: { ...state.recipe, parts } };
            }
            return state;

        case getType(RootActions.SET_ATTRIBUTE):
            const { id: attributeKey, value: attributeValue } = action.payload;
            const modifiedRecipe = { ...state.recipe, [attributeKey]: attributeValue } as Recipe;
            return { ...state, recipe: modifiedRecipe };

        default:
            return state;
    }
};