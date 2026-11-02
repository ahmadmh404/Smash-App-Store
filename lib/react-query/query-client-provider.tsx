"use client";

import { createContext, useState } from "react";
import { QueryClient } from "@/lib/react-query/query-client";

import { ReactQueryProvider } from "./types";

export const QueryClientContext = createContext<QueryClient | null>(null);

export const QueryClientProvider = ({ children }: ReactQueryProvider) => {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
};
