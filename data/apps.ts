import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TPage } from "@/lib/react-query/types";
import { BackendInfiniteData, IApp } from "@/types";

// get app by id
export const getAppById = async (appId: number) => {
  try {
    const res = await db.get(`/apps/getAppById/${appId}`);

    const { app }: { app: IApp } = (await res).data;

    if (!app) return;

    return { app };
  } catch (error) {
    return null;
  }
};

// get user purchased apps
export const getUserPurchasedApps = async ({
  pageParam,
  userId,
}: {
  pageParam: string | null;
  userId: number;
}) => {
  const user = await currentUser();

  if (!user?.token) return null;

  try {
    const res = await db.get(
      `/apps/getUserPurchasedApps/${user.id}?cursor=${pageParam}`
    );

    const { apps }: { apps: BackendInfiniteData<IApp[]> } = res.data;

    if (!apps) return null;

    const page: TPage<IApp> = {
      data: apps.data,
      nextCursor: apps.next_cursor,
    };

    return { page };
  } catch (error) {
    console.log("GET_USER_PURCHASED_APPS: ", error);
    return null;
  }
};
