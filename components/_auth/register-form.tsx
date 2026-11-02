"use client";

import {
  FormBuilder,
  useFormBuilder,
} from "@/components/_builders/form/form-builder";
import { useMutation } from "@/lib/react-query/mutation";
import { register } from "@/actions/auth/register";

import { registerSchema } from "@/schemas";
import { registerFormProps } from "@/forms";
import { z } from "zod";

export const RegisterForm = () => {
  const { mutate, isLoading, message } = useMutation({ mutationFn: register });
  const form = useFormBuilder<z.infer<typeof registerSchema>>(registerSchema);

  return (
    <>
      <FormBuilder
        form={form}
        onSubmit={mutate}
        loading={isLoading}
        {...registerFormProps}
      />
    </>
  );
};
