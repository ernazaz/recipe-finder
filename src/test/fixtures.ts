import type { Recipe } from "@/features/recipes";

export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: "1",
    name: "Test Recipe",
    category: "Vegetarian",
    area: "British",
    imageUrl: "https://example.com/recipe.jpg",
    thumbnailUrl: "https://example.com/recipe.jpg/large",
    ingredients: [],
    steps: ["Cook it."],
    tags: [],
    servings: 4,
    youtubeUrl: null,
    sourceUrl: null,
    ...overrides,
  };
}

export function ingredients(...names: string[]): Recipe["ingredients"] {
  return names.map((name) => ({ name, measure: "1" }));
}
