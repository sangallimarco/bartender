import { Dispatch, Action, AnyAction } from "redux";

export namespace Types {
    export interface Dictionary<T> {
        [key: string]: T;
    }

    export type Collection<T> = T[];
}


export interface ReduxDispatch<T extends Action = AnyAction> {
    dispatch: Dispatch<T>;
}