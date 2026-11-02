"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { Header } from "@/components/_auth/Header";
import { BackButton } from "@/components/_auth/back-button";
import { Social } from "./Social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  backButtonHref,
  backButtonLabel,
  children,
  headerLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} title="Smash" />
      </CardHeader>
      <CardContent>{children}</CardContent>

      {showSocial && <Social />}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
