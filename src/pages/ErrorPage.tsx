import { useRouteError } from "react-router-dom";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageContainer } from "@/components/layout";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <PageContainer>
      <title>Something went wrong · Pantry</title>
      <h1 className="sr-only">Something went wrong</h1>
      <ErrorAlert description="An unexpected error stopped this page from loading. Please refresh and try again." />
    </PageContainer>
  );
}
