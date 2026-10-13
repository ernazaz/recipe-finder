import { CookingPot } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PageContainer } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <PageContainer>
      <title>Page not found · Pantry</title>
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={CookingPot}
        title="We couldn't find that page"
        description="The link may be broken, or the page may have moved."
        action={
          <Link to="/" className={buttonVariants({ size: "lg" })}>
            Back to recipes
          </Link>
        }
      />
    </PageContainer>
  );
}
