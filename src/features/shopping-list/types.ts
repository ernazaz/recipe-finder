export type ShoppingItem = {
  id: string;
  name: string;
  measure: string;
  /** The recipe this item was added from, or null for items added by hand. */
  recipe: { id: string; name: string } | null;
  checked: boolean;
};

export type ShoppingItemGroup = {
  /** Recipe id, or null for items added by hand. */
  id: string | null;
  title: string;
  items: ShoppingItem[];
};
