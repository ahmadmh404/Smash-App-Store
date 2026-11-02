import { QueryClient } from "@/lib/react-query/query-client";

type STATUS = "idle" | "pending" | "success" | "error";

export type QueryResponse<TData> =
  | { data: TData }
  | { success?: string }
  | { error?: string }
  | null;

export type InfiniteQueryResponse<TData> =
  | { page: TPage<TData> }
  | { success?: string }
  | { error?: string }
  | null;

type QueryKey = any[];

export type TChildren = {
  children: React.ReactNode;
};

export interface GetQueryProps<TData extends any> {
  queryKey: QueryKey;
  queryFn: () => Promise<QueryResponse<TData>>;

  staleTime: number;
}

export interface ReactQueryProvider {
  children: React.ReactNode;
}

export type UseQueryOptions<TData extends any> = {
  queryKey: QueryKey;
  queryFn: () => Promise<QueryResponse<TData>>;
  staleTime?: number;
};

export type TCursor = any;

export type TPage<TData> = {
  data: TData[];
  nextCursor: TCursor;
};

export type InfiniteQueryOptions<TData extends any> = {
  queryKey: QueryKey;
  queryFn: ({
    pageParam,
  }: {
    pageParam?: TCursor;
  }) => Promise<InfiniteQueryResponse<TData>>;
  getNextPageParam: (lastPage: TPage<TData>) => TCursor | undefined;
  staleTime?: number;
};

export type InfiniteQuery<TData extends any> = {
  queryKey: QueryKey;
  queryHash: string;
  state: InfiniteQueryState<TPage<TData>>;
  subscribers: any[];
  setState: (
    updater: (
      state: InfiniteQueryState<TPage<TData>>
    ) => InfiniteQueryState<TPage<TData>>
  ) => void;
  fetch: (pageParam?: any) => Promise<void>;
  fetchingFunction: null | (() => void);
  subscribe: (subscriber: { notify: () => void }) => () => void;
  staleTime?: number;
};

export type InfiniteQueryState<TPages, TError = unknown> = {
  status: STATUS;
  pages: TPages[];
  error?: TError;
  message?: ReturnMessageType;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
};

export type QueryState<TData extends any> = {
  status: STATUS;
  isFetching: boolean;
  message?: ReturnMessageType;
  data?: TData;
  error?: unknown;
  lastUpdated?: number;
};

export type Query<TData extends any> = {
  queryKey: QueryKey;
  queryHash: string;
  state: QueryState<TData>;
  subscribers: any[];
  setState: (updater: (state: QueryState<TData>) => QueryState<TData>) => void;
  fetch: () => void;
  fetchingFunction: null | (() => void);
  subscribe: (subscriber: { notify: () => void }) => () => void;
  staleTime?: number;
};

export type CreateQueryProps<TData extends any> = {
  queryKey: QueryKey;
  queryFn: () => Promise<QueryResponse<TData>>;
  staleTime?: number;
};

// ===================== MUATIONS TYPES ==================

export type MutationResponse<TData> =
  | { data: TData }
  | { success: string }
  | { error: string };

export type ReturnMessageType = {
  type: "error" | "success";
  text: string;
};

export type MutationState<TData = unknown, TError = unknown> = {
  status: "idle" | "pending" | "success" | "error";
  data?: TData;
  error?: TError;
  message?: ReturnMessageType;
  isLoading: boolean;
};

export type MutationOptions<TData, TVariables, TError = unknown> = {
  mutationFn: (
    vars: TVariables
  ) => Promise<MutationResponse<TData>> | Promise<void>;
  onMutate?: (vars: TVariables) => void | Promise<void>;
  onSuccess?: (data: TData | undefined, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
};

export type UseMutationReturn<TData, TVariables, TError> = MutationState<
  TData,
  TError
> & {
  mutate: (variables: TVariables) => Promise<void>;
};
