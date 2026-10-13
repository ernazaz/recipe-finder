import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

type ServingsScalerProps = {
  value: number;
  onChange: (servings: number) => void;
};

export function ServingsScaler({ value, onChange }: ServingsScalerProps) {
  return (
    <div role="group" aria-labelledby="servings-label" className="flex items-center gap-3">
      <span id="servings-label" className="font-medium">
        Servings
      </span>
      <div className="flex items-center gap-1 rounded-lg border bg-card p-0.5">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Decrease servings"
          disabled={value <= MIN_SERVINGS}
          onClick={() => onChange(value - 1)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <output
          aria-live="polite"
          aria-label={`${value} servings`}
          className="min-w-8 text-center text-lg font-semibold tabular-nums"
        >
          {value}
        </output>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Increase servings"
          disabled={value >= MAX_SERVINGS}
          onClick={() => onChange(value + 1)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
