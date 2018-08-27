import { createAction } from 'typesafe-actions';
import { EDIT, RECEPIES, CMD_RECEPIES, CMD_FAMILIES, FAMILIES, CMD_MAKE, CMD_EDIT, MAKE, MakePayload, RecepyPayload, RecepiesPayload, ProcessingPayload, RecepyFamiliesPayload, Recepy, SET_RECEPY } from '../shared';
import { ActionType } from 'typesafe-actions';

export const RootActions = {
    [CMD_RECEPIES]: createAction(CMD_RECEPIES, resolve => {
        return () => resolve({});
    }),
    [RECEPIES]: createAction(RECEPIES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [CMD_MAKE]: createAction(CMD_MAKE, resolve => {
        return (data: MakePayload) => resolve(data);
    }),
    [MAKE]: createAction(MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [CMD_FAMILIES]: createAction(CMD_FAMILIES, resolve => {
        return () => resolve({});
    }), [FAMILIES]: createAction(RECEPIES, resolve => {
        return (data: RecepyFamiliesPayload) => resolve(data);
    }),

    [CMD_EDIT]: createAction(CMD_EDIT, resolve => {
        return () => resolve({});
    }),
    [EDIT]: createAction(EDIT, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [SET_RECEPY]: createAction(SET_RECEPY, resolve => {
        return (data: Recepy) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;