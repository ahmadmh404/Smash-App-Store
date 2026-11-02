"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@/lib/react-query/use-query-client";

import {
  InfiniteQuery,
  TPage,
  TCursor,
  CreateQueryProps,
  Query,
  UseQueryOptions,
  InfiniteQueryResponse,
  ReturnMessageType,
} from "./types";

export function createInfiniteQuery<TData>({
  queryKey,
  queryFn,
  getNextPageParam,
  staleTime,
}: {
  queryKey: any[];
  queryFn: ({
    pageParam,
  }: {
    pageParam?: any;
  }) => Promise<InfiniteQueryResponse<TData>>;
  getNextPageParam: (lastPage: TPage<TData>) => any;
  staleTime?: number;
}): InfiniteQuery<TData> {
  const query: InfiniteQuery<TData> = {
    queryKey,
    state: {
      status: "idle",
      isFetching: false,
      pages: [],
      error: undefined,
      isFetchingNextPage: false,
      hasNextPage: false,
      async fetchNextPage() {
        if (!this.pages.length) return;
        const nextParam = getNextPageParam(this.pages[this.pages.length - 1]);
        if (!nextParam) return;
        await query.fetch(nextParam);
      },
    },

    queryHash: JSON.stringify(queryKey),
    subscribers: [],

    subscribe(subscriber) {
      query.subscribers.push(subscriber);
      return () => {
        query.subscribers = query.subscribers.filter((s) => s !== subscriber);
      };
    },

    setState(updater) {
      query.state = updater(query.state);
      query.subscribers.forEach((s) => s.notify());
    },

    async fetch(pageParam?: any) {
      if (!query.fetchingFunction) {
        query.fetchingFunction = async () => {
          query.setState((s) => ({ ...s, isFetching: true, error: undefined }));

          try {
            await queryFn({ pageParam })?.then((newPage) => {
              const message: ReturnMessageType | undefined = newPage
                ? "error" in newPage
                  ? {
                      text: newPage.error || "something went wrong",
                      type: "error",
                    }
                  : "success" in newPage
                  ? { text: newPage.success || "Success", type: "success" }
                  : undefined
                : undefined;

              query.setState((s) => ({
                ...s,
                status: "success",
                data: [...(s.pages || []), newPage],
                message,
                lastUpdated: Date.now(),
                hasNextPage:
                  "page" in newPage! ? !!newPage.page.nextCursor : false,
              }));
            });
          } catch (err) {
            query.setState((s) => ({
              ...s,
              status: "error",
              error: err,
            }));
          } finally {
            query.fetchingFunction = null;
            query.setState((s) => ({ ...s, isFetching: false }));
          }
        };
        await query.fetchingFunction();
      }
    },

    fetchingFunction: null,

    staleTime,
  };

  return query;
}

export function useInfiniteQuery<TData>({
  queryKey,
  queryFn,
  getNextPageParam,
}: {
  queryKey: any[];
  queryFn: ({
    pageParam,
  }: {
    pageParam?: TCursor;
  }) => Promise<InfiniteQueryResponse<TData>>;
  getNextPageParam: (lastPage: TPage<TData>) => any;
}) {
  const queryClient = useQueryClient();

  const queryRef = useRef(
    queryClient?.getInfiniteQuery({
      queryKey,
      queryFn,
      getNextPageParam,
    })
  );

  if (!queryRef.current?.state) return;

  const [, forceUpdate] = useState(0);
  const rerender = () => forceUpdate((c) => c + 1);

  useEffect(() => {
    return (
      queryRef.current && queryRef?.current.subscribe({ notify: rerender })
    );
  }, []);

  const fetchNextPage = () => {
    const state = queryRef?.current?.state;
    const lastPage = state?.pages[state?.pages.length - 1];
    if (!lastPage) return;
    const nextParam = getNextPageParam(lastPage);
    if (nextParam !== undefined) {
      queryRef?.current?.fetch(nextParam);
    }
  };

  return {
    ...queryRef.current.state,
    fetchNextPage,
  };
}

export const createQuery = <TData,>({
  queryKey,
  queryFn,
  staleTime = 1 * 60 * 1000,
}: CreateQueryProps<TData>) => {
  const query: Query<TData> = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
    fetchingFunction: null,
    subscribers: [],
    state: {
      status: "idle",
      isFetching: false,
      data: undefined,
      error: undefined,
      lastUpdated: undefined,
    },

    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);
      return () => {
        query.subscribers = query.subscribers.filter((s) => s !== subscriber);
      };
    },

    setState: (updater) => {
      query.state = updater(query.state);
      query.subscribers.forEach((s) => s.notify());
    },

    fetch: async () => {
      if (!query.fetchingFunction) {
        query.fetchingFunction = async () => {
          query.setState((oldState) => {
            return {
              ...oldState,
              isFetching: true,
              error: undefined,
            };
          });

          try {
            const res = await queryFn();
            const data = "data" in res! ? res.data : undefined;
            const message: ReturnMessageType | undefined = res
              ? "error" in res
                ? { text: res.error || "Something went wrong", type: "error" }
                : "success" in res
                ? { text: res.success || "Success", type: "success" }
                : undefined
              : undefined;

            query.setState((oldState) => {
              return {
                ...oldState,
                message,
                status: "success",
                data,
                lastUpdated: Date.now(),
              };
            });
          } catch (error) {
            query.setState((oldState) => {
              return {
                ...oldState,
                status: "error",
                error,
              };
            });
          } finally {
            query.fetchingFunction = null;
            query.setState((oldState) => {
              return {
                ...oldState,
                isFetching: false,
              };
            });
          }
        };
        query.fetchingFunction();
      }
    },

    staleTime,
  };

  return query as Query<TData>;
};

const createQueryObserver = <TData,>({
  queryKey,
  queryFn,
  staleTime = 1 * 60 * 1000,
}: UseQueryOptions<TData>) => {
  const query = useQueryClient().getQuery({
    queryKey,
    queryFn,
    staleTime,
  });

  const observer = {
    query,
    notify: () => {},
    subscribe: (rerender: () => void) => {
      const unsubscribe = query.subscribe(observer);
      observer.notify = rerender;

      const isStale =
        !query.state.lastUpdated ||
        Date.now() - query.state.lastUpdated > staleTime;

      if (isStale && !query.state.isFetching) {
        query.fetch();
      }

      return unsubscribe;
    },
    getState: () => query.state,
  };

  return observer;
};

export const useQuery = <TData,>({
  queryKey,
  queryFn,
  staleTime,
}: UseQueryOptions<TData>) => {
  const observerRef = useRef(
    createQueryObserver({ queryKey, queryFn, staleTime })
  );

  const observer = observerRef.current;

  const state = useSyncExternalStore(
    observer.subscribe,
    observer.getState,
    observer.getState
  );

  return state;
};
