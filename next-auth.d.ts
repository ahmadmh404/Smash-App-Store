import { UserRole } from "@prisma/client";
import { type User, type DefaultSession } from "next-auth";

export type IUserTYpe = "admin" | "developer" | "user";

export type Badge = {
  label: string;
  icon: React.JSX.Element;
};

export type IUser = {
  id: number;
  type: IUserTYpe;
  avatar: string | null;
  name: string;
  email: string;
  password: string;
  token: string;
  badges: Badge[];
  emailVerified: Date;
  created_at: string;
  verified: boolean;
} & User;

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}
