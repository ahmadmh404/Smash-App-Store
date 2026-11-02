import { useContext } from "react";
import { QueryClientContext } from "@/lib/react-query/query-client-provider";
import { QueryClient } from "@/lib/react-query/query-client";

export const useQueryClient = (): QueryClient => {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error("useQueryClient must be used within a QueryClientProvider");
  }
  return context;
};
