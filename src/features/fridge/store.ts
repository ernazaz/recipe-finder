import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions } from "@/lib/storage";
import { normalizeIngredientName } from "./lib/matchRecipes";

type FridgeState = {
  ingredients: string[];
  addIngredient: (name: string) => void;
  removeIngredient: (name: string) => void;
  clearIngredients: () => void;
};

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set) => ({
      ingredients: [],
      addIngredient: (name) =>
        set((state) => {
          const ingredient = normalizeIngredientName(name);
          if (!ingredient || state.ingredients.includes(ingredient)) return state;
          return { ingredients: [...state.ingredients, ingredient] };
        }),
      removeIngredient: (name) =>
        set((state) => ({
          ingredients: state.ingredients.filter((ingredient) => ingredient !== name),
        })),
      clearIngredients: () => set({ ingredients: [] }),
    }),
    persistOptions("fridge"),
  ),
);
