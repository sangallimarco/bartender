import { RecipeIngredient, RecipeFamily } from '../../types';

export function getCurrentFamily(families: RecipeFamily[], recipeFamily: string): RecipeFamily | null {
    if (recipeFamily && families) {
        const currentFamily = families.find(family => family.id === recipeFamily);
        if (currentFamily) {
            return currentFamily;
        }
    }
    return null;
}

export function getIngredientColors(ingredients: RecipeIngredient[]): string[] {
    return ingredients.map(ingredient => {
        return ingredient.color;
    });
}