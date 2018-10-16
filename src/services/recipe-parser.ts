import { PumpsUtils } from './pump-utils';
import { RecipeFamily, Recipe, PumpPin } from '../types';
import Lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { cloneDeep } from 'lodash';
import uniqid from 'uniqid';

const DEFAULT_FAMILY = 'default';

enum Collection {
    recipes = 'recipes',
    FAMILIES = 'FAMILIES'
}

interface DBSchema {
    [Collection.recipes]: Recipe[];
    [Collection.FAMILIES]: RecipeFamily[];
}

const DEFAULT_RECEPY: Recipe = {
    id: '',
    label: '',
    recipeFamily: DEFAULT_FAMILY,
    parts: [],
    description: ''
};

export class RecipeService {
    private recipeFamily: RecipeFamily;
    private recipe: Recipe;
    private executing: boolean = false;
    private db: Lowdb.LowdbAsync<DBSchema>;

    constructor() {
        PumpsUtils.init();
    }

    public async initDatabases(): Promise<void> {
        const adapter = new FileAsync<DBSchema>('dbs/recipes', {
            defaultValue: {
                [Collection.recipes]: [],
                [Collection.FAMILIES]: []
            }
        });
        this.db = await Lowdb(adapter);
        await this.setFamily(DEFAULT_FAMILY);
    }

    public async setFamily(id: string): Promise<void> {
        const recipeFamily = await this.db.get(Collection.FAMILIES)
            .find({ id })
            .value();
        this.recipeFamily = recipeFamily;
    }

    public async upsertFamily(family: RecipeFamily) {
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

    public async upsertRecipe(recipe: Recipe) {
        const { id } = recipe;
        const found = await this.db.get(Collection.recipes)
            .find({ id });
        if (!found.value()) {
            await this.db.get(Collection.recipes)
                .push(recipe)
                .write();
        } else {
            await found
                .assign(recipe)
                .write();

        }
    }

    public async delRecipe(recipe: Recipe) {
        const { id } = recipe;
        await this.db.get(Collection.recipes)
            .remove({ id })
            .write();
    }

    public async createRecipe(): Promise<Recipe> {
        const id = uniqid();
        const parts: number[] = PumpsUtils.generateDefaultParts();
        const cloned: Recipe = cloneDeep(DEFAULT_RECEPY);
        const recipe: Recipe = { ...cloned, id, parts };
        await this.upsertRecipe(recipe);
        return recipe;
    }

    public async getRecepies(): Promise<Recipe[]> {
        if (this.recipeFamily) {
            const { id: recipeFamily } = this.recipeFamily;
            const recipes = await this.db.get(Collection.recipes)
                .filter({ recipeFamily })
                .sortBy('label')
                .value();
            return recipes;
        } else {
            return Promise.resolve([]);
        }
    }

    public async getFamilies(): Promise<RecipeFamily[]> {
        const families = await this.db.get(Collection.FAMILIES)
            .sortBy('label')
            .value();
        return families;
    }

    public setPumps(recipe: Recipe): Promise<void> {
        if (!this.executing && recipe) {
            this.executing = true;
            const { parts } = recipe;
            const promises: Array<Promise<void>> = parts.map((quantity: number, indx: number) => {
                const pin = PumpPin[indx];
                return PumpsUtils.activateWithTimer(pin, quantity * 1000);
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

    public getTotalTime(recipe: Recipe): number {
        if (recipe) {
            const { parts } = recipe;
            if (parts.length > 0) {
                const unsorted = [...parts];
                unsorted.sort();
                return unsorted[0];
            }
        }
        return 0;
    }

}
