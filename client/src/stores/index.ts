import { combineReducers } from 'redux';
import { RootReducerState, reducer } from './reducer';
import { createStore, compose } from 'redux';
// import ReduxThunk from 'redux-thunk';
import { webSocketService } from '../core/websocket';
import { RootAction, RootActions } from '../types';

export interface RootState {
    root: RootReducerState;
}

const rootReducer = combineReducers<RootState, RootAction>({
    root: reducer // namespace
});


// inject function emit as extra argument in trunk
export const emit = (type: string, payload: any) => {
    webSocketService.send(type, payload);
};

const cwindow = window as any;
const middlewares = [
    // ReduxThunk.withExtraArgument({ emit }),
    cwindow.__REDUX_DEVTOOLS_EXTENSION__ && cwindow.__REDUX_DEVTOOLS_EXTENSION__()
];

export const store = createStore(
    rootReducer,
    compose(
        ...middlewares
    )
);

// auto bind actions
webSocketService.bindActions(RootActions, store);

store.dispatch(RootActions.CMD_FAMILIES());
store.dispatch(RootActions.CMD_RECEPIES());