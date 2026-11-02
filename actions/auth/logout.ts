"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // do some stuff
  await signOut();
};
