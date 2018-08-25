import { combineReducers } from 'redux';
import { RootReducerState, reducer } from './reducer';
import { createStore, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { webSocketService } from '../core/websocket';
import { RootAction, RootActions } from './actions';
export { RootAction, RootActions } from './actions';

export interface RootState {
    root: RootReducerState;
}

const rootReducer = combineReducers<RootState, RootAction>({
    root: reducer // namespace
});

const cwindow = window as any;
// this intercepts actions and send those to websocket
export const emit = (type: string, payload: any) => {
    webSocketService.send(type, payload);
};

const middlewares = [
    ReduxThunk.withExtraArgument({ emit }),
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