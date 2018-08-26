import { createAction } from 'typesafe-actions';
import { EDIT, RECEPIES, CMD_RECEPIES, CMD_MAKE, MAKE, RecepyPayload, RecepiesPayload, ProcessingPayload } from '../shared';
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
    }),
    [CMD_MAKE]: createAction(CMD_MAKE, resolve => {
        return (data: string) => resolve(data);
    }),
    [MAKE]: createAction(MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    })
};

export type RootAction = ActionType<typeof RootActions>;