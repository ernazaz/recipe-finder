import { Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { groupShoppingItems } from "../lib/groupShoppingItems";
import { useShoppingListStore } from "../store";
import type { ShoppingItem } from "../types";

export function ShoppingList() {
  const items = useShoppingListStore((state) => state.items);
  const clearChecked = useShoppingListStore((state) => state.clearChecked);
  const clearAll = useShoppingListStore((state) => state.clearAll);
  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <div className="flex flex-col gap-8">
      <AddItemForm />

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBasket}
          title="Your shopping list is empty"
          description="Add ingredients from any recipe, or type items above."
          action={
            <Link to="/" className={buttonVariants({ size: "lg" })}>
              Browse recipes
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground" aria-live="polite">
              {checkedCount} of {items.length} checked
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="lg"
                className="bg-card"
                onClick={clearChecked}
                disabled={checkedCount === 0}
              >
                Clear checked
              </Button>
              <Button variant="ghost" size="lg" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          </div>

          {groupShoppingItems(items).map((group) => (
            <section
              key={group.id ?? "other"}
              aria-label={group.title}
              className="flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold">
                {group.id ? (
                  <Link
                    to={`/recipes/${group.id}`}
                    className="rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {group.title}
                  </Link>
                ) : (
                  group.title
                )}
              </h2>
              <ul className="divide-y rounded-xl border bg-card">
                {group.items.map((item) => (
                  <ShoppingListItem key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

type ShoppingListItemProps = {
  item: ShoppingItem;
};

function ShoppingListItem({ item }: ShoppingListItemProps) {
  const toggleItem = useShoppingListStore((state) => state.toggleItem);
  const removeItem = useShoppingListStore((state) => state.removeItem);

  return (
    <li className="flex items-center gap-2 pr-1 pl-4">
      <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 py-2">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => toggleItem(item.id)}
          className="size-5"
        />
        <span
          className={cn(
            "capitalize",
            item.checked && "text-muted-foreground line-through",
          )}
        >
          {item.name}
          {item.measure && (
            <>
              {" "}
              <span className="text-muted-foreground normal-case">
                · {item.measure}
              </span>
            </>
          )}
        </span>
      </label>
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={`Remove ${item.name}`}
        onClick={() => removeItem(item.id)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </li>
  );
}

function AddItemForm() {
  const [value, setValue] = useState("");
  const addItem = useShoppingListStore((state) => state.addItem);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addItem(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="shopping-item" className="text-base">
        Add an item
      </Label>
      <div className="flex gap-2">
        <Input
          id="shopping-item"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. washing-up liquid"
          autoComplete="off"
          className="h-11 bg-card text-base md:text-base"
        />
        <Button type="submit" size="lg" disabled={!value.trim()}>
          <Plus aria-hidden="true" />
          Add
        </Button>
      </div>
    </form>
  );
}
