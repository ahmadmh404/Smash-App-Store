"use client";

import { getCategories, getCategoryApps } from "@/data/categories";
import { useInfiniteQuery, useQuery } from "@/lib/react-query/query";

export const useGetCategories = () => {
  return useQuery({ queryFn: getCategories, queryKey: [`categories`] });
};

export const useGetCategoryApps = (category: string) => {
  return useInfiniteQuery({
    queryFn: () => getCategoryApps(category),
    queryKey: [`${category}-apps`],
    getNextPageParam(lastPage) {
      return lastPage.nextCursor;
    },
  });
};
