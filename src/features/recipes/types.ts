export type Ingredient = {
  /** Lowercase, trimmed name, e.g. "olive oil". Safe to compare directly. */
  name: string;
  /** Free-text measure as written by the source, e.g. "1 1/2 cups" or "pinch". */
  measure: string;
};

export type Recipe = {
  id: string;
  name: string;
  category: string;
  area: string;
  /** 700 px wide photo. */
  imageUrl: string;
  /** 350 px wide version of `imageUrl`. */
  thumbnailUrl: string;
  ingredients: Ingredient[];
  /** Instruction steps in order, without step numbers. */
  steps: string[];
  tags: string[];
  /** Base number of servings the measures are written for. */
  servings: number;
  youtubeUrl: string | null;
  sourceUrl: string | null;
};
