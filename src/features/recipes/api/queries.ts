import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCategories, getIngredientNames } from "../lib/filterRecipes";
import type { Recipe } from "../types";

async function loadRecipes(): Promise<Recipe[]> {
  // Loaded lazily so the ~1.7 MB of recipe data is its own chunk.
  const module = await import("@/data/recipes.json");
  return module.default;
}

export const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: loadRecipes,
  // Bundled data never changes while the app is open.
  staleTime: Infinity,
});

export function useRecipes() {
  return useQuery(recipesQuery);
}

export function useRecipe(id: string) {
  return useQuery({
    ...recipesQuery,
    select: (recipes: Recipe[]) =>
      recipes.find((recipe) => recipe.id === id) ?? null,
  });
}

export function useCategories() {
  return useQuery({ ...recipesQuery, select: getCategories });
}

export function useIngredientNames() {
  return useQuery({ ...recipesQuery, select: getIngredientNames });
}
