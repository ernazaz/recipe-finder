import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ingredients, makeRecipe } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { useFridgeStore } from "../store";
import { FridgeIngredientForm } from "./FridgeIngredientForm";
import { FridgeIngredientList } from "./FridgeIngredientList";
import { FridgeMatches } from "./FridgeMatches";

const recipes = [
  makeRecipe({
    id: "1",
    name: "Omelette",
    ingredients: ingredients("eggs", "butter"),
  }),
  makeRecipe({
    id: "2",
    name: "Egg Fried Rice",
    ingredients: ingredients("eggs", "rice", "soy sauce", "spring onions"),
  }),
];

function Fridge() {
  return (
    <>
      <FridgeIngredientForm />
      <FridgeIngredientList />
      <FridgeMatches />
    </>
  );
}

describe("Fridge", () => {
  beforeEach(() => {
    useFridgeStore.setState({ ingredients: [] });
  });

  it("ranks recipes by the ingredients you add", async () => {
    const { user } = renderWithProviders(<Fridge />, { recipes });

    await user.type(screen.getByLabelText(/add an ingredient/i), "Eggs{Enter}");
    await user.type(screen.getByLabelText(/add an ingredient/i), "rice");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const cards = screen.getAllByRole("progressbar");
    expect(cards).toHaveLength(2);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Omelette",
      "Egg Fried Rice",
    ]);
    expect(screen.getByText(/missing: soy sauce, spring onions/i)).toBeInTheDocument();
  });

  it("removes an ingredient", async () => {
    useFridgeStore.setState({ ingredients: ["butter", "eggs"] });
    const { user } = renderWithProviders(<Fridge />, { recipes });

    await user.click(screen.getByRole("button", { name: "Remove eggs" }));

    expect(screen.queryByRole("button", { name: "Remove eggs" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Omelette"]);
  });

  it("ignores blank and duplicate ingredients", async () => {
    const { user } = renderWithProviders(<Fridge />, { recipes });
    const input = screen.getByLabelText(/add an ingredient/i);

    await user.type(input, "   {Enter}");
    await user.type(input, "eggs{Enter}");
    await user.type(input, " EGGS {Enter}");

    expect(useFridgeStore.getState().ingredients).toEqual(["eggs"]);
  });
});
