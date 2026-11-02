import { useSession } from "next-auth/react";
import { cache } from "react";

export const useCurrentuser = cache(() => {
  const session = useSession();

  return session.data?.user;
});
