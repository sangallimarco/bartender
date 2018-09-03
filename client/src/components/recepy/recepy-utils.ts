import { RecepyIngredient, RecepyFamily, Recepy } from "../../stores/types";

export function getCurrentFamilyIngredients(families: RecepyFamily[], recepy: Recepy): RecepyIngredient[] {
    if (recepy && families) {
        const { recepyFamily } = recepy as Recepy;
        const cfamilies = families as RecepyFamily[];
        const currentFamily = cfamilies.find((family: RecepyFamily) => family.id === recepyFamily);
        if (currentFamily) {
            return currentFamily.ingredients;
        }
    }
    return [];
}