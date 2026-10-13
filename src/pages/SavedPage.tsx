import { PageContainer } from "@/components/layout";
import { SavedRecipes } from "@/features/saved";

export function SavedPage() {
  return (
    <PageContainer className="flex flex-col gap-8">
      <title>Saved recipes · Pantry</title>
      <h1 className="text-4xl font-bold md:text-5xl">Saved recipes</h1>
      <SavedRecipes />
    </PageContainer>
  );
}
