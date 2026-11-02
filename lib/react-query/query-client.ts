import { createInfiniteQuery } from "@/lib/react-query/query";
import { createQuery } from "@/lib/react-query/query";
import {
  InfiniteQueryOptions,
  InfiniteQuery,
  Query,
  GetQueryProps,
} from "./types";

export class QueryClient {
  private qs: Query<any>[] = [];
  private infQs: InfiniteQuery<any>[] = [];

  constructor() {
    this.qs = [];
    this.infQs = [];
  }

  getQuery = <TData>({
    queryFn,
    queryKey,
    staleTime,
  }: GetQueryProps<TData>): Query<TData> => {
    const queryHash = JSON.stringify(queryKey);

    let query = this.qs.find((q) => q.queryHash === queryHash) as Query<TData>;

    if (!query) {
      query = createQuery({ queryKey, queryFn, staleTime });
      this.qs.push(query);

      // Auto-remove query after staleTime
      setTimeout(() => {
        this.qs = this.qs.filter((q) => q !== query);
      }, staleTime);
    }

    return query;
  };

  getInfiniteQuery = <TData>({
    queryKey,
    queryFn,
    getNextPageParam,
    staleTime = 5 * 60 * 1000,
  }: InfiniteQueryOptions<TData>): InfiniteQuery<TData> => {
    const queryHash = JSON.stringify(queryKey);

    let query = this.infQs.find(
      (q) => q.queryHash === queryHash
    ) as InfiniteQuery<TData>;

    if (!query) {
      query = createInfiniteQuery({ queryKey, queryFn, getNextPageParam });
      this.infQs.push(query);

      setTimeout(() => {
        this.infQs = this.infQs.filter((q) => q !== query);
      }, staleTime);
    }

    return query;
  };

  getQueryData<TData = unknown>(queryKey: any[]): TData | undefined {
    const queryHash = JSON.stringify(queryKey);
    const query = this.qs.find((q) => q.queryHash === queryHash);
    return query?.state.data as TData;
  }

  setQueryData<TData = unknown>(queryKey: any[], data: TData) {
    const queryHash = JSON.stringify(queryKey);
    const query = this.qs.find((q) => q.queryHash === queryHash);
    if (query) {
      query.setState((old) => ({
        ...old,
        status: "success",
        data,
        lastUpdated: Date.now(),
        isFetching: false,
      }));
    }
  }

  invalidateQueries(queryKey: any[]) {
    const queryHash = JSON.stringify(queryKey);
    const query = this.qs.find((q) => q.queryHash === queryHash);
    if (query) {
      query.fetch();
    }
  }

  cancelQuery(queryKey: any[]) {
    const queryHash = JSON.stringify(queryKey);
    const query = this.qs.find((q) => q.queryHash === queryHash);
    if (query?.fetchingFunction) {
      query.fetchingFunction = null;
      query.setState((old) => ({
        ...old,
        isFetching: false,
        status: "idle",
      }));
    }
  }

  clear() {
    this.qs = [];
    this.infQs = [];
  }
}
