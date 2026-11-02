"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerificationToken } from "@/actions/new-verification";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { MoonLoader } from "react-spinners";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerificationToken(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Conforming your account!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex flex-col items-center justify-center">
        {!error && !success && <MoonLoader className="animate-spin" />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
