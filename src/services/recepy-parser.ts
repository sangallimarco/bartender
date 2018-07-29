import {
    RECEPIES
} from '../data/recepies';
import {
    RecepyFamily, Recepy, RecepyPumpConfig
} from './recepy-types';
import { PumpsUtils } from './pump-utils';
import Nedb from 'nedb';
import { RecepyOption } from '../shared';

export class RecepyService {
    private recepyFamily: RecepyFamily;
    private recepies: Recepy[];
    private recepy: Recepy;
    private executing: boolean = false;
    private recepiesDb: Nedb;
    private recepyFamilies: Nedb;

    constructor() {
        // this.setFamily(RecepyFamilyId.DEFAULT);
        this.recepiesDb = new Nedb({ filename: 'recepies', autoload: true });
        this.recepyFamilies = new Nedb({ filename: 'families', autoload: true });
        PumpsUtils.init();
    }

    public setFamily(id: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.recepyFamilies.findOne<RecepyFamily>({ _id: id }, (err, doc) => {
                if (!err) {
                    this.recepyFamily = doc;
                    resolve();
                }
                reject(err);

            });
        });
    }

    public upsertFamily(family: RecepyFamily): Promise<{}> {
        const { _id } = family;
        return new Promise((resolve, reject) => {
            this.recepyFamilies.update({ _id }, family, { upsert: true }, (err, doc) => {
                if (!err) {
                    resolve(doc);
                }
                reject(err);

            });
        });
    }

    public setRecepy(id: string): void {
        const found = this.recepies.find((recepy: Recepy) => recepy._id === id);
        if (found) {
            this.recepy = found;
        }
    }

    public async upsertRecepy(recepy: Recepy): Promise<{}> {
        const { _id } = this.recepy;
        return new Promise((resolve, reject) => {
            this.recepiesDb.update({ _id }, recepy, { upsert: true }, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        })
    }

    public getRecepies(): Promise<RecepyOption[]> {
        return new Promise<RecepyOption[]>((resolve, reject) => {
            if (this.recepyFamily) {
                const { _id: recepyFamilyId } = this.recepyFamily;
                this.recepiesDb.find({ recepyFamily: recepyFamilyId }, (err, docs) => {
                    if (!err) {
                        this.recepies= [...docs];
                        const recepies = docs.map((recepy: Recepy) => {
                            const { _id, label } = recepy;
                            return { _id, label };
                        })
                        resolve(recepies as RecepyOption[]);
                    } else {
                        reject(err);
                    }
                })
            } else {
                resolve([]);
            }
        });
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

