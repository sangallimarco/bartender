export enum RoutePath {
    TEST = '/test',
    MAKE = '/make',
    RECEPIES = '/recepies'
}

export interface ProcessingPayload {
    processing: boolean;
}

export interface RecepiesPayload {
    recepies: RecepyOption[];
}

export interface MakePayload {
    id: string;
}

export interface RecepyOption {
    _id: string;
    label: string;
}