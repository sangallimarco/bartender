import { Reducer } from 'redux';
import { Recepy, RecepiesPayload, EDIT, CMD_RECEPIES } from '../shared';
import { RootAction, RootActions } from './actions';
import { webSocketService } from '../core/websocket';
import { getType } from 'typesafe-actions';

export interface RootReducerState {
    family: string;
    recepies: Recepy[];
}

const initialState: RootReducerState = {
    family: 'default',
    recepies: []
}

export const reducer: Reducer<RootReducerState> = (
    state = initialState,
    action: RootAction
): RootReducerState => {

    const { payload, type } = action;
    switch (type) {
        case getType(RootActions.CMD_RECEPIES):
            webSocketService.send<{}>(CMD_RECEPIES, payload);
            return state;
        case getType(RootActions.RECEPIES):
            const { recepies } = payload as RecepiesPayload;
            return { ...state, recepies };
        case getType(RootActions.EDIT):
            webSocketService.send(EDIT, payload);
            return { ...state };
        default:
            return state;
    }
};