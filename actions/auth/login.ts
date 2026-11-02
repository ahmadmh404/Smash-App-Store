"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAUTL_LOGIN_REDIRECT } from "@/routes";

interface LoginProps {
  values: z.infer<typeof LoginSchema>;
  callbackUrl?: string | null;
}

export const login = async ({ values, callbackUrl }: LoginProps) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields!" };

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAUTL_LOGIN_REDIRECT,
    });

    return { success: "Logging in...!" };
  } catch (error) {
    console.log("LOGIN_ERROR", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
