import { createAction } from 'typesafe-actions';
import { EDIT, RECEPIES, CMD_RECEPIES, CMD_FAMILIES, FAMILIES, CMD_MAKE, CMD_EDIT, MAKE, RecepyPayload, RecepiesPayload, ProcessingPayload, RecepyFamiliesPayload, Recepy, SET_RECEPY, SET_PART, AttributePayload, SET_ATTRIBUTE, CMD_NEW, NEW, CMD_DELETE } from '../shared';
import { ActionType } from 'typesafe-actions';

export const RootActions = {
    [CMD_RECEPIES]: createAction(CMD_RECEPIES, resolve => {
        return () => resolve({});
    }),
    [RECEPIES]: createAction(RECEPIES, resolve => {
        return (data: RecepiesPayload) => resolve(data);
    }),

    [CMD_MAKE]: createAction(CMD_MAKE, resolve => {
        return () => resolve({});
    }),
    [MAKE]: createAction(MAKE, resolve => {
        return (data: ProcessingPayload) => resolve(data);
    }),

    [CMD_FAMILIES]: createAction(CMD_FAMILIES, resolve => {
        return () => resolve({});
    }),
    [FAMILIES]: createAction(FAMILIES, resolve => {
        return (data: RecepyFamiliesPayload) => resolve(data);
    }),

    [CMD_EDIT]: createAction(CMD_EDIT, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),
    [EDIT]: createAction(EDIT, resolve => {
        return () => resolve({});
    }),

    [CMD_NEW]: createAction(CMD_NEW, resolve => {
        return () => resolve({});
    }),
    [NEW]: createAction(NEW, resolve => {
        return (data: RecepyPayload) => resolve(data);
    }),

    [CMD_DELETE]: createAction(CMD_DELETE, resolve => {
        return () => resolve({});
    }),

    [SET_RECEPY]: createAction(SET_RECEPY, resolve => {
        return (data: Recepy) => resolve(data);
    }),
    [SET_PART]: createAction(SET_PART, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
    [SET_ATTRIBUTE]: createAction(SET_ATTRIBUTE, resolve => {
        return (data: AttributePayload) => resolve(data);
    }),
};

export type RootAction = ActionType<typeof RootActions>;