import {
    RECEPIES
} from '../data/recepies';
import {
    RecepyFamily, Recepy, RecepyFamilyId, RecepyPumpConfig
} from './recepy-types';
import { PumpsUtils } from './pump-utils';

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepy: Recepy;
    private executing: boolean = false;

    constructor() {
        this.setFamily(RecepyFamilyId.DEFAULT);
        PumpsUtils.init();
    }

    setFamily(id: RecepyFamilyId): void {
        const found = RECEPIES.find((family: RecepyFamily) => family.id === id);
        if (found) {
            this.recepyFamily = found;
        }
    }

    setRecepy(name: string): void {
        const found = this.recepyFamily.recepies.find((recepy: Recepy) => recepy.label === name);
        if (found) {
            this.recepy = found;
        }
    }

    setPumps(): Promise<void> {
        if (!this.executing) {
            this.executing = true;
            const { parts } = this.recepy;
            const promises: Promise<void>[] = parts.map((ingredientPump: RecepyPumpConfig) => {
                return PumpsUtils.activateWithTimer(ingredientPump.pump, ingredientPump.quantity * 1000);
            });
            // wait for all timers to resolve
            return Promise.all(promises).then(
                () => {
                    this.executing = false;
                    return;
                }
            );
        }
    }
}

