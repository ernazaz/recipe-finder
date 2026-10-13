import { useSearchParams } from "react-router-dom";
import type { RecipeFilters } from "../lib/filterRecipes";

const QUERY_PARAM = "q";
const CATEGORY_PARAM = "category";

/** Search text and category, stored in the URL so results are shareable. */
export function useRecipeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: RecipeFilters = {
    query: searchParams.get(QUERY_PARAM) ?? "",
    category: searchParams.get(CATEGORY_PARAM),
  };

  function setParam(name: string, value: string | null) {
    setSearchParams(
      (params) => {
        if (value) params.set(name, value);
        else params.delete(name);
        return params;
      },
      // Typing shouldn't push a history entry per keystroke.
      { replace: name === QUERY_PARAM },
    );
  }

  return {
    filters,
    setQuery: (query: string) => setParam(QUERY_PARAM, query),
    setCategory: (category: string | null) =>
      setParam(CATEGORY_PARAM, category),
  };
}
