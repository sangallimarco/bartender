import { Reducer } from 'redux';
import { Recepy, RecepyFamily, MakePayload, CMD_MAKE, CMD_FAMILIES, CMD_EDIT, CMD_NEW, CMD_DELETE } from '../types';
import { RootAction, RootActions } from './actions';
import { webSocketService } from '../core/websocket';
import { getType } from 'typesafe-actions';

export interface RootReducerState {
    family: string;
    families: RecepyFamily[];
    processing: boolean;
    recepy: Recepy | null;
    recepies: Recepy[];
}

const initialState: RootReducerState = {
    family: 'default',
    families: [],
    processing: false,
    recepy: null,
    recepies: []
};

export const reducer: Reducer<RootReducerState> = (
    state = initialState,
    action: RootAction
): RootReducerState => {
    switch (action.type) {
        // case getType(RootActions.CMD_RECEPIES):
        //     webSocketService.send(CMD_RECEPIES, {});
        //     return state;
        case getType(RootActions.RECEPIES):
            const { recepies } = action.payload;
            return { ...state, recepies };

        case getType(RootActions.CMD_FAMILIES):
            webSocketService.send(CMD_FAMILIES, {});
            return state;
        case getType(RootActions.FAMILIES):
            const { families } = action.payload;
            return { ...state, families };

        case getType(RootActions.CMD_MAKE):
            const { recepy } = state;
            if (recepy !== null) {
                const { id: recepyId } = recepy;
                const message: MakePayload = { id: recepyId };
                webSocketService.send(CMD_MAKE, message);
            }
            return state;
        case getType(RootActions.MAKE):
            const { processing } = action.payload;
            return { ...state, processing };

        case getType(RootActions.CMD_EDIT):
            webSocketService.send(CMD_EDIT, action.payload);
            return state;

        case getType(RootActions.CMD_NEW):
            webSocketService.send(CMD_NEW, {});
            return state;
        case getType(RootActions.NEW):
            const { recepy: newRecepy } = action.payload;
            return { ...state, recepy: newRecepy };

        case getType(RootActions.CMD_DELETE):
            const { recepy: deleteRecepy } = state;
            webSocketService.send(CMD_DELETE, { recepy: deleteRecepy });
            return { ...state, recepy: null };

        case getType(RootActions.SET_RECEPY):
            return { ...state, recepy: action.payload };

        case getType(RootActions.SET_PART):
            const { id, value } = action.payload;
            if (state.recepy) {
                const indx = +id;
                const quantity = +value;
                const { parts } = state.recepy;
                parts.splice(indx, 1, quantity);
                return { ...state, recepy: { ...state.recepy, parts } };
            }
            return state;

        case getType(RootActions.SET_ATTRIBUTE):
            const { id: attributeKey, value: attributeValue } = action.payload;
            const modifiedRecepy = { ...state.recepy, [attributeKey]: attributeValue } as Recepy;
            return { ...state, recepy: modifiedRecepy };

        default:
            return state;
    }
};