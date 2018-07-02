import {
    RECEPIES
} from '../data/recepies';
import {
    RecepyFamily, Recepy
} from './recepy-types';

export function getRecepies(name: string): RecepyFamily | undefined {
    return RECEPIES.find((family: RecepyFamily) => family.name === name);
}

export function getRecepy(recepies: Recepy[], name: string): Recepy | undefined {
    return recepies.find((recepy: Recepy) => recepy.name === name);
}