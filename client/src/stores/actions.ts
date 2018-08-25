import { createAction } from 'typesafe-actions';
import { EDIT, RECEPIES, Recepy } from '../shared';
import { ActionType } from 'typesafe-actions';

export const RootActions = {
    EDIT: createAction(EDIT, resolve => {
        return (data: Recepy) => resolve(data);
    }),
    RECEPIES: createAction(RECEPIES, resolve => {
        return (data: Recepy[]) => resolve(data);
    })
};

export type RootAction = ActionType<typeof RootActions>;