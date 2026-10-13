import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RecipeSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RecipeSearch({ value, onChange }: RecipeSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <Label htmlFor="recipe-search" className="sr-only">
        Search recipes
      </Label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="recipe-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by name, ingredient or cuisine"
          autoComplete="off"
          className="h-11 bg-card pl-10 text-base md:text-base"
        />
      </div>
    </form>
  );
}
