import { RecipeIngredient, RecipeFamily, Recipe } from '../../types';

export function getCurrentFamily(families: RecipeFamily[], recipe: Recipe): RecipeFamily | null {
    if (recipe && families) {
        const { recipeFamily } = recipe;
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