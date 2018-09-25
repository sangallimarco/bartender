import { RecepyIngredient, RecepyFamily, Recepy } from '../../types';

export function getCurrentFamily(families: RecepyFamily[], recepy: Recepy): RecepyFamily | null {
    if (recepy && families) {
        const { recepyFamily } = recepy;
        const currentFamily = families.find(family => family.id === recepyFamily);
        if (currentFamily) {
            return currentFamily;
        }
    }
    return null;
}

export function getIngredientColors(ingredients: RecepyIngredient[]): string[] {
    return ingredients.map(ingredient => {
        return ingredient.color;
    });
}