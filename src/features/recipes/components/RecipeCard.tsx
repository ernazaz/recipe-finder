import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "../types";

type RecipeCardProps = {
  recipe: Recipe;
  /** Extra content below the title, e.g. match details on the fridge page. */
  children?: ReactNode;
};

export function RecipeCard({ recipe, children }: RecipeCardProps) {
  return (
    // The title link stretches over the whole card (after:inset-0), so the
    // card is one tab stop. Interactive children sit above it with z-10.
    <Card className="relative h-full gap-3 transition-shadow hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <img
        src={recipe.thumbnailUrl}
        srcSet={`${recipe.thumbnailUrl} 350w, ${recipe.imageUrl} 700w`}
        sizes="(min-width: 640px) 350px, 100vw"
        alt=""
        loading="lazy"
        decoding="async"
        width={350}
        height={263}
        className="aspect-[4/3] w-full bg-secondary object-cover"
      />
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          <h3>
            <Link
              to={`/recipes/${recipe.id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {recipe.name}
            </Link>
          </h3>
        </CardTitle>
        <CardDescription>
          {recipe.area} · {recipe.category}
        </CardDescription>
      </CardHeader>
      {children && <CardContent className="mt-auto">{children}</CardContent>}
    </Card>
  );
}
