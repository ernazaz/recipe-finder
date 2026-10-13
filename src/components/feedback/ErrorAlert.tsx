import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ErrorAlertProps = {
  title?: string;
  description?: string;
};

export function ErrorAlert({
  title = "Something went wrong",
  description = "We couldn't load the recipes. Please refresh the page and try again.",
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <CircleAlert aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
