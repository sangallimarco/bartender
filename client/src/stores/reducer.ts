import { Reducer } from 'redux';
import { Recepy, RecepyFamily, RecepiesPayload, MakePayload, ProcessingPayload, RecepyFamiliesPayload, EDIT, CMD_RECEPIES, CMD_MAKE, RecepyPayload, CMD_FAMILIES } from '../shared';
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
            webSocketService.send(CMD_MAKE, payload as MakePayload);
            return state;
        case getType(RootActions.MAKE):
            const { processing } = payload as ProcessingPayload;
            return { ...state, processing };

        case getType(RootActions.CMD_EDIT):
            const { recepy } = payload as RecepyPayload;
            webSocketService.send(EDIT, recepy);
            return state;
        case getType(RootActions.EDIT):
            // implement something here
            return state;

        case getType(RootActions.SET_RECEPY):
            return { ...state, recepy: payload as Recepy };

        default:
            return state;
    }
};