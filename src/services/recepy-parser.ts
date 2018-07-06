import {
    RECEPIES
} from '../data/recepies';
import {
    RecepyFamily, Recepy, RecepyFamilyName, RecepyIngredientPump
} from './recepy-types';
import { PumpsUtils } from './pump-utils';

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepy: Recepy;
    private executing: boolean = false;

    constructor() {
        this.setFamily(RecepyFamilyName.DEFAULT);
        PumpsUtils.init();
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
    }

    setPumps() {
        if (!this.executing) {
            this.executing = true;
            const { pumps } = this.recepy;
            const promises: Promise<void>[] = pumps.map((ingredientPump: RecepyIngredientPump) => {
                return PumpsUtils.activateWithTimer(ingredientPump.pump, ingredientPump.parts * 1000);
            });
            // wait for all timers to resolve
            Promise.all(promises).then(
                () => this.executing = false
            );
        }
    }
}

