# Pantry

Tell Pantry what's in your fridge and it ranks recipes by how many of the ingredients you already have: _"You have 5 of 6, missing: cumin"_. You can also browse by category, search, scale servings, save recipes and build a shopping list.

Built with React, TypeScript, Tailwind CSS and shadcn/ui. Recipes come from [TheMealDB](https://www.themealdb.com).

## Features

- **Fridge matching**: add ingredients and get recipes sorted by fewest missing ingredients, with a progress bar and the missing items. "Chicken" matches "chicken breast" but not "chickpeas".
- **Browse and search**: search by name, ingredient, cuisine or tag, and filter by category. Filters live in the URL, so results can be shared and survive a reload.
- **Servings scaling**: parses free-text measures ("1 1/2 cups", "200g", "½ tsp", "4-6 cloves") and scales them, showing cook-friendly fractions. Measures it can't parse ("pinch", "to taste") are shown as written.
- **Saved recipes and shopping list**: stored in `localStorage`, grouped by recipe, with checkboxes. You can add a recipe's ingredients at the current servings, or only the ones you're missing.
- **Accessible and mobile first**: semantic HTML, a skip link, labelled controls, `aria-pressed` toggles, 44 px touch targets and a bottom tab bar on small screens.

## Getting started

Requires Node 24+.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `npm run build`      | Type-check and build for production                  |
| `npm run typecheck`  | Type-check only                                      |
| `npm run lint`       | ESLint                                               |
| `npm run test`       | Unit and component tests (Vitest + Testing Library)  |
| `npm run test:e2e`   | End-to-end tests (Playwright, desktop and mobile)    |
| `npm run data:fetch` | Re-download recipes into `src/data/recipes.json`     |

Before the first E2E run, install a browser with `npx playwright install chromium`.

## How it's built

```
src/
├── app/          # Entry point, router, providers, global styles
├── pages/        # One thin component per route
├── features/
│   ├── recipes/  # Data loading, search, recipe card and details, measure parsing
│   ├── fridge/   # Fridge store, ingredient matching
│   ├── saved/    # Saved recipes store and views
│   └── shopping-list/
├── components/   # shadcn/ui, layout and feedback components
└── lib/          # cn(), persisted storage
```

- **Feature folders** each have a public `index.ts`. Other features and pages import only from that file.
- **One home per kind of state**: recipe data is in TanStack Query; the fridge, saved recipes and shopping list are in Zustand stores persisted to `localStorage`; search and category are URL params; everything else is `useState`.
- **External data is mapped at the edge.** `features/recipes/api/mealDb.ts` is the only code that knows TheMealDB's response shape (`strIngredient1..20`). The fetch script uses it to write our own `Recipe` type to `recipes.json`, and the app loads that file lazily as its own chunk. There are no API calls at runtime.
- **Pure logic is unit tested.** Measure parsing, scaling, filtering, matching and grouping are plain functions in `features/*/lib/`, each with a test file next to it.

## Limitations

- TheMealDB doesn't record servings, so every recipe assumes it serves 4.
- Ingredient matching uses simple word and plural rules, not a synonym list, so "scallions" won't match "spring onions".
