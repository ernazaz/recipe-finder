// Downloads every TheMealDB recipe (searched letter by letter), maps it to our
// Recipe type and writes src/data/recipes.json. Run with `npm run data:fetch`.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  mapMealDbMeal,
  parseMealDbResponse,
  type MealDbMeal,
} from "../src/features/recipes/api/mealDb.ts";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php";
const OUTPUT_PATH = path.resolve(
  import.meta.dirname,
  "../src/data/recipes.json",
);
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

async function fetchMealsStartingWith(letter: string): Promise<MealDbMeal[]> {
  const response = await fetch(`${API_URL}?f=${letter}`);
  if (!response.ok) {
    throw new Error(`TheMealDB returned ${response.status} for "${letter}"`);
  }
  return parseMealDbResponse(await response.json());
}

async function main() {
  const meals = new Map<string, MealDbMeal>();

  // Sequential on purpose: the free API key is rate limited.
  for (const letter of LETTERS) {
    const batch = await fetchMealsStartingWith(letter);
    for (const meal of batch) meals.set(meal.idMeal, meal);
    console.log(`${letter}: ${batch.length} meals`);
  }

  const recipes = [...meals.values()]
    .map(mapMealDbMeal)
    .sort((a, b) => a.name.localeCompare(b.name));

  await writeFile(OUTPUT_PATH, `${JSON.stringify(recipes, null, 2)}\n`);
  console.log(`Wrote ${recipes.length} recipes to ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
