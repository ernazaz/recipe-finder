import { describe, expect, it } from "vitest";
import { ingredients, makeRecipe } from "@/test/fixtures";
import {
  ingredientMatches,
  matchRatio,
  matchRecipes,
  normalizeIngredientName,
} from "./matchRecipes";

describe("normalizeIngredientName", () => {
  it("lowercases, trims and collapses whitespace", () => {
    expect(normalizeIngredientName("  Olive   Oil ")).toBe("olive oil");
  });

  it("returns an empty string for blank input", () => {
    expect(normalizeIngredientName("   ")).toBe("");
  });
});

describe("ingredientMatches", () => {
  it.each([
    ["garlic", "garlic"],
    ["chicken breast", "chicken"],
    ["extra virgin olive oil", "olive oil"],
    ["eggs", "egg"],
    ["egg", "eggs"],
    ["chopped tomatoes", "tomato"],
    ["red pepper", "pepper"],
  ])("%j matches pantry item %j", (ingredient, pantryItem) => {
    expect(ingredientMatches(ingredient, pantryItem)).toBe(true);
  });

  it.each([
    ["chickpeas", "chicken"],
    ["olive oil", "oil olive"],
    ["oil", "olive oil"],
    ["garlic", ""],
  ])("%j does not match pantry item %j", (ingredient, pantryItem) => {
    expect(ingredientMatches(ingredient, pantryItem)).toBe(false);
  });
});

describe("matchRecipes", () => {
  const omelette = makeRecipe({
    id: "omelette",
    name: "Omelette",
    ingredients: ingredients("eggs", "butter", "salt"),
  });
  const curry = makeRecipe({
    id: "curry",
    name: "Chicken Curry",
    ingredients: ingredients("chicken", "onion", "garlic", "cumin", "rice", "salt"),
  });
  const cake = makeRecipe({
    id: "cake",
    name: "Cake",
    ingredients: ingredients("flour", "sugar", "eggs", "butter"),
  });

  it("reports what the user has and is missing", () => {
    const [match] = matchRecipes([curry], ["chicken", "Onion", "garlic", "rice", "salt"]);
    expect(match.have).toEqual(["chicken", "onion", "garlic", "rice", "salt"]);
    expect(match.missing).toEqual(["cumin"]);
  });

  it("sorts by fewest missing ingredients", () => {
    const matches = matchRecipes([cake, curry, omelette], ["eggs", "butter"]);
    expect(matches.map((match) => match.recipe.id)).toEqual(["omelette", "cake"]);
  });

  it("leaves out recipes with no matching ingredients", () => {
    expect(matchRecipes([curry], ["chocolate"])).toEqual([]);
  });

  it("returns nothing for an empty or blank pantry", () => {
    expect(matchRecipes([curry, cake], [])).toEqual([]);
    expect(matchRecipes([curry, cake], ["  "])).toEqual([]);
  });

  it("returns nothing for no recipes", () => {
    expect(matchRecipes([], ["eggs"])).toEqual([]);
  });

  it("counts a repeated ingredient once", () => {
    const recipe = makeRecipe({ ingredients: ingredients("salt", "salt", "eggs") });
    const [match] = matchRecipes([recipe], ["salt"]);
    expect(match.have).toEqual(["salt"]);
    expect(match.missing).toEqual(["eggs"]);
  });
});

describe("matchRatio", () => {
  it("is the share of ingredients the user has", () => {
    const recipe = makeRecipe();
    expect(matchRatio({ recipe, have: ["a", "b", "c"], missing: ["d"] })).toBe(0.75);
  });

  it("is 0 for a recipe without ingredients", () => {
    expect(matchRatio({ recipe: makeRecipe(), have: [], missing: [] })).toBe(0);
  });
});
