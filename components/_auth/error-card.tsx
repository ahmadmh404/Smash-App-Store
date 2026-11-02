import { CardWrapper } from "@/components/_auth/card-wrapper";
import { TriangleAlert } from "lucide-react";

export const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerLabel="Oops, Something went wrong!"
    >
      <TriangleAlert className="size-10 mx-auto text-destructive" />
    </CardWrapper>
  );
};
