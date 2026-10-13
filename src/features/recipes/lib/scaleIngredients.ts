import type { Ingredient } from "../types";
import { scaleMeasure } from "./parseMeasure";

/** Returns the ingredients with measures scaled from `from` to `to` servings. */
export function scaleIngredients(
  ingredients: Ingredient[],
  from: number,
  to: number,
): Ingredient[] {
  if (from <= 0 || to <= 0) {
    throw new RangeError("Servings must be greater than zero");
  }
  const factor = to / from;
  return ingredients.map((ingredient) => ({
    ...ingredient,
    measure: scaleMeasure(ingredient.measure, factor),
  }));
}
