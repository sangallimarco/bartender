import { PumpsUtils } from './pump-utils';
import { RecepyFamily, Recepy } from 'shared-types';
import Lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { cloneDeep } from 'lodash';
import uniqid from 'uniqid';

const DEFAULT_FAMILY = 'default';

enum Collection {
    RECEPIES = 'RECEPIES',
    FAMILIES = 'FAMILIES'
}

interface DBSchema {
    [Collection.RECEPIES]: Recepy[];
    [Collection.FAMILIES]: RecepyFamily[]
}

const DEFAULT_RECEPY: Recepy = {
    id: '',
    label: '',
    recepyFamily: DEFAULT_FAMILY,
    parts: []
}

export class RecepyService {
    private recepyFamily: RecepyFamily;
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
        await this.setFamily(DEFAULT_FAMILY);
    }

    public async setFamily(id: string): Promise<void> {
        const recepyFamily = await this.db.get(Collection.FAMILIES)
            .find({ id })
            .value();
        this.recepyFamily = recepyFamily;
    }

    public async upsertFamily(family: RecepyFamily) {
        const { id } = family;
        const found = await this.db.get(Collection.FAMILIES)
            .find({ id });
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
        const recepy = await this.db.get(Collection.RECEPIES)
            .find({ id })
            .value();
        if (recepy) {
            this.recepy = recepy;
        }
    }

    public async upsertRecepy(recepy: Recepy) {
        const { id } = recepy;
        const found = await this.db.get(Collection.RECEPIES)
            .find({ id });
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

    public async delRecepy(recepy: Recepy) {
        const { id } = recepy;
        await this.db.get(Collection.RECEPIES)
            .remove({ id })
            .write();
    }

    public async createRecepy(): Promise<Recepy> {
        const id = uniqid();
        const parts: number[] = PumpsUtils.generateDefaultParts();
        const cloned: Recepy = cloneDeep(DEFAULT_RECEPY);
        const recepy: Recepy = { ...cloned, id, parts };
        await this.upsertRecepy(recepy);
        return recepy;
    }

    public async getRecepies(): Promise<Recepy[]> {
        if (this.recepyFamily) {
            const { id: recepyFamily } = this.recepyFamily;
            const recepies = await this.db.get(Collection.RECEPIES)
                .filter({ recepyFamily })
                .sortBy('label')
                .value();
            return recepies;
        } else {
            return Promise.resolve([]);
        }
    }

    public async getFamilies(): Promise<RecepyFamily[]> {
        const families = await this.db.get(Collection.FAMILIES)
            .sortBy('label')
            .value();
        return families;
    }

    public async getRecepy(id: string): Promise<Recepy> {
        const recepy = await this.db.get(Collection.RECEPIES)
            .find({ id })
            .value();

        return recepy;
    }

    public setPumps(): Promise<void> {
        if (!this.executing && this.recepy) {
            this.executing = true;
            const { parts } = this.recepy;
            const promises: Array<Promise<void>> = parts.map((quantity: number, indx: number) => {
                return PumpsUtils.activateWithTimer(indx, quantity * 1000);
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

