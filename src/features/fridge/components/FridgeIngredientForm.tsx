import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIngredientNames } from "@/features/recipes";
import { useFridgeStore } from "../store";

export function FridgeIngredientForm() {
  const [value, setValue] = useState("");
  const addIngredient = useFridgeStore((state) => state.addIngredient);
  const { data: suggestions = [] } = useIngredientNames();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    addIngredient(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="fridge-ingredient" className="text-base">
        Add an ingredient
      </Label>
      <div className="flex gap-2">
        <Input
          id="fridge-ingredient"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          list="ingredient-suggestions"
          placeholder="e.g. chicken, rice, garlic"
          autoComplete="off"
          className="h-11 bg-card text-base md:text-base"
        />
        <datalist id="ingredient-suggestions">
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <Button type="submit" size="lg">
          <Plus aria-hidden="true" />
          Add
        </Button>
      </div>
    </form>
  );
}
