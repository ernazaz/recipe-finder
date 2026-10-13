import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const GRID_CLASSES = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

type RecipeGridProps = {
  /** `<li>` elements, usually wrapping a `RecipeCard`. */
  children: ReactNode;
  className?: string;
};

export function RecipeGrid({ children, className }: RecipeGridProps) {
  return <ul className={cn(GRID_CLASSES, className)}>{children}</ul>;
}

type RecipeGridSkeletonProps = {
  count?: number;
};

export function RecipeGridSkeleton({ count = 8 }: RecipeGridSkeletonProps) {
  return (
    <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
