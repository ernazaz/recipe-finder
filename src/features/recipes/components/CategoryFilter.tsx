import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCategories } from "../api/queries";

const ALL = "all";

type CategoryFilterProps = {
  value: string | null;
  onChange: (category: string | null) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data: categories } = useCategories();

  if (!categories) return <Skeleton className="h-11 w-full" />;

  return (
    // Scrolls sideways on small screens instead of wrapping into many rows.
    <div className="-mx-4 overflow-x-auto px-4 py-1 md:mx-0 md:overflow-visible md:px-0">
      <ToggleGroup
        aria-label="Filter by category"
        value={[value ?? ALL]}
        onValueChange={([next]) => onChange(!next || next === ALL ? null : next)}
        variant="outline"
        size="lg"
        className="w-max md:w-auto md:flex-wrap"
      >
        {[ALL, ...categories].map((category) => (
          <ToggleGroupItem
            key={category}
            value={category}
            className="bg-card aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {category === ALL ? "All" : category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
