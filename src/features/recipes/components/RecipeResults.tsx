import { SearchX } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { useRecipes } from "../api/queries";
import { filterRecipes, type RecipeFilters } from "../lib/filterRecipes";
import type { Recipe } from "../types";
import { RecipeCard } from "./RecipeCard";
import { RecipeGrid, RecipeGridSkeleton } from "./RecipeGrid";

const PAGE_SIZE = 24;

type RecipeResultsProps = {
  filters: RecipeFilters;
  onClearFilters: () => void;
};

export function RecipeResults({ filters, onClearFilters }: RecipeResultsProps) {
  const { data: recipes, isPending, isError } = useRecipes();

  if (isPending) return <RecipeGridSkeleton />;
  if (isError) return <ErrorAlert />;

  const results = filterRecipes(recipes, filters);
  const hasFilters = Boolean(filters.query || filters.category);

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-5">
      <h2
        id="results-heading"
        className="text-sm font-medium text-muted-foreground"
        aria-live="polite"
      >
        {results.length === 1 ? "1 recipe" : `${results.length} recipes`}
      </h2>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No recipes found"
          description="Try a different search or another category."
          action={
            hasFilters && (
              <Button variant="outline" size="lg" onClick={onClearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        // A new key resets paging whenever the filters change.
        <PagedRecipeGrid
          key={`${filters.category ?? ""}|${filters.query}`}
          recipes={results}
        />
      )}
    </section>
  );
}

type PagedRecipeGridProps = {
  recipes: Recipe[];
};

function PagedRecipeGrid({ recipes }: PagedRecipeGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <>
      <RecipeGrid>
        {recipes.slice(0, visibleCount).map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </RecipeGrid>
      {visibleCount < recipes.length && (
        <Button
          variant="outline"
          size="lg"
          className="self-center bg-card"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Show more recipes
        </Button>
      )}
    </>
  );
}
