import { createAction } from 'typesafe-actions';
import { EDIT, RECEPIES, CMD_RECEPIES, RecepyPayload, RecepiesPayload } from '../shared';
import { ActionType } from 'typesafe-actions';

export const RootActions = {
    [EDIT]: createAction(EDIT, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),
    [CMD_RECEPIES]: createAction(CMD_RECEPIES, resolve => {
        return () => resolve({});
    }),
    [RECEPIES]: createAction(RECEPIES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    })
};

export type RootAction = ActionType<typeof RootActions>;