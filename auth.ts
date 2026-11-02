import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { IUser } from "./next-auth";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "auth/error",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user?.id) return false;

      const existingUser = await getUserById(Number(user.id));

      if (!existingUser) {
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.user) {
        session.user = token.user as IUser;
      }

      return session;
    },

    async jwt({ user, token }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
