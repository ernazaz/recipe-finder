# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Pantry is a recipe web app and a portfolio project. Users list ingredients they have and get recipes ranked by match ("You have 5 of 6, missing: cumin"). Users can also browse by category, search, scale servings, save recipes and build a shopping list.

Code quality matters more than speed here: this repo is read by hiring managers. Prefer clear, idiomatic, well-typed code over clever code.

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # Type-check and production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (unit + component)
npm run test:e2e     # Playwright
npm run data:fetch   # Download TheMealDB recipes into src/data/recipes.json
```

Before saying a task is done, run `npm run typecheck`, `npm run lint` and `npm run test`, and fix any failures.

## Stack

- Vite, React, TypeScript (strict)
- Tailwind CSS, shadcn/ui (Radix), lucide-react icons
- React Router (`createBrowserRouter`)
- TanStack Query for server state
- Zustand for client state, persisted to localStorage
- Vitest + Testing Library, Playwright
- Data: TheMealDB, downloaded once into `src/data/recipes.json` (no live API calls at runtime)

Don't add new dependencies without asking first.

## Architecture

Feature-based folders. Path alias `@/` points to `src/`.

```
src/
├── app/            # main.tsx, router.tsx, providers.tsx, styles/globals.css
├── pages/          # One thin component per route
├── features/
│   ├── recipes/    # api/, components/, lib/, types.ts, index.ts
│   ├── fridge/     # components/, lib/matchRecipes.ts, store.ts, index.ts
│   ├── saved/
│   └── shopping-list/
├── components/
│   ├── ui/         # shadcn components (generated)
│   └── layout/     # AppLayout, Header, MainNav, MobileNav, Footer, SkipLink
├── lib/            # Generic helpers: utils.ts (cn), storage.ts
└── data/           # recipes.json (generated, do not edit by hand)
e2e/                # Playwright specs
scripts/            # fetch-recipes.ts
```

### Rules

- **Pages are thin.** They read route params, call feature hooks and compose feature components. No fetching or business logic in pages.
- **Cross-feature imports go through the feature's `index.ts`.** Write `import { RecipeCard } from "@/features/recipes"`, never a path into another feature's folders.
- **Inside a feature, import files directly** (`./components/RecipeCard`). Never import from your own feature's `index.ts`; it causes circular imports.
- **Only export from `index.ts` what other features or pages use.** Use explicit named exports and `export type` for types. No `export *`.
- **No barrels** in `pages/`, `app/`, `components/ui/`, or subfolders inside a feature.
- **Map external data to our own types at the edge.** Only `features/recipes/api/` knows TheMealDB's raw shape (`strIngredient1..20`, `strMeasure1..20`). Everything else uses `Recipe` and `Ingredient` from `features/recipes/types.ts`.
- **State has one home:**
  - Recipe data: TanStack Query hooks in `features/*/api/`
  - Fridge ingredients, saved recipes, shopping list: Zustand stores in `features/*/store.ts`
  - Search text, category, filters: URL search params
  - Local UI state: `useState`
- **Pure logic lives in `features/*/lib/`** as plain functions with a `.test.ts` next to each one.

## Code style

- Named exports only: `export function RecipeCard() {}`. No default exports (except where a tool requires one, like config files).
- Props are a `type` named `<Component>Props`, declared above the component.
- Function components only. No `React.FC`.
- Use `cn()` from `@/lib/utils` to merge class names.
- Tailwind utility classes only; no CSS modules or inline `style` objects.
- Use theme tokens (`bg-primary`, `text-muted-foreground`, `border-input`), never hard-coded hex colours in components.
- Use shadcn components (`Button`, `Input`, `Badge`, `Card`, `Checkbox`, `ToggleGroup`, `Progress`, `Alert`) before building custom ones. Add new ones with `npx shadcn@latest add <name>`.
- Don't edit files in `components/ui/` unless the task is specifically about changing a shared component.
- No `any`. Use `unknown` and narrow it.
- File names: `PascalCase.tsx` for components, `camelCase.ts` for everything else.

## Design

- Theme lives in `src/app/styles/globals.css` as shadcn CSS variables: background `#F6F7F2`, foreground `#1E2A22`, primary (herb green) `#2F5D44`, secondary `#E8EDE4`, muted-foreground `#4A574D`, border `#DDE2D6`, input `#C9D1C3`, ring/highlight (saffron) `#F4B22E`, radius `0.5rem`.
- Fonts: Bricolage Grotesque for headings (`font-display`), Karla for body text.
- Saffron is reserved for the main "Find recipes" action and AI-related highlights. Everything else uses primary or secondary.
- Interactive controls use `size="lg"` (44 px) for comfortable touch targets.
- Layout must work at 375 px wide. Desktop nav is `hidden md:flex`; the mobile bottom tab bar is `md:hidden`.

## Accessibility

- Use real elements: `<button>` for actions, `<a>`/`<Link>` for navigation, `<label>` for every input.
- Icon-only buttons need `aria-label`. Decorative icons get `aria-hidden="true"`.
- Toggle buttons expose `aria-pressed`. Progress bars use shadcn `Progress` (it sets ARIA attributes).
- Keep visible focus styles (`focus-visible:ring-2 ring-ring`). Never remove outlines without a replacement.
- `AppLayout`'s `<main>` has `id="main"` for the skip link.

## Testing

- Every function in `features/*/lib/` gets unit tests covering normal cases and edge cases (empty input, unknown units, "to taste", mixed fractions like "1 1/2").
- Component tests use Testing Library and query by role and accessible name (`getByRole("button", { name: /save recipe/i })`), not by test IDs or class names.
- E2E specs in `e2e/` cover the main flows: search and open a recipe, filter by category (URL updates), fridge matching, servings scaling, saving a recipe.
- When fixing a bug, add a test that fails without the fix.

## Data

- `src/data/recipes.json` is generated by `scripts/fetch-recipes.ts`. Don't edit it by hand; change the script and re-run `npm run data:fetch`.
- Ingredient names are normalised to lowercase and trimmed at fetch time, so matching can compare strings directly.
- TheMealDB has no cooking times and its measures are free text ("1/2 cup", "pinch"). `parseMeasure` handles common formats; anything it can't parse is shown as written and not scaled.

## Git

- Small, focused commits with imperative messages: `Add servings scaler to recipe page`.
- Don't commit `.env` files, build output or editor settings.

## Not yet built

These are planned; don't scaffold them unless asked:

- Node.js API with Postgres and auth
- Monorepo (`apps/web`, `apps/api`, `packages/shared`)
- AI suggestions on the fridge page
- Spoonacular as a data source
