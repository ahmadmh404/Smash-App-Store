"use client";

import { useState, useTransition } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@/schemas";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSUbmit = (values: z.infer<typeof newPasswordSchema>) => {
    startTransition(() => {
      newPassword(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login!"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSUbmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="*******" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
