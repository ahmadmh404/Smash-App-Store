"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetSchema } from "@/schemas";
import * as z from "zod";

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

import { reset } from "@/actions/reset";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSUbmit = (values: z.infer<typeof resetSchema>) => {
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password!"
      backButtonLabel="Back to login!"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSUbmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
