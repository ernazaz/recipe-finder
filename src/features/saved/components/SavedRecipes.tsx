import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { buttonVariants } from "@/components/ui/button";
import {
  RecipeCard,
  RecipeGrid,
  RecipeGridSkeleton,
  useRecipes,
  type Recipe,
} from "@/features/recipes";
import { useSavedStore } from "../store";

export function SavedRecipes() {
  const recipeIds = useSavedStore((state) => state.recipeIds);
  const { data: recipes, isPending, isError } = useRecipes();

  if (recipeIds.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved recipes yet"
        description="Tap “Save recipe” on any recipe to keep it here."
        action={
          <Link to="/" className={buttonVariants({ size: "lg" })}>
            Browse recipes
          </Link>
        }
      />
    );
  }
  if (isPending) return <RecipeGridSkeleton count={recipeIds.length} />;
  if (isError) return <ErrorAlert />;

  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  // Ids of recipes no longer in the data set are skipped.
  const saved = recipeIds
    .map((id) => byId.get(id))
    .filter((recipe): recipe is Recipe => recipe !== undefined);

  return (
    <RecipeGrid>
      {saved.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </RecipeGrid>
  );
}
