import {
    RecepyFamily, Recepy, RecepyPumpConfig
} from './recepy-types';
import { PumpsUtils } from './pump-utils';
import PouchDB from 'pouchdb';

import { RecepyOption } from '../shared';

const DEFAULT_FAMILY = 'default';

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepies: Recepy[];
    private recepy: Recepy;
    private executing: boolean = false;
    private recepiesDb: PouchDB.Database;
    private recepyFamilies: PouchDB.Database;

    constructor() {
        PumpsUtils.init();
    }

    public initDatabases(): Promise<void> {
        this.recepiesDb = new PouchDB('db.recepies');
        this.recepyFamilies = new PouchDB('db.families');
        return this.setFamily('default');
    }

    public setFamily(id: string): Promise<void> {
        return this.recepyFamilies.get<RecepyFamily>(id)
            .then((doc: RecepyFamily) => {
                this.recepyFamily = doc;
                return;
            })
            .catch(e => {
                console.log(e);
            });
    }

    public upsertFamily(family: RecepyFamily): Promise<{}> {
        return this.recepyFamilies.put(family).then(r => {
            console.log(r);
            return r;
        });
    }

    public setRecepy(id: string): void {
        const found = this.recepies.find((recepy: Recepy) => recepy._id === id);
        if (found) {
            this.recepy = found;
        }
    }

    public async upsertRecepy(recepy: Recepy): Promise<{}> {
        return this.recepiesDb.put(recepy);
    }

    public getRecepies(): Promise<RecepyOption[]> {
        if (this.recepyFamily) {
            const { _id: recepyFamilyId } = this.recepyFamily;
            /**
             *  selector: { recepyFamilyId },
                fields: ['_id', 'label'],
                sort: ['label']
             */
            return this.recepiesDb.find({
                selector: { recepyFamilyId },
            }).then((res: PouchDB.Find.FindResponse<RecepyOption>) => {
                return res.docs;
            }).catch(e => {
                console.log(e);
                return e;
            });
        } else {
            return Promise.resolve([]);
        }
    }

    public setPumps(): Promise<void> {
        if (!this.executing && this.recepy) {
            this.executing = true;
            const { parts } = this.recepy;
            const promises: Array<Promise<void>> = parts.map((ingredientPump: RecepyPumpConfig) => {
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

