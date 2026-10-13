import { PageContainer } from "@/components/layout";
import {
  FridgeIngredientForm,
  FridgeIngredientList,
  FridgeMatches,
} from "@/features/fridge";

export function FridgePage() {
  return (
    <PageContainer className="flex flex-col gap-10">
      <title>My fridge · Pantry</title>
      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold md:text-5xl">What's in your fridge?</h1>
          <p className="text-lg text-muted-foreground">
            Add what you have and we'll rank recipes by how many ingredients
            you've already got.
          </p>
        </div>
        <FridgeIngredientForm />
        <FridgeIngredientList />
      </div>
      <FridgeMatches />
    </PageContainer>
  );
}
