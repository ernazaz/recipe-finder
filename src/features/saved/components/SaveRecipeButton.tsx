import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSavedStore } from "../store";

type SaveRecipeButtonProps = {
  recipeId: string;
};

export function SaveRecipeButton({ recipeId }: SaveRecipeButtonProps) {
  const isSaved = useSavedStore((state) => state.recipeIds.includes(recipeId));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  return (
    // The name stays "Save recipe"; aria-pressed tells assistive tech whether it's saved.
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="lg"
      aria-pressed={isSaved}
      onClick={() => toggleSaved(recipeId)}
      className={cn(!isSaved && "bg-card")}
    >
      <Heart
        aria-hidden="true"
        className={cn(isSaved && "fill-primary text-primary")}
      />
      Save recipe
    </Button>
  );
}
