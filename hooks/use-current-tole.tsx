"use client";

import { useSession } from "next-auth/react";

export const currentRole = () => {
  const session = useSession();

  return session.data?.user.type;
};
