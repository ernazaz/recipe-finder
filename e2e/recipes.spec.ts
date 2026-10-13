import { expect, test } from "@playwright/test";

test("search for a recipe and open it", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search recipes" }).fill("teriyaki");
  await expect(page).toHaveURL(/\?q=teriyaki/);

  await page.getByRole("link", { name: "Teriyaki Chicken Casserole" }).click();

  await expect(page).toHaveURL(/\/recipes\/52772$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Teriyaki Chicken Casserole" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
});

test("filter by category updates the URL and results", async ({ page }) => {
  await page.goto("/");

  const filters = page.getByRole("group", { name: "Filter by category" });
  await filters.getByRole("button", { name: "Goat" }).click();

  await expect(page).toHaveURL(/category=Goat/);
  await expect(filters.getByRole("button", { name: "Goat" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("link", { name: "Jamaican Curry Goat" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Pancakes" })).toHaveCount(0);

  // The filter survives a reload because it lives in the URL.
  await page.reload();
  await expect(page.getByRole("link", { name: "Jamaican Curry Goat" })).toBeVisible();
});

test("scale servings on a recipe", async ({ page }) => {
  await page.goto("/recipes/52854");

  const ingredients = page.getByRole("region", { name: "Ingredients" });
  await expect(ingredients.getByRole("listitem").filter({ hasText: "flour" })).toContainText("100g");

  await page.getByRole("button", { name: "Increase servings" }).click();
  await page.getByRole("button", { name: "Increase servings" }).click();
  await page.getByRole("button", { name: "Increase servings" }).click();
  await page.getByRole("button", { name: "Increase servings" }).click();

  await expect(page.getByRole("status", { name: "8 servings" })).toBeVisible();
  await expect(ingredients.getByRole("listitem").filter({ hasText: "flour" })).toContainText("200g");
  // Measures that can't be parsed stay as written.
  await expect(ingredients.getByRole("listitem").filter({ hasText: "sugar" })).toContainText("to serve");
});

test("save a recipe and find it on the saved page", async ({ page }) => {
  await page.goto("/recipes/52854");

  const save = page.getByRole("button", { name: "Save recipe" });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("link", { name: "Saved" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Saved recipes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Pancakes" })).toBeVisible();

  // Saved recipes persist across reloads.
  await page.reload();
  await expect(page.getByRole("link", { name: "Pancakes" })).toBeVisible();
});
