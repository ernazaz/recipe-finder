import { ListChecks, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Ingredient, Recipe } from "@/features/recipes";
import { useShoppingListStore } from "../store";

type AddToShoppingListButtonProps = {
  recipe: Pick<Recipe, "id" | "name">;
  ingredients: Ingredient[];
  label?: string;
};

export function AddToShoppingListButton({
  recipe,
  ingredients,
  label = "Add to shopping list",
}: AddToShoppingListButtonProps) {
  const addRecipeIngredients = useShoppingListStore(
    (state) => state.addRecipeIngredients,
  );
  const [addedCount, setAddedCount] = useState<number | null>(null);

  function handleClick() {
    addRecipeIngredients(recipe, ingredients);
    setAddedCount(ingredients.length);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="lg"
        className="bg-card"
        onClick={handleClick}
        disabled={ingredients.length === 0}
      >
        {addedCount === null ? (
          <ShoppingBasket aria-hidden="true" />
        ) : (
          <ListChecks aria-hidden="true" />
        )}
        {label}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {addedCount !== null &&
          `Added ${addedCount} ${addedCount === 1 ? "item" : "items"} to your shopping list.`}
      </p>
    </div>
  );
}
