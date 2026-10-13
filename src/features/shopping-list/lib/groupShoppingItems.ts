import type { ShoppingItem, ShoppingItemGroup } from "../types";

export const OTHER_ITEMS_TITLE = "Other items";

/**
 * Groups items by the recipe they came from, keeping the order in which each
 * recipe was first added. Items added by hand come last.
 */
export function groupShoppingItems(items: ShoppingItem[]): ShoppingItemGroup[] {
  const groups = new Map<string | null, ShoppingItemGroup>();

  for (const item of items) {
    const id = item.recipe?.id ?? null;
    const group = groups.get(id) ?? {
      id,
      title: item.recipe?.name ?? OTHER_ITEMS_TITLE,
      items: [],
    };
    group.items.push(item);
    groups.set(id, group);
  }

  const other = groups.get(null);
  groups.delete(null);
  return other ? [...groups.values(), other] : [...groups.values()];
}
