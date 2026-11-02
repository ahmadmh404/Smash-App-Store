import { db } from "@/lib/db";
import { IUser } from "@/next-auth";

export const getUserById = async (userId: number) => {
  try {
    const res = await db.get(`/users/getUserById/${userId}`);

    const { user }: { user: IUser } = res.data;

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};

export const checkCredentials = async (email: string, password: string) => {
  try {
    const res = await db.post(`/CheckCredentials`, {
      email,
      password,
    });

    const { user, token }: { user: IUser; token: string } = res.data;

    if (!user || !token) return null;

    return { ...user, token };
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await db.get(`/users/getUserByEmail/${email}`);
    const { user }: { user: IUser } = res.data;

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};
