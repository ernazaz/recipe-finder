import { expect, test } from "@playwright/test";

test("rank recipes by the ingredients in your fridge", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Find recipes" }).click();
  await expect(page).toHaveURL(/\/fridge$/);

  const input = page.getByLabel("Add an ingredient");
  for (const ingredient of ["flour", "eggs", "milk"]) {
    await input.fill(ingredient);
    await input.press("Enter");
  }

  await expect(page.getByRole("button", { name: "Remove eggs" })).toBeVisible();

  const matches = page.getByRole("region", { name: "Recipes you can make" });
  await expect(matches.getByRole("progressbar").first()).toBeVisible();
  await expect(matches.getByRole("listitem").first()).toContainText(/You have \d+ of \d+/);

  // Removing an ingredient updates the list; the fridge persists across reloads.
  await page.getByRole("button", { name: "Remove milk" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Remove eggs" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Remove milk" })).toHaveCount(0);
});

test("add a recipe's ingredients to the shopping list", async ({ page }) => {
  await page.goto("/recipes/52854");

  await page.getByRole("button", { name: "Add to shopping list" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Added" })).toContainText(
    "Added 7 items",
  );

  await page.getByRole("link", { name: /^(Shopping list|List)$/ }).click();
  await expect(page.getByRole("link", { name: "Pancakes" })).toBeVisible();

  const flour = page.getByRole("checkbox", { name: /flour/i });
  await flour.click();
  await expect(flour).toBeChecked();
});
