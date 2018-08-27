import { Reducer } from 'redux';
import { Recepy, RecepyFamily, RecepiesPayload, MakePayload, ProcessingPayload, RecepyFamiliesPayload, CMD_RECEPIES, CMD_MAKE, RecepyPayload, CMD_FAMILIES, AttributePayload, CMD_EDIT, CMD_NEW } from '../shared';
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
    const { payload, type } = action;

    switch (type) {
        case getType(RootActions.CMD_RECEPIES):
            webSocketService.send(CMD_RECEPIES, {});
            return state;
        case getType(RootActions.RECEPIES):
            const { recepies } = payload as RecepiesPayload;
            return { ...state, recepies };

        case getType(RootActions.CMD_FAMILIES):
            webSocketService.send(CMD_FAMILIES, {});
            return state;
        case getType(RootActions.FAMILIES):
            const { families } = payload as RecepyFamiliesPayload;
            return { ...state, families };

        case getType(RootActions.CMD_MAKE):
            const { recepy } = state;
            if (recepy) {
                const { id: recepyId } = recepy as Recepy;
                const message: MakePayload = { id: recepyId };
                webSocketService.send(CMD_MAKE, message);
            }
            return state;
        case getType(RootActions.MAKE):
            const { processing } = payload as ProcessingPayload;
            return { ...state, processing };

        case getType(RootActions.CMD_EDIT):
            webSocketService.send(CMD_EDIT, payload as RecepyPayload);
            return state;

        case getType(RootActions.CMD_NEW):
            webSocketService.send(CMD_NEW, {});
            return state;
        case getType(RootActions.NEW):
            const { recepy: newRecepy } = payload as RecepyPayload;
            return { ...state, recepy: newRecepy };

        case getType(RootActions.SET_RECEPY):
            return { ...state, recepy: payload as Recepy };

        case getType(RootActions.SET_PART):
            const { id, value } = payload as AttributePayload;
            if (state.recepy) {
                const indx = +id;
                const quantity = +value;
                const { parts } = state.recepy;
                parts.splice(indx, 1, quantity);
                return { ...state, recepy: { ...state.recepy, parts } };
            }
            return state;

        case getType(RootActions.SET_ATTRIBUTE):
            const { id: attributeKey, value: attributeValue } = payload as AttributePayload;
            const modifiedRecepy = { ...state.recepy, [attributeKey]: attributeValue } as Recepy;
            return { ...state, recepy: modifiedRecepy };

        default:
            return state;
    }
};