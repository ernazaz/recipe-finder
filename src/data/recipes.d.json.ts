// Types the generated recipes.json so TypeScript doesn't infer a literal type
// for the whole file. Requires `allowArbitraryExtensions` in tsconfig.
import type { Recipe } from "@/features/recipes/types";

declare const recipes: Recipe[];
export default recipes;
