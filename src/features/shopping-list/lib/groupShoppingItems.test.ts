import { describe, expect, it } from "vitest";
import type { ShoppingItem } from "../types";
import { OTHER_ITEMS_TITLE, groupShoppingItems } from "./groupShoppingItems";

function item(
  id: string,
  recipe: ShoppingItem["recipe"] = null,
): ShoppingItem {
  return { id, name: id, measure: "", recipe, checked: false };
}

const curry = { id: "1", name: "Curry" };
const pie = { id: "2", name: "Pie" };

describe("groupShoppingItems", () => {
  it("groups items by recipe in the order recipes were added", () => {
    const groups = groupShoppingItems([
      item("rice", curry),
      item("apples", pie),
      item("cumin", curry),
    ]);

    expect(groups.map((group) => group.title)).toEqual(["Curry", "Pie"]);
    expect(groups[0].items.map((i) => i.id)).toEqual(["rice", "cumin"]);
  });

  it("puts items added by hand in a last group", () => {
    const groups = groupShoppingItems([item("soap"), item("rice", curry)]);

    expect(groups.map((group) => [group.id, group.title])).toEqual([
      ["1", "Curry"],
      [null, OTHER_ITEMS_TITLE],
    ]);
  });

  it("returns no groups for an empty list", () => {
    expect(groupShoppingItems([])).toEqual([]);
  });
});
