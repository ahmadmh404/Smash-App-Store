import { db } from "@/lib/db";
import { TPage } from "@/lib/react-query/types";
import { IApp, ICategory, MainCategories } from "@/types";
import { BackendInfiniteData } from "../types";

export const getCategories = async () => {
  const res = await db.get(`/categories/getCategories`);

  const { categories }: { categories: ICategory } = res.data;

  if (!categories) return null;

  return { categories };
};

export const getCategoryApps = async (categoryName: MainCategories) => {
  try {
    const res = await db.get(`/apps/getAppByCategory/${categoryName}`);

    console.log("category apps data: ", res.data);
    const { apps }: { apps: BackendInfiniteData<IApp[]> } = res.data;

    if (!apps) return null;

    const page: TPage<IApp> = {
      data: apps.data,
      nextCursor: apps.next_cursor,
    };

    return { page };
  } catch (error) {
    return null;
  }
};
