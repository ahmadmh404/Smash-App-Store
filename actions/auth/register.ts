"use server";

import * as z from "zod";
import { registerSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { IUser } from "@/next-auth";
import { signIn } from "@/auth";
import { DEFAUTL_LOGIN_REDIRECT } from "@/routes";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedValues = registerSchema.safeParse(values);

  if (!validatedValues.success) return { error: "Invalid Fields!" };

  const data = validatedValues.data;

  const existingUser = await getUserByEmail(data.email);

  if (existingUser) return { error: "Email already taken!" };

  try {
    const res = await db.post("/register", data);

    const { user, token }: { user: IUser; token: string } = res.data;

    if (!user || !token) return { error: "Something went wrong.." };

    signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: true,
      redirectTo: DEFAUTL_LOGIN_REDIRECT,
    });

    return { success: "Logging in..." };
  } catch (error: any) {
    console.log("REGISTER_ERROR", error?.message);
    return { error: error?.message as string };
  }
};
