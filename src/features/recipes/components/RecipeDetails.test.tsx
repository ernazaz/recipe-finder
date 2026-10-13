import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeRecipe } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { RecipeDetails } from "./RecipeDetails";

const recipe = makeRecipe({
  name: "Pancakes",
  servings: 4,
  ingredients: [
    { name: "flour", measure: "200g" },
    { name: "milk", measure: "1 1/2 cups" },
    { name: "salt", measure: "pinch" },
  ],
  steps: ["Mix.", "Fry."],
});

function ingredientRows() {
  const list = screen.getByRole("heading", { name: "Ingredients" })
    .parentElement as HTMLElement;
  return within(list)
    .getAllByRole("listitem")
    .map((item) => item.textContent);
}

describe("RecipeDetails", () => {
  it("shows the recipe with its steps in order", () => {
    renderWithProviders(<RecipeDetails recipe={recipe} />);

    expect(screen.getByRole("heading", { level: 1, name: "Pancakes" })).toBeInTheDocument();
    const method = screen.getByRole("heading", { name: "Method" })
      .parentElement as HTMLElement;
    expect(within(method).getAllByRole("listitem").map((step) => step.textContent)).toEqual([
      "1Mix.",
      "2Fry.",
    ]);
  });

  it("scales ingredient measures when servings change", async () => {
    const { user } = renderWithProviders(<RecipeDetails recipe={recipe} />);

    expect(ingredientRows()).toEqual(["flour200g", "milk1 1/2 cups", "saltpinch"]);

    await user.click(screen.getByRole("button", { name: /decrease servings/i }));
    await user.click(screen.getByRole("button", { name: /decrease servings/i }));

    expect(screen.getByRole("status", { name: "2 servings" })).toBeInTheDocument();
    expect(ingredientRows()).toEqual(["flour100g", "milk3/4 cups", "saltpinch"]);
  });

  it("doesn't go below one serving", async () => {
    const { user } = renderWithProviders(
      <RecipeDetails recipe={{ ...recipe, servings: 1 }} />,
    );

    expect(screen.getByRole("button", { name: /decrease servings/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /increase servings/i }));
    expect(screen.getByRole("status", { name: "2 servings" })).toBeInTheDocument();
  });

  it("passes the scaled ingredients to the ingredient actions", async () => {
    const { user } = renderWithProviders(
      <RecipeDetails
        recipe={recipe}
        renderIngredientActions={(ingredients) => (
          <p>First: {ingredients[0].measure}</p>
        )}
      />,
    );

    await user.click(screen.getByRole("button", { name: /increase servings/i }));
    expect(screen.getByText("First: 250g")).toBeInTheDocument();
  });
});
