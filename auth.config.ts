import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/schemas";
import { checkCredentials } from "@/data/user";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);

        if (validatedData.success) {
          const { email, password } = validatedData.data;

          const user = await checkCredentials(email, password);

          console.log("authorize user: ", user);

          if (!user || !user.token) return null;

          return user;
        }

        return null;
      },
    }),
  ],

  debug: process.env.NODE_ENV === "development" ? true : false,

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
