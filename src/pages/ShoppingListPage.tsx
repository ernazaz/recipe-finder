import { PageContainer } from "@/components/layout";
import { ShoppingList } from "@/features/shopping-list";

export function ShoppingListPage() {
  return (
    <PageContainer className="flex max-w-3xl flex-col gap-8">
      <title>Shopping list · Pantry</title>
      <h1 className="text-4xl font-bold md:text-5xl">Shopping list</h1>
      <ShoppingList />
    </PageContainer>
  );
}
