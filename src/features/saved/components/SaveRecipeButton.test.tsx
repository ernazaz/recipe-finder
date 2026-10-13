import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { useSavedStore } from "../store";
import { SaveRecipeButton } from "./SaveRecipeButton";

describe("SaveRecipeButton", () => {
  beforeEach(() => {
    useSavedStore.setState({ recipeIds: [] });
  });

  it("toggles whether the recipe is saved", async () => {
    const { user } = renderWithProviders(<SaveRecipeButton recipeId="42" />);
    const button = screen.getByRole("button", { name: /save recipe/i });

    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(useSavedStore.getState().recipeIds).toEqual(["42"]);

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(useSavedStore.getState().recipeIds).toEqual([]);
  });
});
