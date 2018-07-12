export namespace Types {
    export interface Dictionary<T> {
        [key: string]: T;
    }

    export type Collection<T> = T[];
}
