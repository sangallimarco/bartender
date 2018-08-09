import {
    RecepyFamily, Recepy, RecepyPumpConfig
} from './recepy-types';
import { PumpsUtils } from './pump-utils';
import { RecepyOption } from '../shared';
import { sortBy } from 'lodash';
import Lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

const DEFAULT_FAMILY = 'default';

enum Collection {
    RECEPIES = 'RECEPIES',
    FAMILIES = 'FAMILIES'
}

interface DBSchema {
    [Collection.RECEPIES]: Recepy[];
    [Collection.FAMILIES]: RecepyFamily[]
}

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepies: Recepy[];
    private recepy: Recepy;
    private executing: boolean = false;
    private db: Lowdb.LowdbAsync<DBSchema>;

    constructor() {
        PumpsUtils.init();
    }

    public async initDatabases(): Promise<void> {
        const adapter = new FileAsync<DBSchema>('dbs/recepies', {
            defaultValue: {
                [Collection.RECEPIES]: [],
                [Collection.FAMILIES]: []
            }
        });
        this.db = await Lowdb(adapter);
        await this.setFamily('default');
    }

    public async setFamily(id: string): Promise<void> {
        const recepyFamily = await this.db.get(Collection.FAMILIES)
            .find({ id })
            .value();
        this.recepyFamily = recepyFamily;
    }

    public async upsertFamily(family: RecepyFamily) {
        const { id } = family;
        const found = await this.db.get(Collection.FAMILIES).find({ id });
        if (!found.value()) {
            await this.db.get(Collection.FAMILIES)
                .push(family)
                .write();
        } else {
            await found
                .assign(family)
                .write();
        }
    }

    public async setRecepy(id: string) {
        const recepy = await this.db.get(Collection.RECEPIES).find({ id }).value();
        if (recepy) {
            this.recepy = recepy;
        }
    }

    public async upsertRecepy(recepy: Recepy) {
        const { id } = recepy;
        const found = await this.db.get(Collection.RECEPIES).find({ id });
        if (!found.value()) {
            await this.db.get(Collection.RECEPIES)
                .push(recepy)
                .write();
        } else {
            await found
                .assign(recepy)
                .write();
        }
    }

    public async getRecepies(): Promise<RecepyOption[]> {
        if (this.recepyFamily) {
            const { id: recepyFamily } = this.recepyFamily;
            const recepies = await this.db.get(Collection.RECEPIES)
                .filter({ recepyFamily })
                .sortBy('label')
                .value();
            return recepies.map((recepy: Recepy) => {
                const { id, label } = recepy;
                return { id, label };
            })
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

