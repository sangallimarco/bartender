import { Reducer } from 'redux';
import { Recepy, EDIT } from '../shared';
import { RootAction, RootActions } from './actions';
import { webSocketService } from '../core/websocket';
import { getType } from 'typesafe-actions';

export interface RootReducerState {
    recepies: Recepy[];
    family: string;
}

const initialState: RootReducerState = {
    recepies: [],
    family: 'default'
}

export const reducer: Reducer<RootReducerState> = (
    state = initialState,
    action: RootAction
): RootReducerState => {

    const { payload, type } = action;
    switch (type) {
        case getType(RootActions.RECEPIES):
            const recepies = payload as Recepy[]; ///?????
            return { ...state, recepies };
        case getType(RootActions.EDIT):
            webSocketService.send(EDIT, payload);
            return { ...state };
        default:
            return state;
    }
};