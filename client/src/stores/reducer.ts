import { Reducer } from 'redux';
import { Recepy, RecepiesPayload, MakePayload, ProcessingPayload, EDIT, CMD_RECEPIES, CMD_MAKE } from '../shared';
import { RootAction, RootActions } from './actions';
import { webSocketService } from '../core/websocket';
import { getType } from 'typesafe-actions';

export interface RootReducerState {
    family: string;
    processing: boolean;
    recepies: Recepy[];
}

const initialState: RootReducerState = {
    family: 'default',
    processing: false,
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
        case getType(RootActions.CMD_MAKE):
            webSocketService.send(CMD_MAKE, payload as MakePayload);
            return state;
        case getType(RootActions.MAKE):
            const { processing } = payload as ProcessingPayload;
            return { ...state, processing };
        case getType(RootActions.EDIT):
            webSocketService.send(EDIT, payload);
            return state;
        default:
            return state;
    }
};