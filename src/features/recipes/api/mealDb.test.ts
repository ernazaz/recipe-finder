import { describe, expect, it } from "vitest";
import {
  DEFAULT_SERVINGS,
  mapMealDbMeal,
  parseMealDbResponse,
  splitInstructions,
  type MealDbMeal,
} from "./mealDb";

const meal: MealDbMeal = {
  idMeal: "52772",
  strMeal: " Teriyaki Chicken  Casserole ",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "STEP 1\r\nPreheat oven.\r\n\r\n2. Mix the sauce.",
  strMealThumb: "https://example.com/thumb.jpg",
  strTags: "Meat,Casserole,",
  strYoutube: "",
  strSource: null,
  strIngredient1: " Soy Sauce ",
  strMeasure1: "3/4 cup",
  strIngredient2: "",
  strMeasure2: " ",
  strIngredient3: "Chicken Breasts",
  strMeasure3: null,
  strIngredient4: null,
  strMeasure4: null,
};

describe("mapMealDbMeal", () => {
  it("maps a raw meal to a Recipe", () => {
    expect(mapMealDbMeal(meal)).toEqual({
      id: "52772",
      name: "Teriyaki Chicken Casserole",
      category: "Chicken",
      area: "Japanese",
      imageUrl: "https://example.com/thumb.jpg",
      thumbnailUrl: "https://example.com/thumb.jpg/large",
      ingredients: [
        { name: "soy sauce", measure: "3/4 cup" },
        { name: "chicken breasts", measure: "" },
      ],
      steps: ["Preheat oven.", "Mix the sauce."],
      tags: ["Meat", "Casserole"],
      servings: DEFAULT_SERVINGS,
      youtubeUrl: null,
      sourceUrl: null,
    });
  });

  it("falls back when category and area are missing", () => {
    const recipe = mapMealDbMeal({ ...meal, strCategory: null, strArea: "" });
    expect(recipe.category).toBe("Other");
    expect(recipe.area).toBe("Unknown");
  });
});

describe("splitInstructions", () => {
  it("drops step headings and numbering", () => {
    expect(
      splitInstructions("Step 1\nBoil water.\n1) Add pasta.\nStep 3: Drain."),
    ).toEqual(["Boil water.", "Add pasta.", "Drain."]);
  });

  it("keeps lines that only start with a number as part of the text", () => {
    expect(splitInstructions("2 eggs go in the bowl.")).toEqual([
      "2 eggs go in the bowl.",
    ]);
  });

  it("returns no steps for empty input", () => {
    expect(splitInstructions(null)).toEqual([]);
    expect(splitInstructions(" \r\n ")).toEqual([]);
  });
});

describe("parseMealDbResponse", () => {
  it("returns valid meals and skips malformed ones", () => {
    expect(
      parseMealDbResponse({ meals: [meal, { idMeal: 1 }, null] }),
    ).toEqual([meal]);
  });

  it("returns an empty list when there are no meals", () => {
    expect(parseMealDbResponse({ meals: null })).toEqual([]);
    expect(parseMealDbResponse("not json")).toEqual([]);
  });
});
