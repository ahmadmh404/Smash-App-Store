"use client";

import {
  FormBuilder,
  useFormBuilder,
} from "@/components/_builders/form/form-builder";
import {
  FormMessage,
  LoginSchemaValues,
} from "@/components/_builders/types/form";

import { login } from "@/actions/auth/login";
import { useMutation } from "@/lib/react-query/mutation";

import { LoginSchema } from "@/schemas";
import { LoginFormProps } from "@/forms";
import { z } from "zod";
import { signIn } from "next-auth/react";

export const LoginForm = () => {
  const formMessage: FormMessage | undefined = message
    ? { text: message.text.trim(), type: message.type, duration: 3000 }
    : undefined;

  const form = useFormBuilder<z.infer<typeof LoginSchema>>(LoginSchema);

  const onSubmit = async (data: LoginSchemaValues) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
    });
  };

  const { mutate, isLoading, message } = useMutation({
    mutationFn: (data: LoginSchemaValues) => onSubmit(data),
  });

  return (
    <FormBuilder
      form={form}
      onSubmit={mutate}
      message={formMessage}
      loading={isLoading}
      {...LoginFormProps}
    />
  );
};
