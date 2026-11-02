"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  isChild?: boolean;
}

const LoginButton = ({
  children,
  isChild,
  mode = "redirect",
}: LoginButtonProps) => {
  const router = useRouter();

  const onCLick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={isChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto p-0 border-none bg-transparent">
          <DialogTitle className="sr-only">
            <DialogDescription></DialogDescription>
          </DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span className="cursor-pointer" onClick={onCLick}>
      {children}
    </span>
  );
};

export default LoginButton;
