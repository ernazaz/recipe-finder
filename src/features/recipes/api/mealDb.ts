// The only module that knows TheMealDB's raw response shape. It is used by
// scripts/fetch-recipes.ts at download time, so it must only use type imports
// (Node runs the script with type stripping and no path aliases).
import type { Ingredient, Recipe } from "../types";

const MAX_INGREDIENTS = 20;

/** TheMealDB doesn't record servings, so every recipe assumes this many. */
export const DEFAULT_SERVINGS = 4;

export type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMealDbMeal(value: unknown): value is MealDbMeal {
  return (
    isRecord(value) &&
    typeof value.idMeal === "string" &&
    typeof value.strMeal === "string"
  );
}

/** Narrows a `search.php` / `lookup.php` response body to a list of meals. */
export function parseMealDbResponse(body: unknown): MealDbMeal[] {
  if (!isRecord(body) || !Array.isArray(body.meals)) return [];
  return body.meals.filter(isMealDbMeal);
}

function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function nullIfEmpty(value: string | null | undefined): string | null {
  return clean(value) || null;
}

function toIngredients(meal: MealDbMeal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= MAX_INGREDIENTS; i++) {
    const name = clean(meal[`strIngredient${i}`]).toLowerCase();
    if (!name) continue;
    ingredients.push({ name, measure: clean(meal[`strMeasure${i}`]) });
  }
  return ingredients;
}

const STEP_LABEL = /^(step\s*)?\d+[.):]?$/i;
const STEP_PREFIX = /^(step\s*\d+\s*[.):-]?|\d+[.)])\s+/i;

/**
 * Splits TheMealDB's instruction blob into steps. Drops "STEP 1"-style
 * heading lines and strips numbering like "1. " from the start of a step.
 */
export function splitInstructions(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !STEP_LABEL.test(line))
    .map((line) => line.replace(STEP_PREFIX, "").trim())
    .filter(Boolean);
}

export function mapMealDbMeal(meal: MealDbMeal): Recipe {
  const imageUrl = clean(meal.strMealThumb);
  return {
    id: meal.idMeal,
    name: clean(meal.strMeal),
    category: clean(meal.strCategory) || "Other",
    area: clean(meal.strArea) || "Unknown",
    imageUrl,
    // TheMealDB serves a 350 px preview at "<image>/large".
    thumbnailUrl: imageUrl && `${imageUrl}/large`,
    ingredients: toIngredients(meal),
    steps: splitInstructions(meal.strInstructions),
    tags: clean(meal.strTags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    servings: DEFAULT_SERVINGS,
    youtubeUrl: nullIfEmpty(meal.strYoutube),
    sourceUrl: nullIfEmpty(meal.strSource),
  };
}
