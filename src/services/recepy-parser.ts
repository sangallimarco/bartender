import {
    RECEPIES
} from '../data/recepies';
import {
    RecepyFamily, Recepy, RecepyFamilyName
} from './recepy-types';

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepy: Recepy;

    constructor() {
        this.setFamily(RecepyFamilyName.DEFAULT);
    }

    setFamily(familyName: string): void {
        const found = RECEPIES.find((family: RecepyFamily) => family.name === familyName);
        if (found) {
            this.recepyFamily = found;
        }
    }

    setRecepy(name: string): void {
        const found = this.recepyFamily.recepies.find((recepy: Recepy) => recepy.name === name);
        if (found) {
            this.recepy = found;
        }

        // trigger timers here
    }
}

