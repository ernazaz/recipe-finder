import { CirclePlay, ExternalLink } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { scaleIngredients } from "../lib/scaleIngredients";
import type { Ingredient, Recipe } from "../types";
import { ServingsScaler } from "./ServingsScaler";

type RecipeDetailsProps = {
  recipe: Recipe;
  /** Shown next to the title, e.g. a save button. */
  actions?: ReactNode;
  /** Shown under the ingredient list; receives the ingredients scaled to the chosen servings. */
  renderIngredientActions?: (scaled: Ingredient[]) => ReactNode;
};

export function RecipeDetails({
  recipe,
  actions,
  renderIngredientActions,
}: RecipeDetailsProps) {
  const [servings, setServings] = useState(recipe.servings);
  const ingredients = scaleIngredients(
    recipe.ingredients,
    recipe.servings,
    servings,
  );

  return (
    <article className="flex flex-col gap-8 lg:gap-12">
      <header className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-10">
        <img
          src={recipe.imageUrl}
          alt=""
          width={700}
          height={700}
          className="aspect-[4/3] w-full rounded-xl bg-secondary object-cover md:aspect-square"
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{recipe.category}</Badge>
            <Badge variant="secondary">{recipe.area}</Badge>
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-balance md:text-5xl">
            {recipe.name}
          </h1>
          <p className="text-muted-foreground">
            {recipe.ingredients.length} ingredients · {recipe.steps.length}{" "}
            steps
          </p>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          <RecipeLinks recipe={recipe} />
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section aria-labelledby="ingredients-heading" className="flex flex-col gap-4">
          <h2 id="ingredients-heading" className="text-2xl font-semibold">
            Ingredients
          </h2>
          <ServingsScaler value={servings} onChange={setServings} />
          <p className="text-sm text-muted-foreground">
            TheMealDB doesn't list servings, so we assume the original recipe
            serves {recipe.servings}.
          </p>
          <IngredientList ingredients={ingredients} />
          {renderIngredientActions?.(ingredients)}
        </section>

        <section aria-labelledby="method-heading" className="flex flex-col gap-4">
          <h2 id="method-heading" className="text-2xl font-semibold">
            Method
          </h2>
          <StepList steps={recipe.steps} />
        </section>
      </div>
    </article>
  );
}

type IngredientListProps = {
  ingredients: Ingredient[];
};

function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <ul className="divide-y rounded-xl border bg-card">
      {ingredients.map((ingredient, index) => (
        <li
          key={`${ingredient.name}-${index}`}
          className="flex items-baseline justify-between gap-4 px-4 py-3"
        >
          <span className="capitalize">{ingredient.name}</span>
          <span className="text-right text-muted-foreground tabular-nums">
            {ingredient.measure}
          </span>
        </li>
      ))}
    </ul>
  );
}

type StepListProps = {
  steps: string[];
};

function StepList({ steps }: StepListProps) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground"
          >
            {index + 1}
          </span>
          <p className="pt-1 leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}

type RecipeLinksProps = {
  recipe: Recipe;
};

function RecipeLinks({ recipe }: RecipeLinksProps) {
  if (!recipe.youtubeUrl && !recipe.sourceUrl) return null;

  const linkClasses =
    "inline-flex items-center gap-1.5 rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {recipe.youtubeUrl && (
        <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className={linkClasses}>
          <CirclePlay className="size-4" aria-hidden="true" />
          Watch the video
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
      {recipe.sourceUrl && (
        <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className={linkClasses}>
          <ExternalLink className="size-4" aria-hidden="true" />
          Original recipe
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

export function RecipeDetailsSkeleton() {
  return (
    <div
      className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10"
      aria-busy="true"
      aria-label="Loading recipe"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-xl md:aspect-square" />
      <div className="flex flex-col gap-4 md:justify-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}
