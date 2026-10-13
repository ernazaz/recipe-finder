import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ingredient, Recipe } from "@/features/recipes";
import { persistOptions } from "@/lib/storage";
import type { ShoppingItem } from "./types";

type ShoppingListState = {
  items: ShoppingItem[];
  /** Adds a recipe's ingredients, replacing any already added from that recipe. */
  addRecipeIngredients: (
    recipe: Pick<Recipe, "id" | "name">,
    ingredients: Ingredient[],
  ) => void;
  addItem: (name: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
};

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],
      addRecipeIngredients: (recipe, ingredients) =>
        set((state) => ({
          items: [
            ...state.items.filter((item) => item.recipe?.id !== recipe.id),
            ...ingredients.map((ingredient) => ({
              id: crypto.randomUUID(),
              name: ingredient.name,
              measure: ingredient.measure,
              recipe: { id: recipe.id, name: recipe.name },
              checked: false,
            })),
          ],
        })),
      addItem: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;
          return {
            items: [
              ...state.items,
              { id: crypto.randomUUID(), name: trimmed, measure: "", recipe: null, checked: false },
            ],
          };
        }),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearChecked: () =>
        set((state) => ({ items: state.items.filter((item) => !item.checked) })),
      clearAll: () => set({ items: [] }),
    }),
    persistOptions("shopping-list"),
  ),
);
