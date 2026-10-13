import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions } from "@/lib/storage";

type SavedState = {
  /** Saved recipe ids, most recently saved first. */
  recipeIds: string[];
  toggleSaved: (recipeId: string) => void;
};

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      recipeIds: [],
      toggleSaved: (recipeId) =>
        set((state) => ({
          recipeIds: state.recipeIds.includes(recipeId)
            ? state.recipeIds.filter((id) => id !== recipeId)
            : [recipeId, ...state.recipeIds],
        })),
    }),
    persistOptions("saved"),
  ),
);
