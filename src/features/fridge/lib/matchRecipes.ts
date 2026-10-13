import type { Recipe } from "@/features/recipes";

export type RecipeMatch = {
  recipe: Recipe;
  /** Recipe ingredient names the user has. */
  have: string[];
  /** Recipe ingredient names the user is missing. */
  missing: string[];
};

/** Lowercases, trims and collapses whitespace, matching how recipe data is stored. */
export function normalizeIngredientName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

// Naive singular so "egg" matches "eggs" and "tomato" matches "tomatoes".
// It only has to be consistent on both sides, not grammatically correct.
function singular(word: string): string {
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function toWords(name: string): string[] {
  return name.split(/[^a-z0-9]+/).filter(Boolean).map(singular);
}

/**
 * True when every word of the pantry item appears, in order, in the recipe
 * ingredient: "chicken" matches "chicken breast" but not "chickpeas", and
 * "olive oil" matches "extra virgin olive oil".
 */
export function ingredientMatches(
  recipeIngredient: string,
  pantryItem: string,
): boolean {
  const ingredientWords = toWords(recipeIngredient);
  const pantryWords = toWords(pantryItem);
  if (pantryWords.length === 0) return false;

  for (let start = 0; start + pantryWords.length <= ingredientWords.length; start++) {
    if (pantryWords.every((word, i) => ingredientWords[start + i] === word)) {
      return true;
    }
  }
  return false;
}

/**
 * Ranks recipes by how much of each one the user can make from their pantry.
 * Recipes with no matching ingredients are left out. Sorted by fewest missing
 * ingredients, then by the share of ingredients the user has, then by name.
 */
export function matchRecipes(recipes: Recipe[], pantry: string[]): RecipeMatch[] {
  const pantryItems = pantry.map(normalizeIngredientName).filter(Boolean);
  if (pantryItems.length === 0) return [];

  const matches: RecipeMatch[] = [];
  for (const recipe of recipes) {
    const names = [...new Set(recipe.ingredients.map((ingredient) => ingredient.name))];
    const have = names.filter((name) =>
      pantryItems.some((item) => ingredientMatches(name, item)),
    );
    if (have.length === 0) continue;
    matches.push({
      recipe,
      have,
      missing: names.filter((name) => !have.includes(name)),
    });
  }

  return matches.sort(
    (a, b) =>
      a.missing.length - b.missing.length ||
      matchRatio(b) - matchRatio(a) ||
      a.recipe.name.localeCompare(b.recipe.name),
  );
}

/** Share of the recipe's ingredients the user has, from 0 to 1. */
export function matchRatio(match: RecipeMatch): number {
  const total = match.have.length + match.missing.length;
  return total === 0 ? 0 : match.have.length / total;
}
