import { CookingPot } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import {
  RecipeCard,
  RecipeGrid,
  RecipeGridSkeleton,
  useRecipes,
} from "@/features/recipes";
import { AddToShoppingListButton } from "@/features/shopping-list";
import { matchRatio, matchRecipes, type RecipeMatch } from "../lib/matchRecipes";
import { useFridgeStore } from "../store";

const MAX_RESULTS = 24;
const MAX_MISSING_LISTED = 4;

export function FridgeMatches() {
  const ingredients = useFridgeStore((state) => state.ingredients);
  const { data: recipes, isPending, isError } = useRecipes();

  if (ingredients.length === 0) return null;
  if (isPending) return <RecipeGridSkeleton count={4} />;
  if (isError) return <ErrorAlert />;

  const matches = matchRecipes(recipes, ingredients).slice(0, MAX_RESULTS);

  return (
    <section aria-labelledby="matches-heading" className="flex flex-col gap-5">
      <h2 id="matches-heading" className="text-2xl font-semibold">
        Recipes you can make
      </h2>
      {matches.length === 0 ? (
        <EmptyState
          icon={CookingPot}
          title="No matches yet"
          description="None of our recipes use those ingredients. Try adding something more common, like eggs, onion or rice."
        />
      ) : (
        <RecipeGrid>
          {matches.map((match) => (
            <li key={match.recipe.id}>
              <MatchCard match={match} />
            </li>
          ))}
        </RecipeGrid>
      )}
    </section>
  );
}

type MatchCardProps = {
  match: RecipeMatch;
};

function MatchCard({ match }: MatchCardProps) {
  const { recipe, have, missing } = match;
  const total = have.length + missing.length;

  return (
    <RecipeCard recipe={recipe}>
      <div className="flex flex-col gap-3">
        <Progress value={Math.round(matchRatio(match) * 100)}>
          <ProgressLabel className="font-normal">
            You have <strong>{have.length}</strong> of {total}
          </ProgressLabel>
        </Progress>
        {missing.length === 0 ? (
          <p className="text-sm font-medium text-primary">
            You have everything!
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Missing: {formatMissing(missing)}
            </p>
            {/* Sits above the card's stretched link so it stays clickable. */}
            <div className="relative z-10">
              <AddToShoppingListButton
                recipe={recipe}
                ingredients={recipe.ingredients.filter((ingredient) =>
                  missing.includes(ingredient.name),
                )}
                label="Add missing to list"
              />
            </div>
          </>
        )}
      </div>
    </RecipeCard>
  );
}

function formatMissing(missing: string[]): string {
  const listed = missing.slice(0, MAX_MISSING_LISTED).join(", ");
  const rest = missing.length - MAX_MISSING_LISTED;
  return rest > 0 ? `${listed} and ${rest} more` : listed;
}
