import { describe, expect, it } from "vitest";
import { ingredients, makeRecipe } from "@/test/fixtures";
import {
  filterRecipes,
  getCategories,
  getIngredientNames,
} from "./filterRecipes";

const curry = makeRecipe({
  id: "1",
  name: "Chicken Curry",
  category: "Chicken",
  area: "Indian",
  ingredients: ingredients("chicken", "cumin", "coconut milk"),
});
const pie = makeRecipe({
  id: "2",
  name: "Apple Pie",
  category: "Dessert",
  area: "American",
  tags: ["Baking"],
  ingredients: ingredients("apple", "flour", "butter"),
});
const recipes = [curry, pie];

describe("filterRecipes", () => {
  it("returns everything for an empty query and no category", () => {
    expect(filterRecipes(recipes, { query: "", category: null })).toEqual(
      recipes,
    );
  });

  it("matches by name, case-insensitively", () => {
    expect(filterRecipes(recipes, { query: "CURRY", category: null })).toEqual(
      [curry],
    );
  });

  it("matches by ingredient, cuisine and tag", () => {
    expect(filterRecipes(recipes, { query: "cumin", category: null })).toEqual([
      curry,
    ]);
    expect(
      filterRecipes(recipes, { query: "american", category: null }),
    ).toEqual([pie]);
    expect(filterRecipes(recipes, { query: "baking", category: null })).toEqual(
      [pie],
    );
  });

  it("requires every word to match", () => {
    expect(
      filterRecipes(recipes, { query: "apple butter", category: null }),
    ).toEqual([pie]);
    expect(
      filterRecipes(recipes, { query: "apple cumin", category: null }),
    ).toEqual([]);
  });

  it("filters by category and query together", () => {
    expect(
      filterRecipes(recipes, { query: "apple", category: "Chicken" }),
    ).toEqual([]);
    expect(filterRecipes(recipes, { query: "", category: "Dessert" })).toEqual([
      pie,
    ]);
  });

  it("ignores surrounding whitespace", () => {
    expect(filterRecipes(recipes, { query: "  pie  ", category: null })).toEqual(
      [pie],
    );
  });

  it("handles an empty recipe list", () => {
    expect(filterRecipes([], { query: "pie", category: null })).toEqual([]);
  });
});

describe("getCategories", () => {
  it("returns unique sorted categories", () => {
    expect(getCategories([pie, curry, pie])).toEqual(["Chicken", "Dessert"]);
  });

  it("returns an empty list for no recipes", () => {
    expect(getCategories([])).toEqual([]);
  });
});

describe("getIngredientNames", () => {
  it("returns unique sorted ingredient names", () => {
    const soup = makeRecipe({ ingredients: ingredients("butter", "onion") });
    expect(getIngredientNames([pie, soup])).toEqual([
      "apple",
      "butter",
      "flour",
      "onion",
    ]);
  });
});
