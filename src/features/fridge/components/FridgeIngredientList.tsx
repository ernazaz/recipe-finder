import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFridgeStore } from "../store";

export function FridgeIngredientList() {
  const ingredients = useFridgeStore((state) => state.ingredients);
  const removeIngredient = useFridgeStore((state) => state.removeIngredient);
  const clearIngredients = useFridgeStore((state) => state.clearIngredients);

  if (ingredients.length === 0) {
    return (
      <p className="text-muted-foreground">
        Your fridge is empty. Add a few ingredients to see what you can cook.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="sr-only">In your fridge</h2>
      <ul className="flex flex-wrap gap-2" aria-label="Ingredients in your fridge">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient}
            className="flex items-center gap-1 rounded-full border bg-secondary pl-4 font-medium text-secondary-foreground capitalize"
          >
            {ingredient}
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full hover:bg-card"
              aria-label={`Remove ${ingredient}`}
              onClick={() => removeIngredient(ingredient)}
            >
              <X aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant="link"
        size="lg"
        className="self-start px-0 text-muted-foreground"
        onClick={clearIngredients}
      >
        Clear all ingredients
      </Button>
    </div>
  );
}
