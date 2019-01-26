"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pump_utils_1 = require("./pump-utils");
const types_1 = require("../types");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const lodash_1 = require("lodash");
const uniqid_1 = __importDefault(require("uniqid"));
const DEFAULT_FAMILY = 'default';
var Collection;
(function (Collection) {
    Collection["recipes"] = "recipes";
    Collection["FAMILIES"] = "FAMILIES";
})(Collection || (Collection = {}));
const DEFAULT_RECEPY = {
    id: '',
    label: '',
    recipeFamily: DEFAULT_FAMILY,
    parts: [],
    description: ''
};
class RecipeService {
    constructor() {
        this.executing = false;
        pump_utils_1.PumpsUtils.init();
    }
    initDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            const adapter = new FileAsync_1.default('dbs/recipes', {
                defaultValue: {
                    [Collection.recipes]: [],
                    [Collection.FAMILIES]: []
                }
            });
            this.db = yield lowdb_1.default(adapter);
            yield this.setFamily(DEFAULT_FAMILY);
        });
    }
    setFamily(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipeFamily = yield this.db.get(Collection.FAMILIES)
                .find({ id })
                .value();
            this.recipeFamily = recipeFamily;
        });
    }
    upsertFamily(family) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = family;
            const found = yield this.db.get(Collection.FAMILIES)
                .find({ id });
            if (!found.value()) {
                yield this.db.get(Collection.FAMILIES)
                    .push(family)
                    .write();
            }
            else {
                yield found
                    .assign(family)
                    .write();
            }
        });
    }
    upsertRecipe(recipe) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = recipe;
            const found = yield this.db.get(Collection.recipes)
                .find({ id });
            if (!found.value()) {
                yield this.db.get(Collection.recipes)
                    .push(recipe)
                    .write();
            }
            else {
                yield found
                    .assign(recipe)
                    .write();
            }
        });
    }
    delRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.get(Collection.recipes)
                .remove({ id })
                .write();
        });
    }
    createRecipe() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = uniqid_1.default();
            const parts = pump_utils_1.PumpsUtils.generateDefaultParts();
            const cloned = lodash_1.cloneDeep(DEFAULT_RECEPY);
            const recipe = Object.assign({}, cloned, { id, parts });
            yield this.upsertRecipe(recipe);
            return recipe;
        });
    }
    getRecepies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recipeFamily) {
                const { id: recipeFamily } = this.recipeFamily;
                const recipes = yield this.db.get(Collection.recipes)
                    .filter({ recipeFamily })
                    .sortBy('label')
                    .value();
                return recipes;
            }
            else {
                return Promise.resolve([]);
            }
        });
    }
    getFamilies() {
        return __awaiter(this, void 0, void 0, function* () {
            const families = yield this.db.get(Collection.FAMILIES)
                .sortBy('label')
                .value();
            return families;
        });
    }
    setPumps(recipe) {
        if (!this.executing && recipe) {
            this.executing = true;
            const { parts } = recipe;
            const promises = parts.map((quantity, indx) => {
                const pin = types_1.PumpPin[indx];
                return pump_utils_1.PumpsUtils.activateWithTimer(pin, quantity * 1000);
            });
            // wait for all timers to resolve
            return Promise.all(promises).then(() => {
                this.executing = false;
                return;
            });
        }
    }
    getTotalTime(recipe) {
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
exports.RecipeService = RecipeService;
//# sourceMappingURL=recipe-parser.js.map