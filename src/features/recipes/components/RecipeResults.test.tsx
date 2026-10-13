import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ingredients, makeRecipe } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { RecipeResults } from "./RecipeResults";

const recipes = [
  makeRecipe({ id: "1", name: "Chicken Curry", category: "Chicken", ingredients: ingredients("cumin") }),
  makeRecipe({ id: "2", name: "Apple Pie", category: "Dessert" }),
];

describe("RecipeResults", () => {
  it("lists recipes matching the filters as links", () => {
    renderWithProviders(
      <RecipeResults filters={{ query: "cumin", category: null }} onClearFilters={vi.fn()} />,
      { recipes },
    );

    expect(screen.getByRole("heading", { name: "1 recipe" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Chicken Curry" })).toHaveAttribute(
      "href",
      "/recipes/1",
    );
    expect(screen.queryByRole("link", { name: "Apple Pie" })).not.toBeInTheDocument();
  });

  it("offers to clear filters when nothing matches", async () => {
    const onClearFilters = vi.fn();
    const { user } = renderWithProviders(
      <RecipeResults
        filters={{ query: "lasagne", category: "Dessert" }}
        onClearFilters={onClearFilters}
      />,
      { recipes },
    );

    expect(screen.getByRole("heading", { name: "No recipes found" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(onClearFilters).toHaveBeenCalledOnce();
  });

  it("pages through long result lists", async () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      makeRecipe({ id: String(i), name: `Recipe ${i}` }),
    );
    const { user } = renderWithProviders(
      <RecipeResults filters={{ query: "", category: null }} onClearFilters={vi.fn()} />,
      { recipes: many },
    );

    expect(screen.getAllByRole("link")).toHaveLength(24);
    await user.click(screen.getByRole("button", { name: /show more recipes/i }));
    expect(screen.getAllByRole("link")).toHaveLength(30);
    expect(screen.queryByRole("button", { name: /show more/i })).not.toBeInTheDocument();
  });
});
