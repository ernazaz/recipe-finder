import type { Recipe } from "../types";

export type RecipeFilters = {
  query: string;
  category: string | null;
};

function searchableText(recipe: Recipe): string {
  return [
    recipe.name,
    recipe.area,
    recipe.category,
    ...recipe.tags,
    ...recipe.ingredients.map((ingredient) => ingredient.name),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Keeps recipes in the given category whose name, cuisine, tags or
 * ingredients contain every word of the query.
 */
export function filterRecipes(
  recipes: Recipe[],
  { query, category }: RecipeFilters,
): Recipe[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  return recipes.filter((recipe) => {
    if (category && recipe.category !== category) return false;
    if (words.length === 0) return true;
    const text = searchableText(recipe);
    return words.every((word) => text.includes(word));
  });
}

/** Unique categories in alphabetical order. */
export function getCategories(recipes: Recipe[]): string[] {
  return [...new Set(recipes.map((recipe) => recipe.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Unique ingredient names in alphabetical order, for autocomplete. */
export function getIngredientNames(recipes: Recipe[]): string[] {
  const names = recipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.name),
  );
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}
