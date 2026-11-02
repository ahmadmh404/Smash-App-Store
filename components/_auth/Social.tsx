"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAUTL_LOGIN_REDIRECT } from "@/routes";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const Social = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const onCLick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAUTL_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        variant={"outline"}
        size={"lg"}
        className="flex-1"
        onClick={() => onCLick("google")}
      >
        <FcGoogle className="size-5" />
      </Button>

      <Button
        variant={"outline"}
        size={"lg"}
        className="flex-1"
        onClick={() => onCLick("github")}
      >
        <FaGithub className="size-5" />
      </Button>
    </div>
  );
};
