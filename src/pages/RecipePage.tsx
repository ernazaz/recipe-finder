import { ArrowLeft, SearchX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageContainer } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import {
  RecipeDetails,
  RecipeDetailsSkeleton,
  useRecipe,
} from "@/features/recipes";
import { SaveRecipeButton } from "@/features/saved";
import { AddToShoppingListButton } from "@/features/shopping-list";
import { cn } from "@/lib/utils";

export function RecipePage() {
  const { recipeId = "" } = useParams();
  const { data: recipe, isPending, isError } = useRecipe(recipeId);

  return (
    <PageContainer className="flex flex-col gap-6">
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "-ml-4 self-start text-muted-foreground",
        )}
      >
        <ArrowLeft aria-hidden="true" />
        All recipes
      </Link>

      {isPending ? (
        <RecipeDetailsSkeleton />
      ) : isError ? (
        <ErrorAlert />
      ) : recipe ? (
        <>
          <title>{`${recipe.name} · Pantry`}</title>
          <RecipeDetails
            // Resets the servings scaler when moving between recipes.
            key={recipe.id}
            recipe={recipe}
            actions={<SaveRecipeButton recipeId={recipe.id} />}
            renderIngredientActions={(ingredients) => (
              <AddToShoppingListButton recipe={recipe} ingredients={ingredients} />
            )}
          />
        </>
      ) : (
        <>
          <title>Recipe not found · Pantry</title>
          <EmptyState
            icon={SearchX}
            title="Recipe not found"
            description="This recipe doesn't exist or may have been removed."
            action={
              <Link to="/" className={buttonVariants({ size: "lg" })}>
                Browse recipes
              </Link>
            }
          />
        </>
      )}
    </PageContainer>
  );
}
