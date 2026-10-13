import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Recipe } from "@/features/recipes";
// Test infrastructure may reach into a feature to seed its query cache.
import { recipesQuery } from "@/features/recipes/api/queries";

type RenderOptions = {
  recipes?: Recipe[];
  /** Initial URL. */
  route?: string;
  /** Route pattern for `ui`, so `useParams` works. */
  path?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { recipes = [], route = "/", path = "*" }: RenderOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(recipesQuery.queryKey, recipes);

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}
