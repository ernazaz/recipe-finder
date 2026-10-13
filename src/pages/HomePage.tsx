import { Refrigerator } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import {
  CategoryFilter,
  RecipeResults,
  RecipeSearch,
  useRecipeFilters,
} from "@/features/recipes";
import { cn } from "@/lib/utils";

export function HomePage() {
  const { filters, setQuery, setCategory } = useRecipeFilters();

  return (
    <PageContainer className="flex flex-col gap-8">
      <title>Pantry · Cook with what you have</title>

      <section className="flex flex-col items-start gap-4 rounded-2xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <h1 className="max-w-2xl text-4xl font-bold text-balance md:text-6xl">
          Cook with what you already have
        </h1>
        <p className="max-w-xl text-lg text-primary-foreground/85">
          Tell Pantry what's in your fridge and get recipes ranked by how many
          ingredients you've already got.
        </p>
        <Link
          to="/fridge"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-2 bg-highlight font-semibold text-highlight-foreground hover:bg-highlight/90 focus-visible:ring-2 focus-visible:ring-primary-foreground",
          )}
        >
          <Refrigerator aria-hidden="true" />
          Find recipes
        </Link>
      </section>

      <div className="flex flex-col gap-4">
        <RecipeSearch value={filters.query} onChange={setQuery} />
        <CategoryFilter value={filters.category} onChange={setCategory} />
      </div>

      <RecipeResults
        filters={filters}
        onClearFilters={() => {
          setQuery("");
          setCategory(null);
        }}
      />
    </PageContainer>
  );
}
