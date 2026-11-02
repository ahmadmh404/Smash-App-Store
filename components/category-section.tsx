"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";

import { IApp, MainCategories } from "@/types";
import { useInfiniteQuery } from "@/lib/react-query/query";
import { getCategoryApps } from "@/data/categories";
import { Loader, LoadingWrapper } from "./ui/loader";
import { DefaultFormMessage } from "./_builders/form/form-message";
import { InfiniteScrollContainer } from "./shared/infinite-scroll-container";
import { apps } from "@/constants";

interface CategorySectionProps {
  title: MainCategories;
  showLarge?: boolean;
}

export const CategorySection = ({
  title,
  showLarge = false,
}: CategorySectionProps) => {
  let titleText = "";

  switch (title) {
    case "featured":
      titleText = "Featured";
      break;

    case "top-rated":
      titleText = "Top Rated";
      break;

    case "apps":
      titleText = "Apps";
      break;

    case "games":
      titleText = "Games";
      break;

    default:
      "Section";
  }

  const query = useInfiniteQuery<IApp>({
    queryFn: () => getCategoryApps(title),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    queryKey: [`${title}-apps`],
  });

  // const apps = query?.pages.flatMap((page) => page.data) || [];

  if (query?.error) {
    return (
      <DefaultFormMessage
        message={{ type: "error", text: query.error as string }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{titleText}</h2>
        <Button variant="ghost" size="sm">
          See All
        </Button>
      </div>
      {query?.isFetching ? (
        <Loading />
      ) : (
        <ScrollArea className="w-full whitespace-nowrap">
          <InfiniteScrollContainer
            className="flex gap-4 pb-4"
            onBottomReached={() =>
              !query?.isFetching && query?.hasNextPage && query.fetchNextPage()
            }
          >
            {/* Replace mock apps with apps */}
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                size={showLarge ? "large" : "default"}
              />
            ))}

            {query?.isFetchingNextPage && <Loading />}
          </InfiniteScrollContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

function Loading() {
  return (
    <Loader size="md" variant="spinner" className="text-muted-foreground/70" />
  );
}
