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
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const lodash_1 = require("lodash");
const uniqid_1 = __importDefault(require("uniqid"));
const DEFAULT_FAMILY = 'default';
var Collection;
(function (Collection) {
    Collection["RECEPIES"] = "RECEPIES";
    Collection["FAMILIES"] = "FAMILIES";
})(Collection || (Collection = {}));
const DEFAULT_RECEPY = {
    id: '',
    label: '',
    recepyFamily: DEFAULT_FAMILY,
    parts: []
};
class RecepyService {
    constructor() {
        this.executing = false;
        pump_utils_1.PumpsUtils.init();
    }
    initDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            const adapter = new FileAsync_1.default('dbs/recepies', {
                defaultValue: {
                    [Collection.RECEPIES]: [],
                    [Collection.FAMILIES]: []
                }
            });
            this.db = yield lowdb_1.default(adapter);
            yield this.setFamily(DEFAULT_FAMILY);
        });
    }
    setFamily(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recepyFamily = yield this.db.get(Collection.FAMILIES)
                .find({ id })
                .value();
            this.recepyFamily = recepyFamily;
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
    upsertRecepy(recepy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = recepy;
            const found = yield this.db.get(Collection.RECEPIES)
                .find({ id });
            if (!found.value()) {
                yield this.db.get(Collection.RECEPIES)
                    .push(recepy)
                    .write();
            }
            else {
                yield found
                    .assign(recepy)
                    .write();
            }
        });
    }
    delRecepy(recepy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = recepy;
            yield this.db.get(Collection.RECEPIES)
                .remove({ id })
                .write();
        });
    }
    createRecepy() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = uniqid_1.default();
            const parts = pump_utils_1.PumpsUtils.generateDefaultParts();
            const cloned = lodash_1.cloneDeep(DEFAULT_RECEPY);
            const recepy = Object.assign({}, cloned, { id, parts });
            yield this.upsertRecepy(recepy);
            return recepy;
        });
    }
    getRecepies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recepyFamily) {
                const { id: recepyFamily } = this.recepyFamily;
                const recepies = yield this.db.get(Collection.RECEPIES)
                    .filter({ recepyFamily })
                    .sortBy('label')
                    .value();
                return recepies;
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
    setPumps(recepy) {
        if (!this.executing && recepy) {
            this.executing = true;
            const { parts } = recepy;
            const promises = parts.map((quantity, indx) => {
                return pump_utils_1.PumpsUtils.activateWithTimer(indx, quantity * 1000);
            });
            // wait for all timers to resolve
            return Promise.all(promises).then(() => {
                this.executing = false;
                return;
            });
        }
    }
}
exports.RecepyService = RecepyService;
//# sourceMappingURL=recepy-parser.js.map