import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { useShoppingListStore } from "../store";
import { AddToShoppingListButton } from "./AddToShoppingListButton";
import { ShoppingList } from "./ShoppingList";

const recipe = { id: "1", name: "Pancakes" };
const ingredients = [
  { name: "flour", measure: "200g" },
  { name: "milk", measure: "300ml" },
];

describe("ShoppingList", () => {
  beforeEach(() => {
    useShoppingListStore.setState({ items: [] });
  });

  it("shows ingredients added from a recipe, grouped under the recipe", async () => {
    const { user } = renderWithProviders(
      <>
        <AddToShoppingListButton recipe={recipe} ingredients={ingredients} />
        <ShoppingList />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /add to shopping list/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Added 2 items");
    expect(screen.getByRole("link", { name: "Pancakes" })).toHaveAttribute("href", "/recipes/1");
    expect(screen.getByRole("checkbox", { name: /flour · 200g/i })).not.toBeChecked();
  });

  it("replaces a recipe's items when it's added again", async () => {
    const { user } = renderWithProviders(
      <AddToShoppingListButton recipe={recipe} ingredients={ingredients} />,
    );

    await user.click(screen.getByRole("button", { name: /add to shopping list/i }));
    await user.click(screen.getByRole("button", { name: /add to shopping list/i }));

    expect(useShoppingListStore.getState().items).toHaveLength(2);
  });

  it("adds, checks and clears items", async () => {
    const { user } = renderWithProviders(<ShoppingList />);

    expect(screen.getByRole("heading", { name: /shopping list is empty/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/add an item/i), "Bin bags{Enter}");
    await user.type(screen.getByLabelText(/add an item/i), "Coffee{Enter}");

    await user.click(screen.getByRole("checkbox", { name: /bin bags/i }));
    expect(screen.getByRole("checkbox", { name: /bin bags/i })).toBeChecked();
    expect(screen.getByText("1 of 2 checked")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear checked/i }));
    expect(screen.queryByRole("checkbox", { name: /bin bags/i })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /coffee/i })).toBeInTheDocument();
  });

  it("removes a single item", async () => {
    useShoppingListStore.getState().addItem("Coffee");
    const { user } = renderWithProviders(<ShoppingList />);

    await user.click(screen.getByRole("button", { name: "Remove Coffee" }));

    expect(screen.getByRole("heading", { name: /shopping list is empty/i })).toBeInTheDocument();
  });
});
