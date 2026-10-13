import { describe, expect, it } from "vitest";
import { scaleIngredients } from "./scaleIngredients";

const ingredients = [
  { name: "flour", measure: "200g" },
  { name: "milk", measure: "1 1/2 cups" },
  { name: "salt", measure: "to taste" },
  { name: "eggs", measure: "" },
];

describe("scaleIngredients", () => {
  it("doubles parseable measures and keeps the rest as written", () => {
    expect(scaleIngredients(ingredients, 4, 8)).toEqual([
      { name: "flour", measure: "400g" },
      { name: "milk", measure: "3 cups" },
      { name: "salt", measure: "to taste" },
      { name: "eggs", measure: "" },
    ]);
  });

  it("scales down to fractions", () => {
    expect(scaleIngredients(ingredients, 4, 2)[1].measure).toBe("3/4 cups");
    expect(scaleIngredients(ingredients, 4, 1)[0].measure).toBe("50g");
  });

  it("leaves measures unchanged at the original servings", () => {
    expect(scaleIngredients(ingredients, 4, 4)).toEqual(ingredients);
  });

  it("handles an empty list", () => {
    expect(scaleIngredients([], 4, 2)).toEqual([]);
  });

  it("rejects zero or negative servings", () => {
    expect(() => scaleIngredients(ingredients, 0, 2)).toThrow(RangeError);
    expect(() => scaleIngredients(ingredients, 4, -1)).toThrow(RangeError);
  });
});
